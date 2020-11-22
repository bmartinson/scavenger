<?php

require_once('api.php');

// verify the stored auth token in the cookie
if (!verifyAuthToken($_COOKIE['authToken'])) {
  // redirect back to a login page if we're not properly logged in
  $restrictGoTo = "/";
  $referrer = $_SERVER['PHP_SELF'];

  if (isset($_SERVER['QUERY_STRING']) && strlen($_SERVER['QUERY_STRING']) > 0)
    $referrer .= "?" . $_SERVER['QUERY_STRING'];

  $restrictGoTo = $restrictGoTo . "?accesscheck=" . urlencode($referrer);

  header("Location: " . $restrictGoTo);
  exit;
}
