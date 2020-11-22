<?php

function removeXMLAttributes($inputArray, &$outputArray)
{
  foreach ($inputArray as $property => $value) {
    if ($property == "@attributes")
      removeXMLAttributes((array)$value, $outputArray);
    else
      $outputArray[$property] =  $value;
  }
}

// close the database connection if it exists
if ($database)
  $database->close();

// create the respond document
$finalResult = $responseDoc->getElementsByTagName("rsp");
if ($finalResult && $finalResult->item(0))
  $finalResult->item(0)->setAttribute("commandid", $commandId);

// send it back to the caller
if ((isset($_GET['json']) && $_GET['json'] == 1) || (isset($_POST['json']) && $_POST['json'] == 1)) {
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

  echo json_encode(simplexml_import_dom($responseDoc));

  if ($useCallback)
    echo "]);";
} else {
  header("Content-type:application/xml");
  echo $responseDoc->saveXML();
}
