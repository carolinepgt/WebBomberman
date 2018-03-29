<?php
$idPartie=$_GET['idPartie'];
$nj=$_GET['nj'];
$action=$_GET['action'];
$con = mysqli_connect('localhost', 'root', '');
mysqli_select_db($con,"bomberman");
$sql="UPDATE participe SET actionPartie='".$action."' WHERE idPartie=".$idPartie." and nbJoueur=".$nj;
$result = mysqli_query($con,$sql);
echo $sql;
mysqli_close($con);