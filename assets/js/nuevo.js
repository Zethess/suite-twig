
// import {
//   loadActivitiesData,
//   toggleContenedor,
//   capitalizeFirstLetter,
//   updateSummaryDateTime,
//   handleIconoClick,
//   handleFechaInput,
//   getDiaSemanaTexto,
//   handleAmountClick,
//   updateSummaryData,
// } from 'loadActivitiesData.js';

//Se utiliza para enviar solicitudes AJAX al servidor
class AjaxLoader {
  /**toma una URL, parámetros, y una función de devolución de llamada. Realiza una solicitud AJAX*/
  sendToServer(url, params, callback) {
    $.ajax({
      url: url, // La URL a la que se enviará la solicitud.
      type: 'POST', // El método de la solicitud, en este caso, POST.
      dataType: 'json',// El tipo de datos que se espera recibir del servidor, en este caso, JSON.
      data: JSON.stringify(params),// Los parámetros de la solicitud, convertidos a una cadena JSON.
      contentType: 'application/json',// El tipo de contenido de la solicitud, en este caso, JSON.
      //objeto con dos propiedades: success y error.
      success: function(data) {
       // La función que se ejecuta cuando la solicitud es exitosa.
       // Llama a la función de devolución de llamada proporcionada con los datos recibidos del servidor.
        callback(data);
      },
      error: function(xhr, status, error) {
        // La función que se ejecuta cuando hay un error en la solicitud.
        // Muestra el mensaje de error en la consola.
        console.error('Error:', error);
      }
    });
  }
}
/**se encarga de cargar y gestionar las plantillas. Tiene un objeto templates para almacenar las plantillas registradas. */
class TemplateManager {
  
  /**carga una plantilla haciendo una solicitud AJAX al servidor utilizando la clase "AjaxLoader". 
   * Después de cargar la plantilla, actualiza el contenido del elemento HTML especificado y opcionalmente llama a una función de devolución de llamada. */
  loadTemplate(url, contentElement, callback) {
    //Objeto que contiene la clave action y el valor url 
    const params = { action: url };//esto luego se pasara a tipo json con el stringify
    const ajaxLoader = new AjaxLoader();
    //Después de cargar la plantilla, actualiza el contenido del elemento HTML especificado y, opcionalmente, llama a una función de devolución de llamada.
    ajaxLoader.sendToServer('index.php', params, function(data) {
    contentElement.innerHTML = data.resultado; //data contiene la respuesta del servidor que es el html en este caso
    //si hay funcionalidades adicionales se ejecuta el callback
    if (typeof callback == 'function') {
      callback(data);
    }
       
    });
  }

  //Hay tres plantillas que se esconden cuando se clica un boton, esto añade una clase que hace que desaparezca
  //se le pasa el div donde esta esta plantilla en el twig, nombre de la clae y el icono/boton
  addDinamicsCloseIconEvent(idDiv, className,idIcon) {
    const dinamicsIcons = document.getElementById(idIcon);
    dinamicsIcons.addEventListener('click', () => {
      const dinamicsWindows = document.getElementById(idDiv);
      dinamicsWindows.classList.add(className);
    });
  }

//iniciar todo, creandolo en una clase
/**se ejecuta cuando se carga el DOM y llama a las funciones loadSelectionContent y loadHotelContent. */
  loadEventListeners() {
    document.addEventListener('DOMContentLoaded', () => {
      this.loadSelectionContent();
      this.loadHotelContent();
      this.loadActivitiesContent();
      this.loadCancelContent();
      this.loadMainContent();
      this.loadOfferContent();
    });
  }
  //Cada funcion carga cada una de las plantillas, pasando la ruta dnde se encuentra en assets(dir), el div
  //dentro del archivo index.twig donde se va almacenar y por ultimo una funcion si esa plantilla tiene eventos
   loadHotelContent() {
    this.loadTemplate('hotelInfo',
                                 document.getElementById('contenido-hotel'),
                                 this.loadWindows);
  }
  
   loadSelectionContent() {
    this.loadTemplate('selection',
                                 document.getElementById('contenido-selection')); //no tiene eventos
  }
  loadActivitiesContent() {
    this.loadTemplate('activities',
                                 document.getElementById('contenido-activities'),
                                 this.loadActivitiesData.bind(this));//con el bind la funcion puede ver el resto de funciones de la instancia TemplateManager
                               
  }
  
   loadCancelContent() { 
    this.loadTemplate('flexibleDiv',
                                 document.getElementById('contenido-flex'),
                                 () => this.addDinamicsCloseIconEvent('contenido-flex','flexible-div-hide','flex-close-icon'));
  }
  
   loadOfferContent() {
    this.loadTemplate('offerWindow', //url del archivo html
                                 document.getElementById('contenido-offer'),//en index.twig donde se guarda
                                 () => this.addDinamicsCloseIconEvent('contenido-offer','offer-div-hide','offer-close-icon'));//el evento que tiene el div
  }
  
