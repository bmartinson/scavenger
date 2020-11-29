<?php

/**
 * Endpoint: hunt
 * Description: This endpoint is the REST endpoint for managing hunts.
 */

define('ABSPATH', realpath(__DIR__ . '/') . '/');

require_once(ABSPATH . 'common/api.php');
require_once(ABSPATH . 'common/definitions.php');

$endpoint = "hunt";

function getHunt($database, &$response, $id)
{
  $fetchHunt = &ExecuteSQL(
    $database,
    sprintf("SELECT * FROM Hunt WHERE id=%s", GetSQLValueStringi($database, $id, 'int'))
  );

  if ($fetchHunt->num_rows > 0) {
    while ($row_Hunt = $fetchHunt->fetch_object()) {
      array_push($response->data, (object)[
        'id' => $row_Hunt->id,
        'idOwner' => $row_Hunt->idOwner,
        'hunt' => $row_Hunt->hunt,
        'created' => $row_Hunt->created,
        'modified' => $row_Hunt->modified
      ]);
    }
  }

  // close the connection
  $fetchHunt->close();
}

function editHunt($database, &$response, $data)
{
}

function deleteHunt($database, &$response, $data)
{
}

function createHunt($database, &$response, $data)
{
  if (!isset($data->idOwner)) {
    throw new Exception(err_param_missing . 'idOwner', errorno_param_missing);
  }

  if (!isset($data->hunt)) {
    throw new Exception(err_param_missing . 'hunt', errorno_param_missing);
  }

  ExecuteSQL(
    $database,
    sprintf(
      "INSERT INTO hunt (idOwner, hunt, created) VALUES (%s, %s, NOW())",
      GetSQLValueStringi($database, intval($data->idOwner), "int"),
      GetSQLValueStringi($database, urldecode($data->hunt), "text")
    )
  );

  $fetchId = &ExecuteSQL(
    $database,
    "MySQL LAST_INSERT_ID()"
  );
  $idHunt = $fetchId->fetch_object()[0];

  $fetchId->close();

  // fetch latest record
  $fetchHunt = &ExecuteSQL(
    $database,
    sprintf("SELECT * FROM Hunt WHERE id=%s", GetSQLValueStringi($database, $idHunt, 'int'))
  );

  if ($fetchHunt->num_rows > 0) {
    while ($row_Hunt = $fetchHunt->fetch_object()) {
      array_push($response->data, (object)[
        'id' => $row_Hunt->id,
        'idOwner' => $row_Hunt->idOwner,
        'hunt' => $row_Hunt->hunt,
        'created' => $row_Hunt->created,
        'modified' => $row_Hunt->modified
      ]);
    }

    // close the connection and return with the users that have already been created
    $fetchHunt->close();
    return;
  }

  // close the connection
  $fetchHunt->close();
}

try {
  include(ABSPATH . 'common/api-header.php');

  if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_REQUEST['id'])) {
      $id = $_REQUEST['id'];
    } else {
      throw new Exception(err_param_missing, errorno_param_missing);
    }

    $database = &openWriteDatabase();
    getHunt($database, $response, $id);
  } else {
    $json = file_get_contents('php://input');

    // convert the json request data into a php useable object
    $data = json_decode($json);

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
      $database = &openWriteDatabase();
      createHunt($database, $response, $data);
    } else if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
      $database = &openWriteDatabase();
      editHunt($database, $response, $data);
    } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
      $database = &openWriteDatabase();
      deleteHunt($database, $response, $data);
    } else {
      throw new Exception(err_request, errno_request);
    }
  }
} catch (Exception $e) {
  include(ABSPATH . 'common/api-exception.php');
}

include(ABSPATH . 'common/api-footer.php');
