<?php

include 'connect.php';

$db = connect_to_database();

try {

    $query = <<<SQL
        SELECT * FROM $table;
    SQL;
    $stmt = $db->prepare($query);
    $res = $stmt->execute();
    
    $mesg = array();
    while($row = $stmt->fetch()) {
        $mesg[] = $row;
    }
    echo json_encode($mesg);

} catch (PDOException $e) {
    die("Fetch from table '$table' failed: ${e->getMessage()} with error code ${e->getCode()}<br>.");
}

?>