   loadMainContent() {
    this.loadTemplate('infoWindow',
                                 document.getElementById('contenido-info'),
                                 () => this.addDinamicsCloseIconEvent('contenido-info','info-div-hide','info-close-icon'));
  }
  
   loadWindows() {
    //objeto que almacena el id que tiene la funcionalidad, el div donde se hara el evento y en este caso se le añade una clase
    const icons = {
      cancelIconWindow: {idIcon: 'cancel-icon', idDiv: 'contenido-flex',className: 'flexible-div-hide'},
      cancelIcon2: { idIcon: 'cancel-icon-2', idDiv: 'contenido-flex', className: 'flexible-div-hide' },
      offerIcon: { idIcon: 'offer-icon', idDiv: 'contenido-offer', className: 'offer-div-hide' },
      mainIconJS: { idIcon: 'main-icon-js', idDiv: 'contenido-info', className: 'info-div-hide' }
    }
  
    //funcion que añade un evento a cada uno de los objetos de arriba
    function handleIconClick(iconKey){
      const { idIcon, idDiv, className } = iconKey;
      const iconWindow = document.getElementById(idIcon);
      const contentElement = document.getElementById(idDiv);
  
      iconWindow.addEventListener('click', () => {
        contentElement.classList.remove(className);
      });
    }
  
    //recorre cada uno de los objetos
    for (const key in icons) {
      const icon = icons[key];
      handleIconClick(icon);
    }
  
  }
  
