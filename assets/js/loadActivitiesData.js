export function loadActivitiesData() {
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
export function toggleContenedor(activityDiv, cancelButton, isMoreInfo) {
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
export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function updateSummaryDateTime(section, fechaInput) {
  const summaryDateTimeSpan = section.querySelector(`#activity-div-summary-datetime-${section.dataset.activityIndex}`);
  const fechaValue = fechaInput.value;
  const fechaValida = /^(\d{4})-\d{2}-\d{2}T\d{2}:\d{2}/.test(fechaValue);
  
  if (fechaValida) {
    const fechaSeleccionada = new Date(fechaValue);
    const opcionesFechaHora = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
    const fechaHoraTexto = fechaSeleccionada.toLocaleDateString('es-ES', opcionesFechaHora);
    summaryDateTimeSpan.textContent = this.capitalizeFirstLetter(fechaHoraTexto);
  } else {
    summaryDateTimeSpan.textContent = 'Fecha y hora no válidas';
  }
}

export function handleIconoClick( fechaInput) {
    if (!fechaInput.disabled) {
      fechaInput.disabled = false;
    }
  }
export function handleFechaInput(fechaInput, diaSemana) {
    const fechaValue = fechaInput.value;
    const fechaValida = /^(\d{4})-\d{2}-\d{2}/.test(fechaValue);
    if (!fechaValida) {
      alert('Formato de fecha incorrecto. Por favor, ingrese una fecha válida en el formato yyyy-mm-dd.');
      fechaInput.value = '';
    }
    if (diaSemana) {
      diaSemana.textContent = this.getDiaSemanaTexto(fechaInput.value);
    }
  }
  
  export function getDiaSemanaTexto(fecha) {
    const opcionesDiaSemana = { weekday: 'long' };
    const fechaSeleccionada = new Date(fecha);
    return fechaSeleccionada.toLocaleDateString('es-ES', opcionesDiaSemana);
  }
  
  
  export function handleAmountClick(button, isIncrease) {
    const parentDiv = button.closest('.activity-prices-second-tr, .activity-prices-fifth-tr');
    const span = parentDiv.querySelector('span[id^="ammount"]');
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
  
  export function updateSummaryData(parentDiv, ticketPrice, isIncrease) {
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