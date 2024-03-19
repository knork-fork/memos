<?php

$env = '/var/memos/php/config.dist';
$envLocal = '/var/memos/php/config.local';

if (!file_exists($env)) {
    throw new Exception("env file does not exist! @ " . __DIR__);
}
loadEnvFile($env);

if (file_exists($envLocal)) {
    loadEnvFile($envLocal);
}

function loadEnvFile(string $filePath): void
{
    $lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        throw new Exception("Unable to read the .env file!");
    }

    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        list($name, $value) = explode('=', $line, 2);
        $name = trim($name);
        $value = trim($value);

        // Handle values with quotes
        if (preg_match('/\A([\'"])(.*)\1\z/', $value, $matches)) {
            $value = $matches[2];
        }

        putenv("$name=$value");
    }
}

function getStringEnv(string $var): string
{
    $value = getenv($var);
    if (!is_string($value)) {
        throw new Exception("Invalid environment variable $var");
    }
    return $value;
}