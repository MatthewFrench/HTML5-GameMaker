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
	$gameID = $_POST["id"];
	$compiledData = mysql_real_escape_string($_POST["compiledData"]);

	$dbname="gmg";
	$host="mysql.gamemakersgarage.com";
	$user="gmgadmins";
	$dbh=mysql_connect ($host,$user,"LfJytcJ8") or die ('I cannot connect to the database because: ' . mysql_error(). '');
	mysql_select_db ("$dbname") or die('I cannot select the database because: ' . mysql_error());

	$sql = "UPDATE HTML5Games SET compiled='$compiledData' WHERE owner='$owner' AND id='$gameID'";
	mysql_query($sql) or die(mysql_error());

	mysql_close($dbh);
}
?>