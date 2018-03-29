<?php
$idPartie=$_GET['idPartie'];
$con = mysqli_connect('localhost', 'root', '');
mysqli_select_db($con,"bomberman");
$sql="SELECT etat FROM parties WHERE idPartie=".$idPartie;
$result = mysqli_query($con,$sql);
$row = mysqli_fetch_array($result);
echo $row[0];
mysqli_close($con);