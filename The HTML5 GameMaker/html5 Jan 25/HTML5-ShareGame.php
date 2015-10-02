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
	$gameID = $_GET["gameID"];

	$dbname="gmg";
	$host="mysql.gamemakersgarage.com";
	$user="gmgadmins";
	$dbh=mysql_connect ($host,$user,"LfJytcJ8") or die ('I cannot connect to the database because: ' . mysql_error(). '');
	mysql_select_db ("$dbname") or die('I cannot select the database because: ' . mysql_error());

	//Make sure that the gameID exists and exists by the owner. If not make a new gameID
	$result = mysql_query("SELECT * FROM HTML5Games WHERE id = '$gameID'") or die(mysql_error());
	$row = mysql_fetch_array($result);
	if ($row && $row['compiled'] && $row['compiled'] != "") {

		echo "<html>";
		echo "<head></head>";
		echo "<body>";
		$code = substr(str_replace("\\\"","\"",str_replace("\\n","\n",$row['compiled'])),1);
		echo substr($code,0,strlen( $code )-1);
		echo "</body>";
		echo "</html>";

	}

	mysql_close($dbh);
}
?>