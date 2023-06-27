<?php

require_once 'vendor/autoload.php'; // Ruta al archivo autoload.php de Composer

use Twig\Environment;
use Twig\Loader\FilesystemLoader;

// Configuración del Twig
// Ruta a tu directorio de plantillas
$templateDir = '.';
$loader = new FilesystemLoader($templateDir);

// Crea la instancia de Twig
$twig = new Environment($loader, [
    'debug' => true, // Activa el modo debug (opcional)
]);

// Agrega cualquier configuración adicional según tus necesidades

// Renderiza una plantilla Twig
$template = $twig->load('index.twig');
echo $template->render();
