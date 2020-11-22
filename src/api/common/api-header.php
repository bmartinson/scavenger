<?php

// create the input and response documents
$requestDoc = new DOMDocument();
$responseDoc = new DOMDocument();

// check for banned IP addresses
if (isset($_SERVER['HTTP_X_FORWARDED_FOR'])) {
  // check if the IP requesting is banned
  if (checkBlacklistIP($_SERVER['HTTP_X_FORWARDED_FOR']))
    throw new Exception(err_auth_banned_ip, errno_auth_banned);
}

// retrieve the id of the issued command
if (isset($_GET['commandid']))
  $commandId = $_GET['commandid'];
else if (isset($_POST['commandid']))
  $commandId = $_POST['commandid'];
else
  $commandId = '0';

// get the authentication token
if (isset($_GET['authToken']))
  $authToken = $_GET['authToken'];
else if (isset($_GET['authtoken']))
  $authToken = $_GET['authtoken'];
else if (isset($_POST['authToken']))
  $authToken = $_POST['authToken'];
else if (isset($_POST['authtoken']))
  $authToken = $_POST['authtoken'];
else
  $authToken = "";

// decode the auth token and any extra info that we need
if (strlen($authToken) > 0) {
  $authToken = urldecode($authToken);

  // confirm we have a good auth token
  if (needsAuthToken($endpoint) && !verifyAuthToken($authToken) || noSuperToken($endpoint, $authToken))
    throw new Exception((err_auth_bad_token . $authToken), errno_auth_bad_token);
} else if (needsAuthToken($endpoint))
  throw new Exception(err_auth_no_token, errno_auth_no_token);

// decompress the payload
if (isset($_POST['payloadX'])) {
  $decoded = base64_decode($_POST['payloadX']);
  $uncompressed = gzuncompress($decoded);
  $_POST['payload'] = $uncompressed;
}

// fetch the user id from the authToken
$userID = getUserIDFromAuthToken($authToken);

// check if the user from the auth token is banned
if (checkBlacklistID($userID))
  throw new Exception(err_auth_banned_user, errno_auth_banned);

// set the appropriate timezone (use 'US/Pacific' as default)
if (isset($_REQUEST['timezone'])) {
  if ($_REQUEST['timezone'] != "") {
    $timeZoneArray = explode(' ', $_REQUEST['timezone']);
    date_default_timezone_set($timeZoneArray[0]);
  } else
    date_default_timezone_set('US/Pacific');
} else
  date_default_timezone_set('US/Pacific');
