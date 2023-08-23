<?php

use Twig\Environment;
use Twig\Loader\FilesystemLoader;


$conexion = new mysqli('localhost','jquery_user','12345','informacion_plantilla_1');


//Utiliza la biblioteca Twig para cargar y renderizar plantillas. 
class Templates {
    //Instancia clase enviroment
    private $twig;

    /**
     * Datos que llegan del POST => Se carga en elconstructor
     */
    private $Datos=null;

    public function __construct($Datos) {
        $this->Datos=$Datos;
        //$this->checkValoresPost();

        // Configuración del Twig, donde estas las plantillas -*-
        $templateDir = __DIR__ ;
        //Se usa para cargar las plantillas desde un directorio
        $loader = new FilesystemLoader($templateDir);
        $this->twig = new Environment($loader, [
            'debug' => true,
            //desactiva el escape automático de caracteres especiales y permite que el contenido HTML se muestre sin ser escapado
            'autoescape' => false,
        ]);
    }

    public function Ejecutar(){
        if (isset($this->Datos['action'])) {

            //Este método se encarga de cargar la plantilla y realizar cualquier procesamiento necesario.
            $response = $this->handleAjaxRequest();
            // Se establece el encabezado de respuesta para indicar que se devolverá un JSON.
            header('Content-Type: application/json');
            //Se convierte la respuesta a formato JSON utilizando 
            return json_encode($response);;
             
        /**Si no se recibe una solicitud AJAX, se carga y renderiza la plantilla principal
        *  llamando al método loadMainTemplate de la instancia de "Templates" y se muestra el contenido resultante. */
        } else {
            // Cargar el contenido del archivo index.twig utilizando Twig
            
            $template = $this->loadMainTemplate();
            return $template;
             
        }   
    }

    /**Maneja las solicitudes AJAX recibidas y carga las plantillas adicionales según la acción 
     * especificada en el parámetro $_GET['action']. Los nombres de las plantillas se pasan como argumentos a este método. */
    #FIXME: Si llega plantilla hotel o activities cambiar la ruta, en verdad no haria falta se puede usar directamente la ruta de baseDatos
    private function handleAjaxRequest() { 
        // Se define la ruta de la plantilla según el valor de action recibido en $Datos. En este caso, la ruta se forma concatenando 
       
        $auxPlantilla = $this->Datos['action'];
        if ($auxPlantilla == 'activities' || $auxPlantilla == 'hotelInfo') {
            $plantilla = 'assets/template/'.'baseDatos'.'.html';
        }else {
            $plantilla = 'assets/template/'.$auxPlantilla.'.html';
        }
       
        
        //se utiliza para crear un objeto vacío que se utilizará para almacenar información de la respuesta de la solicitud AJAX
        // de manera dinámica asignando propiedades a dicho objeto.
        $result = new stdClass();
        //Se añaden dos propiedades, la sintaxis es $result->propertyName = value; en este caso es html o twig
        $result->codError = 0; 
        $result->resultado=$this->loadAdditionalTemplate($plantilla,$auxPlantilla);
        return $result;
    }
    /** Utilizan la instancia $twig para cargar la plantilla y luego llama al método render() para renderizarla y obtener el contenido HTML resultante. */
    /**carga y renderiza una plantilla adicional especificada por su nombre. */
    private function loadAdditionalTemplate($template, $auxPlantilla) {
         #FIXME: Si el template es baseDatos haga la llamada de abajo y mande algo en el render
       
        if ($auxPlantilla == 'activities' || $auxPlantilla == 'hotelInfo') {
            $actividades=$this->getExperienciasFromBD();
            return  $this->twig->load($template)->render(['lista' => $actividades, 'auxPlantilla' => $auxPlantilla]);
        }else {
            return  $this->twig->load($template)->render([]);
        }
        
    }
    /**Carga y renderiza la plantilla principal llamada "index.twig". */
    private function loadMainTemplate() {
        return $this->twig->load('index.twig')->render();

    }
    private function getExperienciasFromBD(){
        global $conexion;
        $data = new stdClass(); // Creamos el objeto para almacenar los datos
        $data->main = new stdClass(); // Creamos el objeto para almacenar los Elementos
        $data->main->Elementos = []; // Inicializamos el array para almacenar los registros de actividad
    
        // Consulta para obtener datos de la tabla actividad
        $query = 'SELECT * FROM ticket AS t RIGHT JOIN elemento AS e ON t.id_elemento = e.id_elemento';
        $result = $conexion->query($query);
    
        while ($row = $result->fetch_assoc()) {
            $actividadObj = (object) $row;
            $elementoId = $actividadObj->id_elemento;
            // if (is_null($data->main->Elementos[$actividadObj->id_elemento])) { error
            if (!isset($data->main->Elementos[$elementoId])) { //verifica si una variable o elemento de un array está definido y no es nulo
                $data->main->Elementos[$elementoId]=new stdClass();
                $data->main->Elementos[$actividadObj->id_elemento]=$actividadObj;
                /*$data->main['Elementos'][$actividadObj->id_elemento]->id_elemento=$actividadObj->id_elemento;
                $data->main['Elementos'][$actividadObj->id_elemento]->titulo=$actividadObj->titulo;*/
                $data->main->Elementos[$elementoId]->Tickets=[];
            }
            $data->main->Elementos[$actividadObj->id_elemento]->Tickets[$actividadObj->id_ticket] = $actividadObj;
        }
        return $data;
    }  
}
/*Hay que definir twig para cargar y rendereizar las plantillas para ello necesitamos la variable twig y por ello 
pasamos la instancia del twig en el constructor, para asegurar que este disponible, si no se hace dará error*/