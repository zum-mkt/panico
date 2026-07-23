<?php
/**
 * Sincroniza (somente leitura) a tabela ms_obituario do sistema legado (MySQL/HostGator)
 * para a tabela `obituaries` do Supabase (novo site).
 *
 * - Nunca escreve, altera ou apaga nada em ms_obituario — apenas SELECT.
 * - Idempotente: usa `legacy_id` (obi_id) como chave de upsert no Supabase.
 * - Incremental: guarda em state.json o maior obi_id já sincronizado, para não
 *   reprocessar tudo a cada execução.
 *
 * Como rodar: cadastrar como Cron Job no cPanel, ex:
 *   php /home/SEUUSUARIO/legacy-sync/sync-obituarios.php >> /home/SEUUSUARIO/legacy-sync/sync.log 2>&1
 * a cada 15-30 minutos.
 */

declare(strict_types=1);

ini_set('display_errors', '0');
error_reporting(E_ALL);

register_shutdown_function(function (): void {
    $error = error_get_last();
    if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        echo '[' . date('Y-m-d H:i:s') . '] ERRO FATAL: ' . $error['message']
            . ' em ' . $error['file'] . ':' . $error['line'] . "\n";
    }
});

$configPath = __DIR__ . '/config.php';
if (!file_exists($configPath)) {
    fwrite(STDERR, "config.php não encontrado. Copie config.example.php para config.php e preencha.\n");
    exit(1);
}

$config = require $configPath;
$statePath = __DIR__ . '/state.json';

function log_line(string $message): void
{
    echo '[' . date('Y-m-d H:i:s') . "] $message\n";
}

function load_state(string $path): array
{
    if (!file_exists($path)) {
        return ['last_legacy_id' => 0];
    }
    $raw = json_decode((string) file_get_contents($path), true);
    return is_array($raw) ? $raw : ['last_legacy_id' => 0];
}

function save_state(string $path, array $state): void
{
    file_put_contents($path, json_encode($state, JSON_PRETTY_PRINT));
}

/**
 * Datas "zeradas" do MySQL (ex: '0000-00-00') não são datas inválidas para o
 * PHP — DateTime as interpreta "rolando pra trás" (mês/dia 0), virando algo
 * como ano -1, que o Postgres rejeita. Trata como "sem data" (null).
 */
function parse_legacy_datetime(string $value, string $format, DateTimeZone $timezone): ?string
{
    $dt = DateTime::createFromFormat($format, $value, $timezone);
    if ($dt === false || (int) $dt->format('Y') < 1900) {
        return null;
    }
    return $dt->format(DateTime::ATOM);
}

/**
 * Mapeia uma linha de ms_obituario para o formato da tabela `obituaries` do Supabase.
 * Ajuste aqui se os nomes das colunas do MySQL forem diferentes do esperado.
 */
function map_row(array $row): array
{
    // Postgres rejeita byte nulo (\0) em colunas de texto — dado legado do MySQL
    // às vezes vem com esse lixo. Remove de todo campo antes de montar o payload.
    $row = array_map(
        static fn ($value) => is_string($value) ? str_replace("\0", '', $value) : $value,
        $row,
    );

    $timezone = new DateTimeZone('America/Sao_Paulo');

    // deceased_at é obrigatório na tabela (not null, sem default) — sem uma data
    // de falecimento real, esse registro do legado não pode virar um obituário.
    $deceasedAt = trim((string) ($row['obi_dt_faleciment'] ?? ''));
    if ($deceasedAt === '' || str_starts_with($deceasedAt, '0000-00-00')) {
        throw new InvalidArgumentException('sem deceased_at (obi_dt_faleciment vazio/zerado)');
    }

    $burialAt = !empty($row['obi_dt_sep'])
        ? parse_legacy_datetime($row['obi_dt_sep'] . ' ' . ($row['obi_hr_sep'] ?? '00:00'), 'Y-m-d H:i', $timezone)
        : null;

    // created_at precisa de um valor em toda linha (não dá pra omitir a chave só
    // em algumas: o Supabase exige que todo objeto do lote tenha as mesmas
    // chaves). Sem data real do legado, usa a hora do sync como fallback — é
    // exatamente o que o default da coluna faria sozinho.
    $createdAt = (!empty($row['obi_msdata'])
        ? parse_legacy_datetime($row['obi_msdata'], 'Y-m-d H:i:s', $timezone)
        : null) ?? (new DateTime('now', $timezone))->format(DateTime::ATOM);

    $burialLocationParts = array_filter([
        trim((string) ($row['obi_sep'] ?? '')),
        trim((string) ($row['obi_cid_sep'] ?? '')),
    ]);

    return [
        'legacy_id' => (int) $row['obi_id'],
        'name' => trim((string) ($row['obi_nome'] ?? '')),
        'deceased_at' => $deceasedAt,
        'age' => is_numeric($row['obi_idade'] ?? null) ? (int) $row['obi_idade'] : null,
        'spouse_name' => trim((string) ($row['obi_conj'] ?? '')) ?: null,
        'children_names' => trim((string) ($row['obi_filhos'] ?? '')) ?: null,
        'wake_location' => trim((string) ($row['obi_velorio'] ?? '')) ?: null,
        'wake_at' => null,
        'burial_location' => $burialLocationParts ? implode(' — ', $burialLocationParts) : null,
        'burial_at' => $burialAt,
        'status' => 'published',
        'created_at' => $createdAt,
    ];
}

