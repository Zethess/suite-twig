// Obtener los botones por sus IDs
const firstMoreInfoButton = document.getElementById('info-main-activity-button');
const secondMoreInfoButton = document.getElementById('info-activity-bottom-button');
const firstCancelButton = document.getElementById('cancel-main-activity-button');
const secondCancelButton = document.getElementById('cancel-activity-bottom-button');

// Obtener el contenedor por su clase
const firstActivityDiv = document.getElementById('first-activity-div');
const secondActivityDiv = document.getElementById('second-activity-div');

// Agregar los event listeners a los botones
secondMoreInfoButton.addEventListener('click', toggleContenedorInfo);
secondCancelButton.addEventListener('click', toggleContenedorCancel);

// Función para alternar la visibilidad del contenedor
function toggleContenedorInfo() {
    if (!secondCancelButton.classList.contains('cancel-button')) {
        // Alternar la clase 'slide-down' en el contenedor
        secondActivityDiv.classList.toggle('slide-down');
        secondActivityDiv.classList.toggle('slide-up');

        // Alternar la clase adicional en el botón
        secondCancelButton.classList.toggle('cancel-button');

        // Alternar el contenido del botón
        secondCancelButton.textContent = 'Cerrar';
       
    }
  
}
function toggleContenedorCancel() {
    if (this.classList.contains('cancel-button')) {
        
    
        // Alternar la clase 'slide-down' en el contenedor
        secondActivityDiv.classList.toggle('slide-down');
        secondActivityDiv.classList.toggle('slide-up');

        // Alternar la clase adicional en el botón
        this.classList.toggle('cancel-button');

         // Alternar el contenido del botón
    
        this.textContent = 'Reservar';
    }
}

