<?php

include 'connect.php';

$db = connect_to_database();

$pid = 10001;
$did = 20023;
$st = "NOW()";

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if($data) {
    $pid = $data["patient_id"];
    $did = $data["doctor_id"];
    $st = $data["time"];
} else {
    //not in debug
}

try {

    $query = <<<SQL
        INSERT INTO $table (patient_id, doctor_id, start_time, status, record_id) VALUES (:pid, :did, $st, "booked", NULL);
    SQL;

    $stmt = $db->prepare($query);
    $stmt->bindParam(":pid", $pid);
    $stmt->bindParam(":did", $did);
    //$stmt->bindParam(":st", $st);
    
    $res = $stmt->execute();
    if(!$res) die("Failed to insert data: ".$db->errorInfo());

    echo "Making appointment succeeded.<br>patient ID = $pid<br>doctor ID = $did<br>status = $st<br>";

} catch (PDOException $e) {
    die("Insertion into table '$table' failed: ${e->getMessage()} with error code ${e->getCode()}.<br>");
}

?>
