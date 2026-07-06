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
 * Mapeia uma linha de ms_obituario para o formato da tabela `obituaries` do Supabase.
 * Ajuste aqui se os nomes das colunas do MySQL forem diferentes do esperado.
 */
function map_row(array $row): array
{
    $timezone = new DateTimeZone('America/Sao_Paulo');

    $burialAt = null;
    if (!empty($row['obi_dt_sep'])) {
        $time = $row['obi_hr_sep'] ?? '00:00';
        $dt = DateTime::createFromFormat('Y-m-d H:i', $row['obi_dt_sep'] . ' ' . $time, $timezone);
        if ($dt !== false) {
            $burialAt = $dt->format(DateTime::ATOM);
        }
    }

    $createdAt = null;
    if (!empty($row['obi_msdata'])) {
        $dt = DateTime::createFromFormat('Y-m-d H:i:s', $row['obi_msdata'], $timezone);
        if ($dt !== false) {
            $createdAt = $dt->format(DateTime::ATOM);
        }
    }

    $burialLocationParts = array_filter([
        trim((string) ($row['obi_sep'] ?? '')),
        trim((string) ($row['obi_cid_sep'] ?? '')),
    ]);

    $messageParts = array_filter([
        !empty($row['obi_conj']) ? 'Cônjuge: ' . trim($row['obi_conj']) : null,
        !empty($row['obi_filhos']) ? trim($row['obi_filhos']) : null,
    ]);

    return [
        'legacy_id' => (int) $row['obi_id'],
        'name' => trim((string) ($row['obi_nome'] ?? '')),
        'deceased_at' => $row['obi_dt_faleciment'] ?? null,
        'wake_location' => trim((string) ($row['obi_velorio'] ?? '')) ?: null,
        'wake_at' => null,
        'burial_location' => $burialLocationParts ? implode(' — ', $burialLocationParts) : null,
        'burial_at' => $burialAt,
        'message' => $messageParts ? implode("\n", $messageParts) : null,
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
    while ($row = $result->fetch_assoc()) {
        $rows[] = map_row($row);
        $maxIdInBatch = max($maxIdInBatch, (int) $row['obi_id']);
    }
    $stmt->close();

    if (!$rows) {
        break;
    }

    upsert_to_supabase($config, $rows);

    $state['last_legacy_id'] = $maxIdInBatch;
    save_state($statePath, $state);

    $totalSynced += count($rows);
    log_line('Sincronizados ' . count($rows) . " registros (até obi_id=$maxIdInBatch).");

    if (count($rows) < $batchSize) {
        break;
    }
}

$mysqli->close();

log_line($totalSynced > 0 ? "Concluído: $totalSynced registro(s) sincronizado(s)." : 'Nada novo para sincronizar.');
