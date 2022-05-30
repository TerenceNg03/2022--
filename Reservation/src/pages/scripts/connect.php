<?php

$host = "localhost";
$port = "";
$dbname = "EE";
$user = "root";
$pass = "";
$table = "appointment";

function connect_to_database() {

	global $host;
	global $port;
	global $dbname;
	global $user;
	global $pass;

	try {

		//echo "Linking...<br>";
	    $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
	    //echo "Succeeded in linking '$host'<br>";

	} catch (PDOException $e) {
	    die("Attempt to link '$host/$dbname' failed: ${e->getMessage()} with error code ${e->getCode()} <br>");
	}

	return $db;
}

?>