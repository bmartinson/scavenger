<?php
require_once(ABSPATH . 'common/db-definitions.php');

// error codes - auth
define("errno_auth_banned", 90);
define("err_auth_banned", "Access denied: banned");
define("err_auth_banned_ip", "Access denied: banned IP");
define("err_auth_banned_user", "Access denied: banned user ID");

define("errno_auth_no_token", 91);
define("err_auth_no_token", "Access denied: no auth token");

define("errno_auth_bad_token", 92);
define("err_auth_bad_token", "Access denied: invalid auth token - ");

define("errno_request", 93);
define("err_request", "Request method unsupported");

define("errorno_param_missing", 100);
define("err_param_missing", "Required parameter missing - ");

define("errorno_param_invalid", 101);
define("err_param_invalid", "Required parameter invalid - ");

define("errorno_invalid_user", 102);
define("err_invalid_user", "Invalid user credentials");

// error codes - sql
define("errno_sql_query", 1001);
define("err_sql_query", "SQL error: sql query failed");

define("errno_sql_connect", 3000);
define("err_sql_connect", "SQL error: can't connect to the db");

// cookies
define("expiration_days", 7776000);

// keys imported by the db-definitions file are
// $kSecret
// $apiKey
// $superToken
