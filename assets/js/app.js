
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
    contentElement.html(data.resultado); //data contiene la respuesta del servidor que es el html en este caso
    //si hay funcionalidades adicionales se ejecuta el callback
    if (typeof callback == 'function') {
      callback(data);
    }
       
    });
  }

  //Hay tres plantillas que se esconden cuando se clica un boton, esto añade una clase que hace que desaparezca
  //se le pasa el div donde esta esta plantilla en el twig, nombre de la clae y el icono/boton
  addDinamicsCloseIconEvent(idDiv, className,idIcon) {
    $(`#${idIcon}`).on('click', () => {
      $(`#${idDiv}`).addClass(className);
    });
  }

  //iniciar todo, creandolo en una clase
  /**se ejecuta cuando se carga el DOM y llama a las funciones loadSelectionContent y loadHotelContent. */
  loadEventListeners() {
    $(document).ready(() => {
      this.loadSelectionContent();
      this.loadHotelContent();
      this.loadActivitiesContent();
      // this.loadCancelContent();
      // this.loadMainContent();
      // this.loadOfferContent();
    });
  }
  
  //Cada funcion carga cada una de las plantillas, pasando la ruta dnde se encuentra en assets(dir), el div
  //dentro del archivo index.twig donde se va almacenar y por ultimo una funcion si esa plantilla tiene eventos
  loadHotelContent() {
    this.loadTemplate('hotelInfo', $('#contenido-hotel'), this.loadWindows);
  }
  
  loadSelectionContent() {
    this.loadTemplate('selection', $('#contenido-selection')); //no tiene eventos
  }
  
  loadActivitiesContent() {
    this.loadTemplate('activities', $('#contenido-activities'), this.loadActivitiesData.bind(this));//con el bind la funcion puede ver el resto de funciones de la instancia TemplateManager
  }
  
  loadCancelContent() { 
    this.loadTemplate('flexibleDiv', $('#contenido-flex'), () => this.addDinamicsCloseIconEvent('contenido-flex','flexible-div-hide','flex-close-icon'));
  }
  
  loadOfferContent() {
    this.loadTemplate('offerWindow', $('#contenido-offer'), () => this.addDinamicsCloseIconEvent('contenido-offer','offer-div-hide','offer-close-icon'));
  }
  
  loadMainContent() {
    this.loadTemplate('infoWindow', $('#contenido-info'), () => this.addDinamicsCloseIconEvent('contenido-info','info-div-hide','info-close-icon'));
  }
  
  loadWindows() {
    //objeto que almacena el id que tiene la funcionalidad, el div donde se hara el evento y en este caso se le añade una clase
    const icons = {
      cancelIconWindow: {idIcon: 'cancel-icon', idDiv: 'contenido-flex',className: 'flexible-div-hide',functionName: 'loadCancelContent'},
      cancelIcon2: { idIcon: 'cancel-icon-2', idDiv: 'contenido-flex', className: 'flexible-div-hide',functionName: 'loadCancelContent' },
      offerIcon: { idIcon: 'offer-icon', idDiv: 'contenido-offer', className: 'offer-div-hide',functionName: 'loadOfferContent' },
      mainIconJS: { idIcon: 'main-icon-js', idDiv: 'contenido-info', className: 'info-div-hide',functionName: 'loadMainContent' }
    }
  
    //funcion que añade un evento a cada uno de los objetos de arriba
    function handleIconClick(iconKey){
      const { idIcon, idDiv, className, functionName } = iconKey;
      const iconWindow = $(`#${idIcon}`);
      const contentElement = $(`#${idDiv}`);
      //"Cannot read properties of undefined (reading 'bind') para evitar ese problema se añade el bind
      const callbackFunction = templateManager[functionName].bind(templateManager);
      iconWindow.on('click', () => {
        callbackFunction();
        contentElement.removeClass(className);
      });
    }
  
    //recorre cada uno de los objetos
    for (const key in icons) {
      const icon = icons[key];
      handleIconClick(icon);
    }
  }
  initDatepicker(fechaInput) {
    
    fechaInput.datepicker({
      // Aquí puedes configurar las opciones del datepicker según tus necesidades.
      // Por ejemplo, puedes especificar el formato de la fecha, el idioma, etc.
      dateFormat: "DD dd/mm/yy",
      numberOfMonths: 1, // Mostrar mas meses al mismo tiempo
      showCurrentAtPos: 0, // Mostrar el mes actual en la  posición indicada
      minDate: 0, // Impedir seleccionar fechas anteriores a la fecha actual
      showAnim: "drop", //sirve para animaciones
      showOtherMonths: true, //indica si se deben mostrar los días de los meses anteriores y posteriores al mes actual en el datepicker
      selectOtherMonths: true, // determina si se pueden seleccionar días de otros meses en el datepicker
      showButtonPanel: true, //indica si se debe mostrar un panel de botones en el datepicker
      changeMonth: true, // permite al usuario cambiar el mes mostrado en el datepicker
      changeYear: true, // permite al usuario cambiar el año mostrado en el datepicker
      language: 'es',
      //datepicker objeto que contiene información sobre el datepicker que está siendo seleccionado
      onSelect: (dateText, datepicker) => {//contiene input: El elemento DOM del input que activó el datepicker.
        const targetSummaryId = $(datepicker.input).data('target-summary');//Así, podemos utilizar $(datepicker.input) para obtener más detalles sobre el input si es necesario.
        const targetSummaryElement = $('#' + targetSummaryId); 
        // Esta función se ejecutará cuando el usuario seleccione una fecha en el datepicker.
        // dateText contendrá la fecha seleccionada en formato de texto.
        // Puedes establecer el valor del input con la fecha seleccionada.
        this.updateSummary(targetSummaryElement, dateText);
        $(datepicker.input).val(dateText);
      }
    });
  }
  loadActivitiesData() {
    $('.btn-more-button').click((event) => {
      this.toggleContenedor($(event.target), true);
    });

    $('.btn-reservar-button').click((event) => {
      this.toggleContenedor($(event.target), false);
    });

    $('.btn_menos_evnt').click((event) => {
      this.handleAmountClick($(event.target), false);
    });

    $('.btn_mas_evnt').click((event) => {
      this.handleAmountClick($(event.target), true);
    });
    this.initDatepicker($('input[name="fecha-hora"]'));

  }
  //función muestra u oculta el contenido de una sección de actividad
  toggleContenedor(button, isMoreInfo) {
    const activityDiv = $(button).closest('.activity-section').find('.second-activity-div');
    if (isMoreInfo) {
      const cancelButton = button.siblings('.btn-reservar-button');
      activityDiv.removeClass('slide-up');
      activityDiv.addClass('slide-down');
      cancelButton.addClass('cancel-button');
      cancelButton.text('Cerrar');
    } else {
      activityDiv.removeClass('slide-down');
      activityDiv.addClass('slide-up');
      button.removeClass('cancel-button');
      button.text('Reservar');
    }
  }
  //función maneja los eventos de clic en los botones de incremento o decremento en una sección de actividad
  handleAmountClick(button, isIncrease) {
    //menossss esta mal 
    const parentDiv = button.closest('.activity-prices-second-tr, .activity-prices-fifth-tr');
    const decreaseButton = parentDiv.find('.btn_menos_evnt');
    const span = parentDiv.find('span[id^="ammount"]');
    let currentAmount = parseInt(span.text());
  
    if (isIncrease) {
      currentAmount++;
      decreaseButton.removeClass('decrease-ammount-disabled');
    } else {
      
        if (currentAmount > 0){
        currentAmount--;

        if (currentAmount == 0) {
          decreaseButton.addClass('decrease-ammount-disabled');
        }

      }else{
        // Si es un botón "decrease" y la cantidad actual es 0, no hacemos nada.
        return;
      }
    }
  
    span.text(currentAmount);
  
    const ticketPrice = parseFloat(parentDiv.find('.prices-second-td-p').text());
  
    // Actualizar el total y la cantidad de tickets en el HTML
    this.updateSummaryData(parentDiv, ticketPrice, isIncrease);
  }
  
  //función actualiza el resumen de una sección de actividad con los nuevos valores
  updateSummaryData(parentDiv, ticketPrice, isIncrease) {
    const activitySection = parentDiv.closest('.second-activity-div');// Acceder dos padres arriba
    const summaryTickets = activitySection.find('.activity-div-summary-tickets-span');
    const summaryTotal = activitySection.find('.activity-div-summary-total-span');
    console.log(activitySection);
    console.log(summaryTickets);
    console.log(summaryTotal);
  
    // Obtener la cantidad de tickets y el precio actual del resumen
    
    let totalTickets = parseInt(summaryTickets.text());
    
    let currentTotal = parseFloat(summaryTotal.text());
  
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
    summaryTickets.text(totalTickets);
    summaryTotal.text(currentTotal);
  }
  updateSummary(fechaInput, dateText){
    const activitySection = fechaInput.closest('.activity-section');
    const summaryDate = activitySection.find('.activity-div-summary-details-datetime');
    summaryDate.text(dateText);
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