function upsert_to_supabase(array $config, array $rows): void
{
    if (!$rows) {
        return;
    }

    $url = rtrim($config['supabase']['url'], '/') . '/rest/v1/obituaries?on_conflict=legacy_id';
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST => 'POST',
        CURLOPT_POSTFIELDS => json_encode($rows),
        CURLOPT_HTTPHEADER => [
            'Content-Type: application/json',
            'apikey: ' . $config['supabase']['service_role_key'],
            'Authorization: Bearer ' . $config['supabase']['service_role_key'],
            'Prefer: resolution=merge-duplicates,return=minimum',
        ],
    ]);
    $response = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($status < 200 || $status >= 300) {
        throw new RuntimeException("Supabase retornou HTTP $status: $response");
    }
}

// ---------------------------------------------------------------------------

$mysqli = new mysqli(
    $config['mysql']['host'],
    $config['mysql']['user'],
    $config['mysql']['password'],
    $config['mysql']['database'],
);
if ($mysqli->connect_errno) {
    fwrite(STDERR, 'Erro ao conectar no MySQL: ' . $mysqli->connect_error . "\n");
    exit(1);
}
$mysqli->set_charset('utf8mb4');

$state = load_state($statePath);
$table = $config['mysql']['table'];
$batchSize = $config['batch_size'] ?? 300;
$maxBatches = $config['max_batches_per_run'] ?? 5;

$totalSynced = 0;

for ($batch = 0; $batch < $maxBatches; $batch++) {
    $lastId = (int) $state['last_legacy_id'];

    // can_data preenchido significa que o obituário foi cancelado no sistema legado.
    $stmt = $mysqli->prepare(
        "SELECT * FROM `$table` WHERE obi_id > ? AND can_data IS NULL ORDER BY obi_id ASC LIMIT ?",
    );
    $stmt->bind_param('ii', $lastId, $batchSize);
    $stmt->execute();
    $result = $stmt->get_result();

    $rows = [];
    $maxIdInBatch = $lastId;
    $fetchedCount = 0;
    while ($row = $result->fetch_assoc()) {
        $fetchedCount++;
        // Avança o cursor mesmo quando o registro é pulado, senão a próxima
        // execução tentaria o mesmo obi_id ruim para sempre.
        $maxIdInBatch = max($maxIdInBatch, (int) $row['obi_id']);
        try {
            $rows[] = map_row($row);
        } catch (Throwable $e) {
            log_line('AVISO: pulando obi_id=' . $row['obi_id'] . ' — ' . $e->getMessage());
        }
    }
    $stmt->close();

    if ($fetchedCount === 0) {
        break;
    }

    try {
        upsert_to_supabase($config, $rows);
    } catch (Throwable $e) {
        log_line(
            'ERRO ao sincronizar lote (obi_id de ' . ($lastId + 1) . " até $maxIdInBatch): "
            . $e->getMessage(),
        );
        break;
    }

    $state['last_legacy_id'] = $maxIdInBatch;
    save_state($statePath, $state);

    $totalSynced += count($rows);
    log_line('Sincronizados ' . count($rows) . " registros (até obi_id=$maxIdInBatch).");

    if ($fetchedCount < $batchSize) {
        break;
    }
}

$mysqli->close();

log_line($totalSynced > 0 ? "Concluído: $totalSynced registro(s) sincronizado(s)." : 'Nada novo para sincronizar.');
