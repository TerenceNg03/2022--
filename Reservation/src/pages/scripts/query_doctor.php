<?php

include 'connect.php';

$db = connect_to_database();

$did = 20023;

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if($data) {
    $did = $data["doctor_id"];
} else {
    //not in debug
}

try {

    $query = <<<SQL
        SELECT * FROM $table where doctor_id = :did;
    SQL;
    $stmt = $db->prepare($query);
    $stmt->bindParam(":did", $did);
    $res = $stmt->execute();
    
    $mesg = array();
    while($row = $stmt->fetch()) {
        $mesg[] = $row;
    }
    $res = ["data" => $mesg, "success" => 1];
    echo json_encode($res);

} catch (PDOException $e) {
    die("Fetch from table '$table' failed: ${e->getMessage()} with error code ${e->getCode()}<br>.");
}

?>