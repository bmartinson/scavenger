<?php

/**
 * Endpoint: authorize
 * Description: This endpoint is the REST endpoint for managing user accounts.
 */

define('ABSPATH', realpath(__DIR__ . '/') . '/');

require_once(ABSPATH . 'common/api.php');
require_once(ABSPATH . 'common/definitions.php');

// defines the name of this api endpoint
$endpoint = "authorize";

function authorize($database, &$response, $data)
{
  global $apiKey;

  array_push($response->data, $data);

  // check to see if the user exists in the user table
  $fetchUser = &ExecuteSQL(
    $database,
    sprintf("SELECT id, password, firstName, lastName, email, verified, deleted, created, modified FROM User WHERE email=%s", GetSQLValueStringi($database, $data->email, 'text'))
  );

  if ($fetchUser->num_rows == 0) {
    while ($row_User = $fetchUser->fetch_object()) {
      if ($data->password == $row_User->password && $row_User->deleted == 0) {
        // generate the auth token for the user and set it for the cookie
        $authToken = generateAuthToken($row_User->id, $row_User->firstName, $apiKey, true);

        // return the user information
        array_push($response->data, (object)[
          'id' => $row_User->id,
          'firstName' => $row_User->firstName,
          'lastName' => $row_User->lastName,
          'email' => $row_User->email,
          'verified' => $row_User->verified,
          'created' => $row_User->created,
          'modified' => $row_User->modified,
          'authToken' => $authToken
        ]);
      } else {
        throw new Exception(err_invalid_user, errorno_invalid_user);
      }
    }
  } else {
    throw new Exception(err_invalid_user, errorno_invalid_user);
  }

  // close the connection
  $fetchUser->close();
}

try {
  include(ABSPATH . 'common/api-header.php');

  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $json = file_get_contents('php://input');

    // convert the json request data into a php useable object
    $data = json_decode($json);

    authorize($database, $response, $data);
  }
} catch (Exception $e) {
  include(ABSPATH . 'common/api-exception.php');
}

include(ABSPATH . 'common/api-footer.php');
