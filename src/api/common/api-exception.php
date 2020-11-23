<?php

// create a new response document
$response = (object)[];

$response->endpoint = $endpoint;
$response->status = 'fail';
$response->code = $e->GetCode();

// create the <err> element with the error code and error message as attributes
$errorElement = $responseDoc->createElement("err");
$errorElement->setAttribute("code", $e->GetCode());

$message = $e->GetMessage();
$mArray = explode("|", $message);

if (count($mArray) > 1) {
  $response->data = $mArray[0];
  $response->message = $mArray[1];
} else {
  $response->data = null;
  $response->message = $mArray[0];
}
