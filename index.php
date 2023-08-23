<?php
require_once 'vendor/autoload.php'; // Ruta al archivo autoload.php de Composer 
require_once 'templates.php';


//Se obtienen los datos de la solicitud AJAX enviados al servidor Esto lee los datos enviados en el cuerpo 
//de la solicitud y los decodifica en un array asociativo de PHP llamado $Datos.
$Datos   = json_decode(file_get_contents('php://input'),true);
// Crear instancia Templates
$templates = new Templates($Datos);
echo $templates->Ejecutar();