  loadActivitiesData() {
    const activitySections = document.querySelectorAll('.activity-section');
  
    activitySections.forEach((section, index) => {
      section.dataset.activityIndex = index + 1; // Establecer el atributo data-activity-index en cada bloque
  
      const moreInfoButton = section.querySelector('.more-button');
      const cancelButton = section.querySelector('.reservar-button');
      const activityDiv = section.querySelector('.second-activity-div');
      const fechaInput = section.querySelector('.input-fecha-hora input[name="fecha-hora"]');
      const diaSemana = section.querySelector('.dia-semana .span-dia');
      const iconoFecha = section.querySelector('.icono-fecha');
      const iconoHora = section.querySelector('.icono-hora');
      const decreaseButtons = section.querySelectorAll('.decrease-button');
      const increaseButtons = section.querySelectorAll('.increase-button');
      
      moreInfoButton.addEventListener('click', () => {
        this.toggleContenedor(activityDiv, cancelButton, true);
      });
  
      cancelButton.addEventListener('click', () => {
        this.toggleContenedor(activityDiv, cancelButton, false);
      });
  
      // Evento para el icono Fecha
      iconoFecha.addEventListener('click', () => {
        this.handleIconoClick(fechaInput);
        this.updateSummaryDateTime(section, fechaInput);
      });
    
      // Evento para el icono Hora
      iconoHora.addEventListener('click', () => {
        this.handleIconoClick(fechaInput);
        this.updateSummaryDateTime(section, fechaInput);
      });
      fechaInput.addEventListener('input', () => {
        this.handleFechaInput(fechaInput, diaSemana);
        this.updateSummaryDateTime(section, fechaInput);
      });

      // Agregar eventos para los botones "decrease"
      decreaseButtons.forEach((decreaseButton) => {
        decreaseButton.addEventListener('click', () => this.handleAmountClick(decreaseButton, false));
      });

      // Agregar eventos para los botones "increase"
      increaseButtons.forEach((increaseButton) => {
        increaseButton.addEventListener('click', () => this.handleAmountClick(increaseButton, true));
      });
});
}
//función muestra u oculta el contenido de una sección de actividad
toggleContenedor(activityDiv, cancelButton, isMoreInfo) {
  if (isMoreInfo) {
    activityDiv.classList.remove('slide-up');
    activityDiv.classList.add('slide-down');
    cancelButton.classList.add('cancel-button');
    cancelButton.textContent = 'Cerrar';
  } else {
    activityDiv.classList.remove('slide-down');
    activityDiv.classList.add('slide-up');
    cancelButton.classList.remove('cancel-button');
    cancelButton.textContent = 'Reservar';
  }
}
//función recibe una cadena (string) como argumento y devuelve la misma cadena con la primera letra en mayúscula
capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
  //charAt(0) para obtener el primer carácter de la cadena
  //slice(1) para obtener el resto de la cadena a partir del segundo carácter y lo concatena con la primera letra en mayúscula.
}
//función actualiza el resumen de fecha y hora en una sección de actividad
updateSummaryDateTime(section, fechaInput) {
  //section.dataset.activityIndex: dataset es una propiedad de los elementos DOM que permite acceder a los atributos de datos personalizados (data-*) definidos en el HTML
  const summaryDateTimeSpan = section.querySelector(`#activity-div-summary-datetime-${section.dataset.activityIndex}`);
  const fechaValue = fechaInput.value;
  //formato adecuado utilizando una expresión regular.
  const fechaValida = /^(\d{4})-\d{2}-\d{2}T\d{2}:\d{2}/.test(fechaValue);
  
  if (fechaValida) {
    //crea un objeto Date a partir del valor de fechaInput
    const fechaSeleccionada = new Date(fechaValue);
    //objeto utilizado para especificar las opciones de formato que se aplicarán al formatear una fecha y hora
    const opcionesFechaHora = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    //formatear la fecha en un formato legible para el usuario en español
    const fechaHoraTexto = fechaSeleccionada.toLocaleDateString('es-ES', opcionesFechaHora);
    summaryDateTimeSpan.textContent = this.capitalizeFirstLetter(fechaHoraTexto);
  } else {
    summaryDateTimeSpan.textContent = 'Fecha y hora no válidas';
  }
}
//función maneja el evento de clic en el icono de fecha o hora de una sección de actividad
  handleIconoClick( fechaInput) {
    //Verifica si el campo de entrada fechaInput no está deshabilitado
    if (!fechaInput.disabled) {
      fechaInput.disabled = false;
    }
  }
  //función maneja el evento de entrada de datos en el campo de entrada de fecha/hora (fechaInput) en una sección de actividad
  handleFechaInput(fechaInput, diaSemana) {
    const fechaValue = fechaInput.value;
    const fechaValida = /^(\d{4})-\d{2}-\d{2}/.test(fechaValue);
    if (!fechaValida) {
      //Si el formato no es válido, muestra una alerta para informar al usuario que ingrese una fecha válida 
      alert('Formato de fecha incorrecto. Por favor, ingrese una fecha válida en el formato yyyy-mm-dd.');
      fechaInput.value = '';
    }
    if (diaSemana) {
      diaSemana.textContent = this.getDiaSemanaTexto(fechaInput.value);
    }
  }
  //función recibe una fecha en formato yyyy-mm-dd y devuelve el nombre del día de la semana
  getDiaSemanaTexto(fecha) {
    const opcionesDiaSemana = { weekday: 'long' };
    const fechaSeleccionada = new Date(fecha);
    //crear un objeto Date a partir de la fecha y luego formatea la fecha para obtener el nombre del día de la semana
    return fechaSeleccionada.toLocaleDateString('es-ES', opcionesDiaSemana);
  }
  
  //función maneja los eventos de clic en los botones de incremento o decremento en una sección de actividad
  handleAmountClick(button, isIncrease) {
    const parentDiv = button.closest('.activity-prices-second-tr, .activity-prices-fifth-tr');
    const span = parentDiv.querySelector('span[id^="ammount"]');//seleccionar elementos que tengan un atributo id que comience con "ammount"
    let currentAmount = parseInt(span.textContent);
  
    if (isIncrease) {
      currentAmount++;
    } else {
      if (currentAmount > 0) {
        currentAmount--;
      } else {
        // Si es un botón "decrease" y la cantidad actual es 0, no hacemos nada.
        return;
      }
    }
  
    span.textContent = currentAmount;
  
    const ticketPrice = parseFloat(parentDiv.querySelector('.prices-second-td-p').textContent);
  
    // Actualizar el total y la cantidad de tickets en el HTML
    this.updateSummaryData(parentDiv, ticketPrice, isIncrease);
  }
  //función actualiza el resumen de una sección de actividad con los nuevos valores
  updateSummaryData(parentDiv, ticketPrice, isIncrease) {
    const activitySection = parentDiv.closest('.second-activity-div');// Acceder dos padres arriba
    const summaryTickets = activitySection.querySelector('.activity-div-summary-tickets-span');
    const summaryTotal = activitySection.querySelector('.activity-div-summary-total-span');
  
    // Obtener la cantidad de tickets y el precio actual del resumen
    
    let totalTickets = parseInt(summaryTickets.textContent);
    
    let currentTotal = parseFloat(summaryTotal.textContent);
  
    // Actualizar los valores en el resumen según el booleano
    if (isIncrease) {
      totalTickets++;
      currentTotal += ticketPrice;
    } else {
      if (totalTickets > 0) {
        totalTickets--;
        currentTotal -= ticketPrice;
      }
    }
  
    // Actualizar los elementos del resumen con los nuevos valores
    summaryTickets.textContent = totalTickets;
    summaryTotal.textContent = currentTotal;
  }
  init() {
    this.loadEventListeners();
  }

  logMessage(message) {
    console.log(message);
  }
}

const templateManager = new TemplateManager();
templateManager.init();

/**Método closest: El método closest es una función de los elementos del DOM en JavaScript
 *  que busca el ancestro más cercano (el primer padre) que cumpla con un selector CSS 
 * especificado. Comienza la búsqueda desde el elemento actual y se desplaza hacia arriba
 *  en el árbol DOM. Cuando encuentra el elemento que coincide con el selector, devuelve 
 * ese elemento. Si no encuentra ningún elemento que coincida, devuelve null. */