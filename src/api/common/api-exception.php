<?php

// create a new response document
$responseDoc = new DOMDocument();

// create the <rsp> element with a status of fail
$resultSect = $responseDoc->createElement("rsp");
$resultSect->setAttribute("status", "fail");
$resultSect->setAttribute("endpoint", $endpoint);
$responseDoc->appendChild($resultSect);

// create the <err> element with the error code and error message as attributes
$errorElement = $responseDoc->createElement("err");
$errorElement->setAttribute("code", $e->GetCode());
$message = $e->GetMessage();
$mArray = explode("|", $message);

if (count($mArray) > 1) {
  $errorElement->setAttribute("data", $mArray[0]);
  $errorElement->setAttribute("message", $mArray[1]);
} else {
  $errorElement->setAttribute("message", $mArray[0]);
}
$resultSect->appendChild($errorElement);
