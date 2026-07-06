<?php
// Copie este arquivo para "config.php" (mesma pasta) e preencha com os valores reais.
// config.php NUNCA deve ir para o git (já está no .gitignore).

return [
    // Credenciais do MySQL — mesmas do phpMyAdmin/cPanel. Host quase sempre "localhost"
    // quando o script roda no mesmo servidor HostGator do banco.
    'mysql' => [
        'host' => 'localhost',
        'database' => 'funerari_banco',
        'user' => 'SEU_USUARIO_MYSQL',
        'password' => 'SUA_SENHA_MYSQL',
        'table' => 'ms_obituario',
    ],

    // Projeto Supabase (novo site).
    'supabase' => [
        'url' => 'https://SEU_PROJETO.supabase.co',
        // Service Role Key (Project Settings > API). Tem permissão total — nunca
        // exponha no frontend, só aqui, num script que roda no servidor.
        'service_role_key' => 'SUA_SERVICE_ROLE_KEY',
    ],

    // Quantas linhas buscar por lote em cada execução do cron.
    'batch_size' => 300,

    // Quantos lotes processar em uma única execução (para acelerar o backfill inicial
    // sem estourar o tempo máximo de execução do PHP no cPanel).
    'max_batches_per_run' => 5,
];
