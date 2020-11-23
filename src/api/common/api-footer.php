<?php

// close the database connection if it exists
if ($database)
  $database->close();

$response->commandid = $commandId;

header("Content-type:application/json");

if (isset($_GET['callback']) || isset($_POST['callback'])) {
  $useCallback = true;
  if (isset($_GET['callback']))
    $callbackFunction = $_GET['callback'];
  else
    $callbackFunction = $_POST['callback'];
} else
  $useCallback = false;

if ($useCallback)
  echo $callbackFunction . "([";

echo json_encode($response);

if ($useCallback)
  echo "]);";