$('.btn_menos_evnt').click(function(){
    var Elemento=$(this);
    var Padre=Elemento.parents('.activity-section');
    alert(Padre.attr('id'));
  });


    
  loadActivitiesData() {
    const activitySections = $('.activity-section');

    activitySections.each((index, section) => {
      $(section).data('activityIndex', index + 1); // Establecer el atributo data-activity-index en cada bloque
  
      const moreInfoButton = $(section).find('.more-button').get(0);
      const cancelButton = $(section).find('.reservar-button').get(0);
      const activityDiv = $(section).find('.second-activity-div').get(0);
      const fechaInput = $(section).find('input[name="fecha-hora"]').get(0);
      const diaSemana = $(section).find('.dia-semana .span-dia').get(0);
      const iconoFecha = $(section).find('.icono-fecha').get(0);
      const iconoHora = $(section).find('.icono-hora').get(0);
      const decreaseButtons = $(section).find('.decrease-button');
      const increaseButtons = $(section).find('.increase-button');
      
      $(moreInfoButton).on('click', () => {
        this.toggleContenedor($(activityDiv), $(cancelButton), true);
      });
  
      $(cancelButton).on('click', () => {
        this.toggleContenedor($(activityDiv), $(cancelButton), false);
      });
  
      // Evento para el icono Fecha
      $(iconoFecha).on('click', () => {
        this.handleIconoClick($(fechaInput));
        this.updateSummaryDateTime(section, fechaInput);
      });
    
      // // Evento para el icono Hora
      $(iconoHora).on('click', () => {
        this.handleIconoClick($(fechaInput));
        this.updateSummaryDateTime(section, fechaInput);
      });
      $(fechaInput).on('input', () => {
        this.handleFechaInput($(fechaInput), diaSemana);
        this.updateSummaryDateTime(section, fechaInput);
      });

      // Agregar eventos para los botones "decrease"
      decreaseButtons.each(( decreaseButton) => {
        $(decreaseButton).on('click', () => this.handleAmountClick($(decreaseButton), false));
      });

      // Agregar eventos para los botones "increase"
      increaseButtons.each((index, increaseButton) => {
        $(increaseButton).on('click', () => this.handleAmountClick($(increaseButton), true));
      });
    });
  }
  
  //función muestra u oculta el contenido de una sección de actividad
  toggleContenedor(button, isMoreInfo) {
    const activityDiv = $(button).closest('.activity-section');
    
    if (isMoreInfo) {
      const cancelButton = button.siblings('.reservar-button');
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


  $('.btn_icono_hora').click((event) => {
    this.handleIconoClick($(event.target));
  });

  $('input[name="fecha-hora"]').change((event) => {
    this.handleIconoClick($(event.target));
  });
 
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

//función recibe una cadena (string) como argumento y devuelve la misma cadena con la primera letra en mayúscula
capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
  //charAt(0) para obtener el primer carácter de la cadena
  //slice(1) para obtener el resto de la cadena a partir del segundo carácter y lo concatena con la primera letra en mayúscula.
}

//función actualiza el resumen de fecha y hora en una sección de actividad
updateSummaryDateTime(icono) {
  //section.dataset.activityIndex: dataset es una propiedad de los elementos DOM que permite acceder a los atributos de datos personalizados (data-*) definidos en el HTML
  const section = $(icono).closest('.activity-section');
  const fechaInput = $(icono).closest('.input-fecha-hora input[name="fecha-hora"]');
  const summaryDateTimeSpan = $(`#activity-div-summary-datetime-${$(section).data('activityIndex')}`);
  const fechaValue = $(fechaInput).val();
  //formato adecuado utilizando una expresión regular.
  const fechaValida = /^(\d{4})-\d{2}-\d{2}T\d{2}:\d{2}/.test(fechaValue);
  
  if (fechaValida) {
    //crea un objeto Date a partir del valor de fechaInput
    const fechaSeleccionada = new Date(fechaValue);
    //objeto utilizado para especificar las opciones de formato que se aplicarán al formatear una fecha y hora
    const opcionesFechaHora = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    //formatear la fecha en un formato legible para el usuario en español
    const fechaHoraTexto = fechaSeleccionada.toLocaleDateString('es-ES', opcionesFechaHora);
    summaryDateTimeSpan.text(this.capitalizeFirstLetter(fechaHoraTexto));
  } else {
    summaryDateTimeSpan.text('Fecha y hora no válidas');
  }
}

//función maneja el evento de clic en el icono de fecha o hora de una sección de actividad
handleIconoClick( icono) {
  const fechaInput = $(event.target).closest('.input-fecha-hora input[name="fecha-hora"]');
  if (!fechaInput.is(':disabled')) {
    fechaInput.prop('disabled', false);
  }
  this.updateSummaryDateTime(icono);
}

//función maneja el evento de entrada de datos en el campo de entrada de fecha/hora (fechaInput) en una sección de actividad
handleFechaInput(fechaInput) {
  const diaSemana = $(fechaInput).closest('.span-dia');
  const fechaValue = fechaInput.val();
  const fechaValida = /^(\d{4})-\d{2}-\d{2}/.test(fechaValue);
  if (!fechaValida) {
    //Si el formato no es válido, muestra una alerta para informar al usuario que ingrese una fecha válida 
    alert('Formato de fecha incorrecto. Por favor, ingrese una fecha válida en el formato yyyy-mm-dd.');
    fechaInput.val('');
  }
  if (diaSemana.length > 0) {
    diaSemana.text(this.getDiaSemanaTexto(fechaInput.val()));
  }
  this.updateSummaryDateTime($(fechaInput));
}

//función recibe una fecha en formato yyyy-mm-dd y devuelve el nombre del día de la semana
getDiaSemanaTexto(fecha) {
  const opcionesDiaSemana = { weekday: 'long' };
  const fechaSeleccionada = new Date(fecha);
  //crear un objeto Date a partir de la fecha y luego formatea la fecha para obtener el nombre del día de la semana
  return fechaSeleccionada.toLocaleDateString('es-ES', opcionesDiaSemana);
}

<div class="activity-bottom-date second-activity-child">
                        <div class="fecha-hora-container">
                            <div class="input-fecha-hora">
                                <input type="text" id="fecha-hora-{{ loop.index }}" name="fecha-hora" class="ocultar-icono" required>
                                <label for="fecha-hora-{{ loop.index }}" class="icons-fecha-hora">
                                <span class="icono-fecha btn_icono_fecha"><img src="../images/calendario.svg" alt="Icono Fecha" width="22" height="25"></span>
                                <span class="icono-hora btn_icono_hora"><img src="../images/hora.svg" alt="Icono Hora" width="22" height="25"></span>
                            </label>
                            </div>
                        </div>
                    </div>