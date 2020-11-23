<?php

/**
 * Endpoint: authorize
 * Description: This endpoint serves as a public endpoint that requires no auth token to access. Based on
 * the request method and parameters, we wil either create, edit, or delete an account.
 *
 * Returns: Nothing, redirects to the correct app/workflow.
 */

define('ABSPATH', realpath(__DIR__ . '/..') . '/');

require_once(ABSPATH . 'common/api.php');
require_once(ABSPATH . 'common/definitions.php');

session_start();

// defines the name of this api endpoint
$endpoint = "user";

/**
 * The api endpoint's starting function for execution. Do not modify the name or parameters of this
 * function. Instead, additional functionality should be created in separate functions as is necessary.
 */
function apiMain($database, &$responseDoc)
{
  global $endpoint;
  global $client;
  global $apiKey;

  // if we have the token check our database
  if (is_array($token)) {
    // check to see if the user exists in the g2pdf user table
    $fetchGUser = &ExecuteSQL(
      $database,
      sprintf("SELECT id, email, authToken FROM g2pdf_User WHERE email=%s", GetSQLValueStringi($database, $userData['email'], "text"))
    );

    if ($fetchGUser->num_rows == 0) {
      // no g2pdf user exists, create one
      ExecuteSQL(
        $database,
        sprintf(
          "INSERT INTO g2pdf_User (email, authToken, created) VALUES (%s, %s, NOW())",
          GetSQLValueStringi($database, $userData['email'], "text"),
          GetSQLValueStringi($database, $encodedToken, "text")
        )
      );
    } else {
      // update the existing g2pdf user with the new auth token and email
      while ($row_GUser = $fetchGUser->fetch_object()) {
        ExecuteSQL(
          $database,
          sprintf(
            "UPDATE g2pdf_User SET email=%s, authToken=%s, modified=NOW() WHERE id=%s",
            GetSQLValueStringi($database, $userData['email'], "text"),
            GetSQLValueStringi($database, $encodedToken, "text"),
            GetSQLValueStringi($database, $row_GUser->id, "int")
          )
        );
      }
    }

    $fetchGUser->close();

    // check for the user entry in the core database table (User)
    $fetchUser = &ExecuteSQL(
      $database,
      sprintf("SELECT id, firstName, appPermissions FROM User WHERE email=%s", GetSQLValueStringi($database, $userData['email'], "text"))
    );

    if ($fetchUser->num_rows == 0) {
      // no core user exists, create one
      ExecuteSQL(
        $database,
        sprintf(
          "INSERT INTO User (firstName, lastName, email, appPermissions, created) VALUES (%s, %s, %s, %u, NOW())",
          GetSQLValueStringi($database, $userData['givenName'], "text"),
          GetSQLValueStringi($database, $userData['familyName'], "text"),
          GetSQLValueStringi($database, $userData['email'], "text"),
          GetSQLValueStringi($database, app_permission_g2pdf, "int")
        )
      );

      $fetchUser->close();
    } else {
      // update the existing core user with the new data
      while ($row_User = $fetchUser->fetch_object()) {
        ExecuteSQL(
          $database,
          sprintf(
            "UPDATE User SET email=%s, appPermissions=%u, modified=NOW() WHERE id=%s",
            GetSQLValueStringi($database, $userData['email'], "text"),
            GetSQLValueStringi($database, $row_User->appPermissions | app_permission_g2pdf, "int"),
            GetSQLValueStringi($database, $row_User->id, "int")
          )
        );
      }
      $fetchUser->close();

      // check for the user entry in the core database table (User) for the row we just added
      $fetchUser = &ExecuteSQL(
        $database,
        sprintf("SELECT id, firstName FROM User WHERE email=%s", GetSQLValueStringi($database, $userData['email'], "text"))
      );
      $row_User = $fetchUser->fetch_object();
    }

    // generate an auth token for our core api services
    generateAuthToken($row_User->id, $row_User->firstName, $apiKey, true);

    // store a g2pdf_access flag in the cookie
    $expirationTime = time() + expiration_days;
    setcookie('g2pdf_access', 1, $expirationTime, '/');

    // redirect to g2pdf
    header('Location: ' . "https://www.brianmartinson.com/g2pdf/");
  } else {
    // if the g2pdf_access flag was set, make sure it is clear
    if (isset($_COOKIE['g2pdf_access'])) {
      unset($_COOKIE['g2pdf_access']);
    }

    // redirect to g2pdf
    header('Location: ' . "https://www.brianmartinson.com/g2pdf/");
  }
}

// parse the _REQUEST parameters and execute the endpoint
try {
  include(ABSPATH . 'common/api-header.php');

  if ($_SERVER['REQUEST_METHOD'] == 'POST') {
  } else if ($_SERVER['REQUEST_METHOD'] == 'GET') {
  } else if ($_SERVER['REQUEST_METHOD'] == 'DELETE') {
  }
} catch (Exception $e) {
  include(ABSPATH . 'common/api-exception.php');
}

include(ABSPATH . 'common/api-footer.php');
