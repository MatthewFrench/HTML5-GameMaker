<?php 
require("/home/gmgadmins/gamemakersgarage.com/forum/SSI.php"); 
if ($context['user']['is_guest'])
{
	include($_SERVER['DOCUMENT_ROOT'].'/html5/HTML5-Login.html');
}
else
{
	include($_SERVER['DOCUMENT_ROOT'].'/html5/HTML5.html');
}
?>