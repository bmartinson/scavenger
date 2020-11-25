<?php

/**
 * Endpoint: user
 * Description: This endpoint is the REST endpoint for managing user accounts.
 */

define('ABSPATH', realpath(__DIR__ . '/') . '/');

require_once(ABSPATH . 'common/api.php');
require_once(ABSPATH . 'common/definitions.php');

// defines the name of this api endpoint
$endpoint = "user";

function getUser($database, &$response, $id)
{
  // check to see if the user exists in the user table
  $fetchUser = &ExecuteSQL(
    $database,
    sprintf("SELECT id, firstName, lastName, email, verified, deleted, created, modified FROM User WHERE id=%s", GetSQLValueStringi($database, $_REQUEST['id'], 'int'))
  );

  if ($fetchUser->num_rows > 0) {
    while ($row_User = $fetchUser->fetch_object()) {
      array_push($response->data, (object)[
        'id' => $row_User->id,
        'firstName' => $row_User->firstName,
        'lastName' => $row_User->lastName,
        'email' => $row_User->email,
        'verified' => $row_User->verified,
        'deleted' => $row_User->deleted,
        'created' => $row_User->created,
        'modified' => $row_User->modified
      ]);
    }
  }

  // close the connection
  $fetchUser->close();
}

function editUser($database, &$response, $data)
{
}

function deleteUser($database, &$response, $data)
{
}

function createUser($database, &$response, $data)
{
  // check to see if the user exists in the user table
  $fetchUser = &ExecuteSQL(
    $database,
    sprintf("SELECT id FROM User WHERE email=%s", GetSQLValueStringi($database, $data->email, 'text'))
  );

  if ($fetchUser->num_rows == 0) {
    if (!isset($data->email)) {
      throw new Exception(err_param_missing . 'email', errorno_param_missing);
    }

    if (!isset($data->firstName)) {
      throw new Exception(err_param_missing . 'firstName', errorno_param_missing);
    }

    if (!isset($data->lastName)) {
      throw new Exception(err_param_missing . 'lastName', errorno_param_missing);
    }

    if (!isset($data->password)) {
      throw new Exception(err_param_missing . 'password', errorno_param_missing);
    }

    ExecuteSQL(
      $database,
      sprintf(
        "INSERT INTO User (email, password, firstName, lastName, created) VALUES (%s, %s, %s, NOW())",
        GetSQLValueStringi($database, $data->email, "text"),
        GetSQLValueStringi($database, $data->password, "text"),
        GetSQLValueStringi($database, $data->firstName, "text"),
        GetSQLValueStringi($database, $data->lastName, "text")
      )
    );

    // close the connection
    $fetchUser->close();

    // fetch latest record
    $fetchUser = &ExecuteSQL(
      $database,
      sprintf("SELECT id, firstName, lastName, email, verified, deleted, created, modified FROM User WHERE email=%s", GetSQLValueStringi($database, $data->email, 'text'))
    );

    if ($fetchUser->num_rows > 0) {
      while ($row_User = $fetchUser->fetch_object()) {
        array_push($response->data, (object)[
          'id' => $row_User->id,
          'firstName' => $row_User->firstName,
          'lastName' => $row_User->lastName,
          'email' => $row_User->email,
          'verified' => $row_User->verified,
          'deleted' => $row_User->deleted,
          'created' => $row_User->created,
          'modified' => $row_User->modified,
        ]);
      }

      // close the connection and return with the users that have already been created
      $fetchUser->close();
      return;
    }
  }

  // close the connection
  $fetchUser->close();
}

try {
  include(ABSPATH . 'common/api-header.php');

  if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    // retrieve users by id query parameter
    if (isset($_REQUEST['id'])) {
      $id = $_REQUEST['id'];
    } else {
      throw new Exception(err_param_missing, errorno_param_missing);
    }

    // fetch the user
    getUser($database, $response, $id);
  } else {
    $json = file_get_contents('php://input');

    // convert the json request data into a php useable object
    $data = json_decode($json);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      createUser($database, $response, $data);
    } else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
      editUser($database, $response, $data);
    } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
      deleteUser($database, $response, $data);
    }
  }
} catch (Exception $e) {
  include(ABSPATH . 'common/api-exception.php');
}

include(ABSPATH . 'common/api-footer.php');
