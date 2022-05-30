<?php

include 'connect.php';

$db = connect_to_database();

$status = "started";
$aid = 14;

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if($data) {
    $status = $data["action"]["status"];
    $aid = $data["aid"];
} else {
    //not in debug
}

try {

	$query = <<<SQL
        UPDATE $table SET status = :status WHERE app_id = :aid;
    SQL;

    $stmt = $db->prepare($query);
    $stmt->bindParam(":status", $status);
    $stmt->bindParam(":aid", $aid);

    $res = $stmt->execute();
    if(!$res) die("Failed to change status: ".$db->errorInfo());

    echo "Change Status succeeded.<br>appointment ID = $aid<br>status = $status<br>";

} catch (PDOException $e) {
    die("Failed to update table '$table': ${e->getMessage()} with error code ${e->getCode()}.<br>");
}

?>