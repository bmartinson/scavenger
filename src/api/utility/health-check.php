<?php

/**
 * Endpoint: health-check
 * Description: This endpoint serves as a public endpoint that requires no auth token to access. It provides
 * a simple status message back to the client so the client can easily confirm a connection. Should the
 * server be down, the client should receive a 504 error instead of the response from this endpoint.
 *
 * Parameters: none
 * Returns:
 * isConnected = 1
 */

define('ABSPATH', realpath(__DIR__ . '/..') . '/');

require_once(ABSPATH . 'common/api.php');
require_once(ABSPATH . 'common/definitions.php');

// defines the name of this api endpoint
$endpoint = "health-check";

/**
 * The api endpoint's starting function for execution. Do not modify the name or parameters of this
 * function. Instead, additional functionality should be created in separate functions as is necessary.
 */
function apiMain($database, &$response)
{
  // create the meat of the response document
  array_push($response->data, (object)[
    'isConnected' => 1
  ]);
}

// parse the _REQUEST parameters and execute the endpoint
try {
  include(ABSPATH . 'common/api-header.php');

  // gather _REQUEST parameters here to pass to the endpoint function
  // none for this endpoint

  // open the db connection and execute the main endpoint code
  $database = &openWriteDatabase();
  apiMain($database, $response);
} catch (Exception $e) {
  include(ABSPATH . 'common/api-exception.php');
}

include(ABSPATH . 'common/api-footer.php');
