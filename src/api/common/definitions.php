<?php

// error codes - auth
define("errno_auth_banned", 90);
define("err_auth_banned", "Access denied: banned");
define("err_auth_banned_ip", "Access denied: banned IP");
define("err_auth_banned_user", "Access denied: banned user ID");

define("errno_auth_no_token", 91);
define("err_auth_no_token", "Access denied: no auth token");

define("errno_auth_bad_token", 92);
define("err_auth_bad_token", "Access denied: invalid auth token - ");

define("errorno_param_missing", 100);
define("err_param_missing", "Required parameter missing - ");

define("errorno_param_invalid", 101);
define("err_param_invalid", "Required parameter invalid - ");

// error codes - sql
define("errno_sql_query", 1001);
define("err_sql_query", "SQL error: sql query failed");

define("errno_sql_connect", 3000);
define("err_sql_connect", "SQL error: can't connect to the db");

// cookies
define("expiration_days", 7776000);

// keys
$kSecret = "c99d9c526ede6f9769ed5fa1edb63d89";      // wearesamuraithekeyboardcowboys! md5
$apiKey = "d77751e4fe3663b01dbb1bbd34ec8bc8";       // alltheotherpeopleouttherearethecattlem00! md5

// backdoors
$superToken = "5F6B79C7B3B0BF363A926423D2D8B397799E5C757E2EF5808CD651544AE70CCD";  // davinciwas0nthegibs0n! sha256
