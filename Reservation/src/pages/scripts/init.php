<?php

include 'connect.php';

try {

	echo "Linking...<br>";
    $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
    echo "Succeeded in linking '$host'<br>";

} catch (PDOException $e) {

    $code = $e->getCode();
    if($code != 1049) die("Attempt to link '$host/$dbname' failed: ".$e->getMessage()." with error code $code <br>");
    
    // database not found
    echo "Database named '$dbname' not found. Try creating database '$dbname'...<br>";

    $link = mysqli_connect($host, $user, $pass);
    if(!$link) die("Attempt to link '$host' Failed: ".mysqli_connect_error()."<br>");
    echo "Succeeded in linking '$host'<br>";

    $query = <<<SQL
        CREATE DATABASE $dbname;
    SQL;
    if(mysqli_query($link, $query)) {
        echo "Succeeded in creating database '$dbname'.<br>";
    } else {
        echo "Failed to create database '$dbname'.<br>";
    }

    mysqli_close($link);

    $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
}

try {

	$query = <<<SQL
        SELECT count(1) FROM $table;
    SQL;
    $stmt = $db->prepare($query);
    $res = $stmt->execute();
    $row = $stmt->fetch();
    echo "There has already been $row[0] rows in table '$table'.";

} catch (PDOException $e) {

    $code = $e->getCode();
    if($code != "42S02") die("Attempt to manipulate table '$table' failed: ${e->getMessage()} with error code $code.<br>");
    
    echo "Table named '$table' not found. Try creating table '$table'...<br>";
    $query = <<<SQL
        CREATE TABLE appointment (
            app_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
            patient_id INT NOT NULL,
            doctor_id INT NOT NULL,
            start_time DATETIME NOT NULL,
            status enum('booked', 'started', 'done', 'cancelled') NOT NULL,
            record_id int
        );
    SQL;
    $db->exec($query);
    echo "Succeeded in creating table '$table'.";

}

?>