<?php

require_once('blacklist.php');
require_once('definitions.php');

/**
 * Execute SQL and return the result.
 *
 * @param {database} $database - A reference to an open database connection.
 * @param {string} $sql - The SQL to execute.
 */
function &ExecuteSQL($database, $sql)
{
  // execute a query
  if (!($result = $database->query($sql)))
    throw new Exception($database->error, errno_sql_query);

  return $result;
}

/**
 * Get the sanitized data value for SQL insertion.
 *
 * @param {database} $database - A reference to an open database connection.
 * @param {*} $theValue - The value to sanitize.
 * @param {string} $theType - The data type.
 */
function GetSQLValueStringi($database, $theValue, $theType)
{
  if (empty($database)) {
    return "";
  }

  switch ($theType) {
    case "text":
      $theValue = (isset($theValue) && $theValue != "") ? "'" . $database->real_escape_string($theValue) . "'" : "NULL";
      break;
    case "long":
    case "int":
      $theValue = (isset($theValue) && $theValue != "") ? intval($theValue) : "NULL";
      break;
    case "double":
      $theValue = (isset($theValue) && $theValue != "") ? "'" . floatval($theValue) . "'" : "NULL";
      break;
    case "date":
      $theValue = (isset($theValue) && $theValue != "") ? "'" . $theValue . "'" : "NULL";
      break;
    case "boolean":
      $theValue = (isset($theValue) && $theValue != "") ? $theValue : "NULL";
      break;
  }
  return $theValue;
}

/**
 * Open a write database
 */
function &openWriteDatabase()
{
  global $dbURL;
  global $dbUsername;
  global $dbPassword;
  global $dbName;
  global $dbPort;

  // create the new database class
  $dbWrite = new mysqli($dbURL, $dbUsername, $dbPassword, $dbName, $dbPort);

  // confirm a good connection to the db
  if (mysqli_connect_errno())
    throw new Exception(mysqli_connect_error(), errno_sql_connect);

  return $dbWrite;
}

/**
 * Generates an auth token for a user
 */
function generateAuthToken($userId, $firstName, $apiKey, $remember, $returnKey = false, &$ssoAuth = false)
{
  global $kSecret;

  $replaceSymbols = array('&', '+');
  $firstName = str_replace($replaceSymbols, '', $firstName);

  $expirationTime = time() + expiration_days; // now + 90 days
  $plainText = "t=$expirationTime&u=$userId&a=$apiKey&n=$firstName";
  $mac = hash_hmac('sha256', $plainText, $kSecret);
  $authToken = $plainText . '&d=' . $mac;

  if (!$returnKey) {
    if ($remember)
      setcookie('authToken', $authToken, $expirationTime, '/');
    else
      setcookie('authToken', $authToken, 0, '/');

    // check for session cookie
    if (!isset($_COOKIE['authToken1']))
      setcookie('authToken1', time(), $expirationTime, '/');
    return true;
  } else
    return $authToken;
}

/**
 * Verifies that an auth token is valid
 *
 * @param {string} $authToken - A SHA-256 encoded string that is to be verified for API access.
 * @return {boolean} - True, if this authToken is valid.
 */
function verifyAuthToken($authToken)
{
  global $kSecret;
  global $superToken;

  if ($authToken == $superToken)
    return true;

  $authArray = explode('&', $authToken);

  // make sure that the auth token hasn't expired
  if (substr(strstr($authArray[0], '='), 1) > time()) {
    $mac = hash_hmac('sha256', $authArray[0] . '&' . $authArray[1] . '&' . $authArray[2] . '&' . $authArray[3], $kSecret);

    if ($mac == substr(strstr($authArray[4], '='), 1))
      return true;
  }
  return false;
}

/**
 * Takes an authToken and returns the user id piece of the token array. If the token itself is bad
 * or is a super user token, then the token will be treated as user id 0.
 *
 * @param {string} $authToken - A SHA-256 encoded string that is to be verified for API access.
 * @return {int} - The user id contained in the authToken.
 */
function getUserIDFromAuthToken($authToken)
{
  global $superToken;

  // if the authToken is the super token, treat it as user 0
  if ($authToken == $superToken) {
    return 0;
  }

  // split the authToken
  $authArray = explode('&', $authToken);

  // check to see that the second parameter in the token exists and is an integer value
  if (isset($authArray) && sizeof($authArray) >= 2) {
    $id = intval(str_replace('u=', '', $authArray[1]));
    if (is_int($id)) {
      return $id;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
}

/**
 * Checks to see if the requested endpoint requires authToken verification before use.
 *
 * @param {string} $endpoint - The name of the end point that is being requested.
 * @return {boolean} - True, if this endpoint requires a valid authToken to be executed.
 */
function needsAuthToken($endpoint)
{
  if (
    $endpoint == 'health-check' ||
    $endpoint == 'user' && $_SERVER['REQUEST_METHOD'] == 'POST' ||
    $endpoint == 'authorize' && $_SERVER['REQUEST_METHOD'] == 'POST'
  ) {
    return false;
  } else {
    return true;
  }
}

/**
 * Checks to see if a required superToken is lacking.
 *
 * @param {string} $endpoint - The name of the end point that is being requested.
 * @param {string} $authToken - The authToken that is being used for this specific endpoint.
 * @return {boolean} - True if the endpoint requires the superToken but the authToken isn't the superToken.
 */
function noSuperToken($endpoint, $authToken)
{
  global $superToken;

  // if ($authToken != $superToken) {
  //   return ($endpoint == "job-name-requiring-super-token");
  // }

  return false;
}

/**
 * Performs a CURL operation to another endpoint and returns a json decoded object of the response.
 *
 * @param {string} $url - The url to execute a CURL request for.
 * @return {object} JSON decoded object array/
 */
function curl($url)
{
  // initialize the CURL request
  $ch = curl_init();
  curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
  curl_setopt($ch, CURLOPT_URL, $url);

  // execute the CURL request
  $result = curl_exec($ch);

  // close and return
  curl_close($ch);
  return json_decode($result, true);
}
