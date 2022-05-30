<?php

include 'connect.php';

$db = connect_to_database();

$pid = 10001;

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if($data) {
    $pid = $data["patient_id"];
} else {
    //not in debug
}

try {

    $query = <<<SQL
        SELECT * FROM $table where patient_id = :pid;
    SQL;
    $stmt = $db->prepare($query);
    $stmt->bindParam(":pid", $pid);
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