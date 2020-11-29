<?php

/**
 * Endpoint: hunt
 * Description: This endpoint is the REST endpoint for fetching lists of hunts.
 */

define('ABSPATH', realpath(__DIR__ . '/') . '/');

require_once(ABSPATH . 'common/api.php');
require_once(ABSPATH . 'common/definitions.php');

$endpoint = "hunts";

function getHunts($database, &$response, $id)
{
  $fetchHunt = &ExecuteSQL(
    $database,
    sprintf("SELECT * FROM Hunt WHERE idOwner=%s", GetSQLValueStringi($database, $id, 'int'))
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

try {
  include(ABSPATH . 'common/api-header.php');

  if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    if (isset($_REQUEST['id'])) {
      $id = $_REQUEST['id'];
    } else {
      throw new Exception(err_param_missing, errorno_param_missing);
    }

    $database = &openWriteDatabase();
    getHunts($database, $response, $id);
  } else {
    throw new Exception(err_request, errno_request);
  }
} catch (Exception $e) {
  include(ABSPATH . 'common/api-exception.php');
}

include(ABSPATH . 'common/api-footer.php');
