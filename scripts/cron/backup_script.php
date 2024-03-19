#!/usr/bin/php -q
<?php

require_once('/var/memos/php/LoadEnvironment.php');
$discordWebhookUrl = getenv('DISCORD_WEBHOOK_URL');
$sendToDiscord = $discordWebhookUrl !== false && $discordWebhookUrl !== 'dummy';

$timestamp = date('Y-m-d H:i:s');
if ($sendToDiscord) {
    discord_output('backup script starting at ' . $timestamp, $discordWebhookUrl);
}

function discord_output($message, $webhook_url)
{
    $data = json_encode(["content" => $message]);
    $curl = curl_init();    
    curl_setopt($curl, CURLOPT_URL, $webhook_url);
    curl_setopt($curl, CURLOPT_HTTPHEADER, array("Content-Type: application/json"));
    curl_setopt($curl, CURLOPT_POST, 1);
    curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
    curl_exec($curl);
    curl_close($curl);
}