//Objeto elementos que almacena los identificadores de los iconos y los div que muestran

const elements = {
    'cancel-icon': 'flexible-widnow-div',
    'cancel-icon-2': 'flexible-widnow-div',
    'offer-icon': 'offer-window-div',
    'main-icon-js': 'info-window-div'
  };
  
  loadEventListeners();
  
  function loadEventListeners() {
    //Para cada uno de los objetos se le asigna la referencia a cada uno de los elementos 
    for (const [iconId, windowId] of Object.entries(elements)) {
      const icon = document.getElementById(iconId);
      const window = document.getElementById(windowId);
      //Una vez asignado se le asigna el controlador necesario y se llama a la funcion pasandole un parametro, de ahi la funcion flecha
      icon.addEventListener('mouseover', () => showElement(window));
      icon.addEventListener('mouseout', () => hideElement(window));
    }
  }
  
  function showElement(element) {
    element.classList.add('show-element');
  }
  
  function hideElement(element) {
    element.classList.remove('show-element');
  }