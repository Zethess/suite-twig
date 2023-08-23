<?php
class DatosActivities {
    public $id;
    public $img;
    public $tituloMain;
    public $parrafoMain;
    public $Tickets=[];
    public $Opciones=[];

    public function __construct($img, $tituloMain, $parrafoMain) {
        $this->img = $img;
        $this->tituloMain = $tituloMain;
        $this->parrafoMain = $parrafoMain;
    }
}

// Crear instancias de Datos
$datos1 = new DatosActivities('assets/images/hotel.jpeg', 'Buceo en aguas caribeñas', 'Habitación con cama de matrimonio, spa y Jacuzi. Cama de 200cm. Impedit asperiores dolorum numquam molestiae hic libero maiores veniam minus error illo quisquam distinctio, laudantium');
$datos1->id=128;
$ticket=new stdClass();
$ticket->id_ticket=1;
$ticket->nombre='Entrada Adulto';
$ticket->subtitulo='Mayores de 12 años, precio por persona';
$ticket->precio='18€';
// $ticket->cantidad=0;
$datos1->Tickets[]=$ticket;

$ticket=new stdClass();
$ticket->id_ticket=2;
$ticket->nombre='Niños';
$ticket->subtitulo='Menores de 12';
$ticket->precio='12€';
// $ticket->opcional=0;
$datos1->Tickets[]=$ticket;

$opcion=new stdClass();
$opcion->id_opcion=1;
$opcion->nombre='Audioguía';
$opcion->subtitulo='Disponible en Español, inglés y francés';
$opcion->precio='7€';
$datos1->Opciones[]=$opcion;

$datos2 = new DatosActivities('assets/images/hotel.jpeg', 'Ruta Spa Ecologia con masaje', 'Habitación con cama de tela, ducha y piscina. Cama de 1200cm. Impedit asperiores dolorum numquam molestiae hic libero maiores veniam minus error illo quisquam distinctio, laudantium');
$datos2->id=129;
$ticket=new stdClass();
$ticket->id_ticket=3;
$ticket->nombre='Entrada Adulto';
$ticket->subtitulo='Mayores de 12 años, precio por persona';
$ticket->precio='18€';
// $ticket->cantidad=0;
$datos2->Tickets[]=$ticket;
$ticket=new stdClass();
$ticket->id_opcion=2;
$ticket->nombre='Niños';
$ticket->subtitulo='Menores de 12';
$ticket->precio='12€';
// $ticket->opcional=0;
$datos2->Tickets[]=$ticket;

$opcion=new stdClass();
$opcion->id_ticket=1; //o id_opcion
$opcion->nombre='Audioguía';
$opcion->subtitulo='Disponible en Español, inglés y francés';
$opcion->precio='7€';
$datos2->Opciones[]=$opcion;
$lista = [$datos1, $datos2];