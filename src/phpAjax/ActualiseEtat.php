<?php
$idPartie=$_GET['idPartie'];
$etat=$_GET['etat'];
$con = mysqli_connect('localhost', 'root', '');
mysqli_select_db($con,"bomberman");
$sql="UPDATE parties SET etat='".$etat."' WHERE idPartie=".$idPartie;
$result = mysqli_query($con,$sql);
$row = mysqli_fetch_array($result);
echo $row[0];
mysqli_close($con);