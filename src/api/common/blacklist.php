<?php

$blacklistIP = array(
  //none
);

$blacklistID = array(
  // none
);

/**
 * This function checks an IP address to see if it is listed as a known IP address
 * that is disallowed from accessing the API.
 *
 * {param} $ipAddress - The IP address to check.
 */
function checkBlacklistIP($ipAddress)
{
  global $blacklistIP;

  foreach ($blacklistIP as $ip) {
    if ($ip == $ipAddress)
      return true;
  }
  return false;
}

/**
 * This function checks a user ID to see if it is listed as a known user ID
 * that is disallowed from accessing the API.
 *
 * {param} $userID - The user ID to check in the black listing.
 */
function checkBlacklistID($userID)
{
  global $blacklistID;

  foreach ($blacklistID as $id) {
    if ($id == $userID)
      return true;
  }
  return false;
}
