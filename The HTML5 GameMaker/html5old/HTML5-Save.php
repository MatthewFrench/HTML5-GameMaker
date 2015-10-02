<?php 
require("/home/gmgadmins/gamemakersgarage.com/forum/SSI.php"); 
if ($context['user']['is_guest'])
{
	//Do somethin
}
else
{
	//Save
	$owner = $context['user']['id'];
	$gameName = mysql_real_escape_string($_POST["name"]);
	$gameID = $_POST["id"];
	$data = mysql_real_escape_string($_POST["data"]);

	$dbname="gmg";
	$host="mysql.gamemakersgarage.com";
	$user="gmgadmins";
	$dbh=mysql_connect ($host,$user,"LfJytcJ8") or die ('I cannot connect to the database because: ' . mysql_error(). '');
	mysql_select_db ("$dbname") or die('I cannot select the database because: ' . mysql_error());

	//Make sure that the gameID exists and exists by the owner. If not make a new gameID
	$result = mysql_query("SELECT * FROM HTML5Games WHERE owner = '$owner' AND id = '$gameID'") or die(mysql_error());
	$row = mysql_fetch_array($result);
	if (!$row) {
		//Make a new game
		$result = mysql_query("INSERT INTO HTML5Games (name, owner, data) VALUES ('$gameName', '$owner', '$data')") or die(mysql_error());
		$result = mysql_query("SELECT * FROM HTML5Games WHERE owner = '$owner' ORDER BY ID DESC LIMIT 1");
		$row = mysql_fetch_array($result);
		$gameID = $row['id'];
	} else {

		//Save the gameName, gameID, and data to the game

		$sql = "UPDATE HTML5Games SET name='$gameName', data='$data' WHERE owner='$owner' AND id='$gameID'";

		mysql_query($sql) or die(mysql_error());

	}

	mysql_close($dbh);

	echo $gameID;
}
?>