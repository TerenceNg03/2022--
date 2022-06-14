<!DOCTYPE html>
<html>
<!-- 
说明：
1. POST方法POST select类的query时用"select" 作为名字，返回json格式结果
2. PSOT方法插入刪除建表等用"create"作为名字，返回成功与否
3. 在下面改mysql配置
4. 本页面含一个测试表单可以自己跑跑看

-->
<head>
<?php
// Change mysql setup here
$servername = "localhost:3306";
$username = "root";
$password = "root";
$schema = "library";

// Create connection
$conn = new mysqli($servername, $username, $password);
?>
</head>
<body>

<div id="status">

<?php
// Check connection
if ($conn->connect_error) {
	echo ("Connection failed: " . $conn->connect_error);
}else{
	echo ("Good");
}
?>
</div>

<?php
// For non select query 
if (! $conn->connect_error){
	$conn->query("USE " . $schema . ';');

	if (isset($_POST['create']) && !empty($_POST['create'])) {
		echo '<div id="query">' . $_POST['create'] .'</div>';
		echo '<div id="result">';
		if ($conn->query($_POST['create']) === TRUE) {
		  echo "Query executed successfully.";
		} else {
		  echo "Error: " . $conn->error;
		}
		echo '</div>';
	}

	else if (isset($_POST['select']) && !empty($_POST['select'])) {
		echo '<div id="query">' . $_POST['select'] .'</div>';
		echo '<div id="result">';
		$result = $conn->query ($_POST['select']);
		$rows = array();
		while($r = mysqli_fetch_assoc($result)) {
			$rows[] = $r;
		}
		echo json_encode($rows);
		echo '</div>';
	}
}

$conn->close();
?>

<form action="?" method="post">
<h1>This is a form for test</h1>
Select Query: <input type="text" name="select"><br>
Create Query: <input type="text" name="create"><br>
<input type="submit">
</form>


</body>
</html>
