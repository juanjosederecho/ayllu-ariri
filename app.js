/* ==========================================================================
   LÓGICA PRINCIPAL: Guardianes de la Comunidad — Ayllu Ariri
   ========================================================================== */

// --- ESTADO GLOBAL DE LA APLICACIÓN ---
const state = {
  activeScreen: "inicio",
  
  // Base de Datos de Reportes (Inicializado de localStorage o vacío)
  reports: JSON.parse(localStorage.getItem("ayllu_reports")) || [
    {
      id: "rep_default_1",
      category: "Basura acumulada",
      urgency: "Alto",
      lat: -15.2635,
      lng: -69.5305,
      description: "Gran cantidad de plásticos y botellas acumuladas cerca al río. El viento las arrastra.",
      photo: "assets/altiplano.png", // Imagen por defecto
      date: "2026-07-05",
      status: "pendiente", // 'pendiente', 'atencion', 'resuelto'
      afterPhoto: null
    },
    {
      id: "rep_default_2",
      category: "Contaminación de bofedales",
      urgency: "Medio",
      lat: -15.2660,
      lng: -69.5340,
      description: "Desechos orgánicos tirados al ingreso del bofedal. Alpacas comiendo basura.",
      photo: "assets/altiplano.png",
      date: "2026-07-06",
      status: "atencion",
      afterPhoto: null
    },
    {
      id: "rep_default_3",
      category: "Quema de residuos",
      urgency: "Alto",
      lat: -15.2620,
      lng: -69.5285,
      description: "Quema de rastrojos y llantas en la esquina del descampado. Humo espeso.",
      photo: "assets/altiplano.png",
      date: "2026-07-04",
      status: "resuelto",
      afterPhoto: "assets/titicaca.png" // Foto después de resuelto
    }
  ],

  // Cola de Reportes Offline
  offlineQueue: JSON.parse(localStorage.getItem("ayllu_offline_queue")) || [],

  // Mink'as de limpieza (Inicializado de CONFIG o localStorage)
  minkas: [],

  // Gamificación del Usuario
  user: JSON.parse(localStorage.getItem("ayllu_user")) || {
    wiphalas: 0,
    unlockedBadges: [] // 'first_report', 'game_master', 'quiz_perfect', 'minka_helper'
  },

  // Ajustes de Accesibilidad
  accessibility: {
    largeText: false,
    textToSpeech: false
  },

  // Estado del juego clasificador
  game: {
    score: 0,
    timeLeft: 30,
    timerInterval: null,
    isPlaying: false,
    currentItem: null
  },

  // Estado del Quiz
  quiz: {
    currentQuestion: 0,
    score: 0,
    answers: []
  }
};

// --- CONFIGURACIÓN E IMÁGENES DE FONDO POR PANTALLA ---
const SCREEN_BACKGROUNDS = {
  inicio: "assets/titicaca.png",
  chatbot: "assets/tejido.png",
  reportar: "assets/altiplano.png",
  mapa: "assets/titicaca.png",
  aprende: "assets/altiplano.png",
  comunidad: "assets/tejido.png",
  nosotros: "assets/titicaca.png"
};

// Contenedores del clasificador
const GAME_ITEMS = [
  { name: "Botella de plástico", icon: "🍾", type: "recyclable" },
  { name: "Cáscara de papa", icon: "🥔", type: "organic" },
  { name: "Pilas gastadas", icon: "🔋", type: "hazardous" },
  { name: "Papel higiénico", icon: "🧻", type: "general" },
  { name: "Lata de atún", icon: "🥫", type: "recyclable" },
  { name: "Cáscara de plátano", icon: "🍌", type: "organic" },
  { name: "Termómetro de mercurio", icon: "🌡️", type: "hazardous" },
  { name: "Envoltorio de plástico de fideos", icon: "🍜", type: "recyclable" },
  { name: "Restos de quinua cocida", icon: "🍲", type: "organic" },
  { name: "Bolsa de plástico rota", icon: "🛍️", type: "recyclable" },
  { name: "Pañal usado", icon: "👶", type: "general" },
  { name: "Jeringa usada", icon: "💉", type: "hazardous" }
];

// --- SELECTORES AUXILIARES ---
const $ = (id) => document.getElementById(id);
const $$ = (selector) => document.querySelectorAll(selector);

// --- MOTOR DE TEXT-TO-SPEECH (LECTURA POR VOZ) ---
function speakText(text) {
  if (!state.accessibility.textToSpeech) return;
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Detener lecturas previas
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-PE'; // Español de Perú
    window.speechSynthesis.speak(utterance);
  }
}

// Resaltado visual temporal al leer
function highlightAndSpeak(elementId, text) {
  const elem = $(elementId);
  if (!elem) return;
  
  if (state.accessibility.textToSpeech) {
    elem.classList.add("speaking-highlight");
    speakText(text);
    setTimeout(() => {
      elem.classList.remove("speaking-highlight");
    }, 4000);
  }
}

// --- CONFIGURACIÓN DE NAVEGACIÓN ---
function initNavigation() {
  $$(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
      const screenId = button.getAttribute("data-screen");
      switchScreen(screenId);
    });
  });

  // Botón de inicio CTA
  $("inicio-cta-report").addEventListener("click", () => {
    switchScreen("reportar");
  });

  // Botón flotante de Pánico
  $("panic-report-btn").addEventListener("click", () => {
    switchScreen("reportar");
    highlightAndSpeak("title-reportar", "Pantalla de Reporte Urgente. Por favor, captura una foto y selecciona la categoría de contaminación.");
  });
}

function switchScreen(screenId) {
  // Desactivar pantallas
  $$(".app-screen").forEach(screen => screen.classList.remove("active"));
  $$(".nav-item").forEach(btn => {
    btn.classList.remove("active");
    btn.removeAttribute("aria-current");
  });

  // Activar actual
  const activeScreen = $("screen-" + screenId);
  if (activeScreen) {
    activeScreen.classList.add("active");
    state.activeScreen = screenId;
    
    // Cambiar fondo con overlay WCAG AA
    let bgImg = SCREEN_BACKGROUNDS[screenId] || "assets/titicaca.png";
    let isDarkBg = screenId === "inicio" || screenId === "nosotros"; // Ajuste estético
    let overlay = isDarkBg ? "var(--overlay-dark), var(--overlay-dark)" : "var(--overlay-light), var(--overlay-light)";
    
    document.body.style.backgroundImage = `linear-gradient(${overlay}), url('${bgImg}')`;
    
    // Actualizar nav active button
    const navBtn = document.querySelector(`.nav-item[data-screen="${screenId}"]`);
    if (navBtn) {
      navBtn.classList.add("active");
      navBtn.setAttribute("aria-current", "page");
      
      // Accesibilidad
      const label = navBtn.querySelector(".nav-label").textContent;
      speakText(`Abriendo pantalla ${label}`);
    }

    // Inicializar mapa si es la pestaña mapa
    if (screenId === "mapa") {
      setTimeout(initMap, 100);
    }
  }
}

// --- AJUSTES DE ACCESIBILIDAD ---
function initAccessibility() {
  const accBtn = $("accessibility-btn");
  const accPanel = $("accessibility-panel");
  const fontNormal = $("font-normal-btn");
  const fontLarge = $("font-large-btn");
  const voiceToggle = $("voice-toggle-btn");

  // Mostrar/Ocultar panel
  accBtn.addEventListener("click", () => {
    const isHidden = accPanel.classList.toggle("hidden");
    accPanel.setAttribute("aria-hidden", isHidden);
    accBtn.setAttribute("aria-expanded", !isHidden);
  });

  // Tamaño de texto
  fontNormal.addEventListener("click", () => {
    document.body.classList.remove("large-text");
    fontNormal.classList.add("active");
    fontLarge.classList.remove("active");
    state.accessibility.largeText = false;
    saveLocalState();
    speakText("Tamaño de texto normal activado.");
  });

  fontLarge.addEventListener("click", () => {
    document.body.classList.add("large-text");
    fontLarge.classList.add("active");
    fontNormal.classList.remove("active");
    state.accessibility.largeText = true;
    saveLocalState();
    speakText("Tamaño de texto ampliado activado.");
  });

  // Lectura por voz
  voiceToggle.addEventListener("click", () => {
    state.accessibility.textToSpeech = !state.accessibility.textToSpeech;
    saveLocalState();
    if (state.accessibility.textToSpeech) {
      voiceToggle.textContent = "Activado 🔊";
      voiceToggle.classList.add("active");
      speakText("Lectura por voz activada. Al tocar opciones del menú, te las leeré en voz alta.");
    } else {
      voiceToggle.textContent = "Desactivado 🔇";
      voiceToggle.classList.remove("active");
    }
  });

  // Cargar estado guardado
  if (state.accessibility.largeText) {
    document.body.classList.add("large-text");
    fontLarge.classList.add("active");
    fontNormal.classList.remove("active");
  }
  if (state.accessibility.textToSpeech) {
    voiceToggle.textContent = "Activado 🔊";
    voiceToggle.classList.add("active");
  }

  // Altavoz de instrucciones de chatbot
  $("read-chat-help").addEventListener("click", () => {
    const backupTextToSpeech = state.accessibility.textToSpeech;
    state.accessibility.textToSpeech = true;
    speakText("Hola. Estás en la pantalla del chatbot Ariri. Puedes hacerme preguntas ambientales sobre el Lago Titicaca, degradación de plásticos, horarios de recojo municipal, o buscar palabras en el diccionario aymara. Escribe en el cuadro inferior o presiona el micrófono para hablar.");
    state.accessibility.textToSpeech = backupTextToSpeech;
  });
}

// --- MONITOREO DE CONEXIÓN ONLINE/OFFLINE ---
function initConnectionMonitor() {
  const statusIndicator = $("connection-status");
  
  function updateConnectionStatus() {
    if (navigator.onLine) {
      statusIndicator.classList.remove("offline");
      statusIndicator.classList.add("online");
      statusIndicator.querySelector(".status-text").textContent = "En línea";
      statusIndicator.setAttribute("title", "Conexión activa");
      
      // Sincronizar cola si hay elementos
      syncOfflineQueue();
    } else {
      statusIndicator.classList.remove("online");
      statusIndicator.classList.add("offline");
      statusIndicator.querySelector(".status-text").textContent = "Sin conexión";
      statusIndicator.setAttribute("title", "Modo fuera de línea - Guardando datos en el dispositivo");
      speakText("Se ha perdido la conexión a internet. Los reportes que realices se guardarán localmente.");
    }
  }

  window.addEventListener("online", updateConnectionStatus);
  window.addEventListener("offline", updateConnectionStatus);
  
  // Comprobación inicial
  updateConnectionStatus();
}

// --- CHATBOT AMBIENTAL Y GLOSARIO ---
let speechRecognition = null;
function initChatbot() {
  const chatForm = $("chat-form");
  const chatInput = $("chat-input");
  const chatMessages = $("chat-messages");
  const chatMicBtn = $("chat-mic-btn");
  const glossarySearch = $("glossary-search-input");
  const glossaryContainer = $("glossary-container");

  // Renderizar Glosario
  function renderGlossary(filteredList = CONFIG.glossary) {
    glossaryContainer.innerHTML = "";
    if (filteredList.length === 0) {
      glossaryContainer.innerHTML = `<p style="padding: 10px; color: var(--muted);">No se encontraron términos.</p>`;
      return;
    }
    
    filteredList.forEach(item => {
      const card = document.createElement("div");
      card.className = "glossary-item";
      card.innerHTML = `
        <div class="glossary-header">
          <span class="aymara-term">${item.aymara}</span>
          <span class="spanish-term">${item.spanish}</span>
        </div>
        <p class="glossary-definition">${item.definition}</p>
      `;
      card.addEventListener("click", () => {
        speakText(`${item.aymara} significa en castellano ${item.spanish}. Definición: ${item.definition}`);
      });
      glossaryContainer.appendChild(card);
    });
  }

  // Filtrado del Glosario
  glossarySearch.addEventListener("input", (e) => {
    const val = e.target.value.toLowerCase().trim();
    const filtered = CONFIG.glossary.filter(item => 
      item.aymara.toLowerCase().includes(val) || 
      item.spanish.toLowerCase().includes(val) || 
      item.definition.toLowerCase().includes(val)
    );
    renderGlossary(filtered);
  });

  renderGlossary();

  // Enviar Mensaje
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const msg = chatInput.value.trim();
    if (!msg) return;
    
    addUserMessage(msg);
    chatInput.value = "";
    
    setTimeout(() => {
      getBotResponse(msg);
    }, 600);
  });

  // Chips Rápidos
  $$(".chip-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      addUserMessage(query);
      setTimeout(() => {
        getBotResponse(query);
      }, 500);
    });
  });

  function addUserMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message user";
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function addBotMessage(text) {
    const msgDiv = document.createElement("div");
    msgDiv.className = "message bot";
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Leer respuesta si la accesibilidad por voz está activa
    speakText(text);
  }

  // Simulación de Respuestas de Inteligencia Ambiental
  function getBotResponse(userMsg) {
    const msg = userMsg.toLowerCase();
    
    // Buscar en Glosario primero
    const glossaryMatch = CONFIG.glossary.find(item => 
      msg.includes(item.aymara.toLowerCase()) || 
      msg.includes(item.spanish.toLowerCase())
    );

    if (msg.includes("aymara") || msg.includes("glosario") || msg.includes("diccionario")) {
      addBotMessage("En el glosario aymara puedes aprender términos como Pachamama (Madre Tierra), Mink'a (faena comunitaria) y Ariri (guardián). Revisa las tarjetas al final de esta pestaña.");
    } 
    else if (glossaryMatch) {
      addBotMessage(`El término '${glossaryMatch.aymara}' significa '${glossaryMatch.spanish}'. Definición: ${glossaryMatch.definition}`);
    }
    else if (msg.includes("plastico") || msg.includes("botella") || msg.includes("degrad")) {
      addBotMessage("El plástico tarda unos 500 años en descomponerse en el altiplano. El sol fuerte de Puno lo fragmenta rápido en microplásticos dañinos para la totora y el ganado. ¡Evitemos tirarlo!");
    } 
    else if (msg.includes("titicaca") || msg.includes("lago") || msg.includes("contamina")) {
      addBotMessage("El lago Titicaca sufre por descarga de aguas servidas y plásticos que llegan por ríos de Huancané. Cuidar los bofedales altoandinos y clasificar la basura en el pueblo ayuda a mantener el agua limpia.");
    } 
    else if (msg.includes("recojo") || msg.includes("horario") || msg.includes("basura") || msg.includes("camion")) {
      addBotMessage("El recolector general pasa los días Lunes, Miércoles y Viernes a las 7:00 am por Jr. Huancané (Frente a la Municipalidad) y zonas céntricas de Rosaspata. Coloca tus residuos orgánicos en contenedores tapados.");
    } 
    else if (msg.includes("compost") || msg.includes("abono") || msg.includes("organico")) {
      addBotMessage("El compostaje se hace acumulando cáscaras, restos de quinua y estiércol de oveja/alpaca. Riega un poco, mantén tapado y voltéalo cada semana. ¡En 3 meses tendrás súper abono para tus cultivos!");
    } 
    else if (msg.includes("temporada") || msg.includes("clima") || msg.includes("lluvia") || msg.includes("quema")) {
      addBotMessage("Consejo de Temporada: En época de lluvias (diciembre a marzo), asegura tus zanjas de drenaje. En sequía, no realices quema de pastizales porque el viento fuerte altiplánico causa incendios incontrolables dañando bofedales.");
    }
    else if (msg.includes("hola") || msg.includes("buenos dias") || msg.includes("kamisaki")) {
      addBotMessage("¡Kamisaki! (Hola en aymara). ¿Cómo puedo ayudarte hoy con el cuidado ecológico de nuestro Ayllu?");
    }
    else {
      addBotMessage("Interesante pregunta. Para cuidar el medio ambiente en Rosaspata, te sugiero participar en las Mink'as de limpieza o reportar puntos de acumulación de residuos. ¿Tienes otra duda sobre el reciclaje?");
    }
  }

  // Configuración de Reconocimiento de Voz (Speech-to-Text)
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRecognition) {
    speechRecognition = new SpeechRecognition();
    speechRecognition.continuous = false;
    speechRecognition.lang = 'es-PE';
    speechRecognition.interimResults = false;

    speechRecognition.onstart = () => {
      chatMicBtn.classList.add("listening");
      chatInput.placeholder = "Escuchando... habla ahora";
      speakText("Te escucho");
    };

    speechRecognition.onerror = (e) => {
      console.error(e);
      chatMicBtn.classList.remove("listening");
      chatInput.placeholder = "Escribe un mensaje aquí...";
    };

    speechRecognition.onend = () => {
      chatMicBtn.classList.remove("listening");
      chatInput.placeholder = "Escribe un mensaje aquí...";
    };

    speechRecognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      chatInput.value = transcript;
      speakText(`Entendido: ${transcript}`);
      
      // Enviar de una vez
      addUserMessage(transcript);
      chatInput.value = "";
      setTimeout(() => {
        getBotResponse(transcript);
      }, 600);
    };

    chatMicBtn.addEventListener("click", () => {
      try {
        speechRecognition.start();
      } catch (err) {
        speechRecognition.stop();
      }
    });
  } else {
    chatMicBtn.style.display = "none"; // Navegador no lo soporta
  }
}

// --- REPORTES FOTO & GEOLOCALIZACIÓN NATIVA ---
let currentBase64Photo = null;
function initReporting() {
  const reportForm = $("report-form");
  const cameraBtn = $("camera-btn");
  const galleryBtn = $("gallery-btn");
  const fileInput = $("photo-file-input");
  const previewBox = $("photo-preview-box");
  const locationBtn = $("location-fetch-btn");
  const locationStatus = $("location-status-text");
  const inputLat = $("report-lat");
  const inputLng = $("report-lng");

  // Manejo de Fotos
  cameraBtn.addEventListener("click", () => {
    // Intentar abrir cámara
    fileInput.setAttribute("capture", "environment");
    fileInput.click();
  });

  galleryBtn.addEventListener("click", () => {
    fileInput.removeAttribute("capture");
    fileInput.click();
  });

  fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      currentBase64Photo = event.target.result;
      previewBox.innerHTML = `<img src="${currentBase64Photo}" alt="Previsualización de la incidencia" />`;
      speakText("Foto cargada con éxito.");
    };
    reader.readAsDataURL(file);
  });

  // Geolocalización Nativa
  locationBtn.addEventListener("click", () => {
    locationStatus.className = "location-status";
    locationStatus.textContent = "Buscando satélites...";
    speakText("Buscando tu ubicación mediante GPS nativo.");

    if (!navigator.geolocation) {
      locationStatus.textContent = "GPS no soportado";
      speakText("Error. Tu celular no soporta localización nativa.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        inputLat.value = lat;
        inputLng.value = lng;
        locationStatus.className = "location-status success";
        locationStatus.textContent = `📍 Localizado (${lat.toFixed(4)}, ${lng.toFixed(4)})`;
        speakText("Ubicación guardada con éxito.");
      },
      (error) => {
        console.error(error);
        // Fallback: usar coordenadas aproximadas de Rosaspata con variación aleatoria
        const randomVarLat = (Math.random() - 0.5) * 0.004;
        const randomVarLng = (Math.random() - 0.5) * 0.004;
        const fallbackLat = CONFIG.map.center[0] + randomVarLat;
        const fallbackLng = CONFIG.map.center[1] + randomVarLng;
        inputLat.value = fallbackLat;
        inputLng.value = fallbackLng;
        
        locationStatus.className = "location-status success";
        locationStatus.textContent = `📍 Simulado Rosaspata (${fallbackLat.toFixed(4)}, ${fallbackLng.toFixed(4)})`;
        speakText("No pudimos conectar al GPS nativo. Simulamos tu ubicación dentro de Rosaspata.");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  });

  // Formulario Submit
  reportForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    // Validar foto obligatoria
    if (!currentBase64Photo) {
      alert("Es obligatorio capturar o seleccionar una foto del residuo.");
      speakText("Por favor, sube una foto de la basura antes de enviar.");
      return;
    }

    // Validar coordenadas
    let lat = parseFloat(inputLat.value);
    let lng = parseFloat(inputLng.value);
    if (isNaN(lat) || isNaN(lng)) {
      // Auto localizador fallback
      lat = CONFIG.map.center[0] + (Math.random() - 0.5) * 0.004;
      lng = CONFIG.map.center[1] + (Math.random() - 0.5) * 0.004;
    }

    const category = $("report-category").value;
    const urgency = document.querySelector('input[name="urgency"]:checked').value;
    const description = $("report-description").value.trim();
    const dateStr = new Date().toISOString().split('T')[0];

    const newReport = {
      id: "rep_" + Date.now(),
      category,
      urgency,
      lat,
      lng,
      description,
      photo: currentBase64Photo,
      date: dateStr,
      status: "pendiente",
      afterPhoto: null
    };

    if (navigator.onLine) {
      // Enviar directamente
      state.reports.unshift(newReport);
      localStorage.setItem("ayllu_reports", JSON.stringify(state.reports));
      speakText("¡Éxito! Tu reporte ha sido publicado en el mapa interactivo y enviado al municipio.");
      alert("Reporte enviado con éxito. ¡Gracias por ser un Ariri!");
      
      // Incrementar Wiphalas por reportar
      addWiphalas(10);
      unlockBadge("first_report");
    } else {
      // Guardar en cola offline
      state.offlineQueue.push(newReport);
      localStorage.setItem("ayllu_offline_queue", JSON.stringify(state.offlineQueue));
      renderOfflineReports();
      speakText("Sin internet. Guardamos el reporte en la memoria de tu celular. Se enviará automáticamente cuando recuperes la conexión.");
      alert("Reporte guardado localmente (Fuera de línea). Se sincronizará automáticamente.");
    }

    // Resetear formulario
    reportForm.reset();
    currentBase64Photo = null;
    previewBox.innerHTML = `<span class="preview-placeholder">Sin foto seleccionada</span>`;
    locationStatus.className = "location-status";
    locationStatus.textContent = "No localizada";
    inputLat.value = "";
    inputLng.value = "";

    // Redirigir al Mapa
    switchScreen("mapa");
  });

  renderOfflineReports();
}

function renderOfflineReports() {
  const box = $("offline-reports-box");
  const list = $("offline-reports-list");
  
  if (state.offlineQueue.length === 0) {
    box.classList.add("hidden");
    return;
  }

  box.classList.remove("hidden");
  list.innerHTML = "";
  
  state.offlineQueue.forEach((rep, index) => {
    const item = document.createElement("div");
    item.className = "offline-item";
    item.innerHTML = `
      <div class="offline-item-info">
        <span class="offline-item-category">⚠️ ${rep.category}</span>
        <span class="offline-item-meta">Cola #${index + 1} | Urgencia: ${rep.urgency}</span>
      </div>
      <span style="font-size: 1.25rem;">⏳</span>
    `;
    list.appendChild(item);
  });
}

// Sincronización Automática Offline
function syncOfflineQueue() {
  if (state.offlineQueue.length === 0) return;

  speakText("Sincronizando reportes pendientes guardados fuera de línea.");
  
  // Agregar todos a la lista principal
  state.reports = [...state.offlineQueue, ...state.reports];
  localStorage.setItem("ayllu_reports", JSON.stringify(state.reports));
  
  // Dar puntos Wiphalas por reportes offline sincronizados
  addWiphalas(10 * state.offlineQueue.length);
  unlockBadge("first_report");

  // Vaciar cola
  state.offlineQueue = [];
  localStorage.setItem("ayllu_offline_queue", JSON.stringify(state.offlineQueue));
  
  renderOfflineReports();
  alert("Sincronización completada. Tus reportes guardados sin conexión han sido enviados con éxito.");
  
  // Actualizar mapa y selects
  if (state.activeScreen === "mapa") {
    initMap();
  }
}

// --- MAPA INTERACTIVO LEAFLET ---
let leafletMap = null;
let markerLayer = null;
let heatLayer = null; // Capa de calor simulada
let activeFilter = "all"; // 'all', 'eco', 'reports'
let isHeatmapActive = false;

function initMap() {
  // Evitar duplicados
  if (leafletMap) {
    leafletMap.invalidateSize();
    populateAdminReportSelect();
    return;
  }

  // Crear el mapa Leaflet
  leafletMap = L.map("map").setView(CONFIG.map.center, CONFIG.map.zoom);
  
  // Capa base de OpenStreetMap (con caché de PWA)
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: CONFIG.map.maxZoom,
    minZoom: CONFIG.map.minZoom,
    attribution: '&copy; OpenStreetMap'
  }).addTo(leafletMap);

  markerLayer = L.layerGroup().addTo(leafletMap);
  heatLayer = L.layerGroup().addTo(leafletMap);

  // Inicializar controles de filtro
  $("btn-filter-all").addEventListener("click", () => setMapFilter("all"));
  $("btn-filter-eco").addEventListener("click", () => setMapFilter("eco"));
  $("btn-filter-reports").addEventListener("click", () => setMapFilter("reports"));
  
  // Botón de mapa de calor
  $("btn-toggle-heat").addEventListener("click", () => {
    isHeatmapActive = !isHeatmapActive;
    $("btn-toggle-heat").classList.toggle("active", isHeatmapActive);
    renderMapData();
    speakText(isHeatmapActive ? "Capa de mapa de calor activada." : "Mapa de calor desactivado.");
  });

  // Admin controls hooks
  $("admin-report-select").addEventListener("change", handleAdminSelectChange);
  $("admin-status-attending").addEventListener("click", () => updateReportStatus("atencion"));
  $("admin-status-resolve").addEventListener("click", () => {
    // Revelar selector de foto antes de finalizar
    $("admin-resolve-photo-box").classList.remove("hidden");
    speakText("Por favor, selecciona una foto de la zona limpia antes de confirmar.");
  });
  $("admin-after-file").addEventListener("change", handleAdminAfterPhotoUpload);

  renderMapData();
  populateAdminReportSelect();
}

function setMapFilter(filterType) {
  activeFilter = filterType;
  $$(".filter-btn").forEach(btn => {
    if (btn.id !== "btn-toggle-heat") btn.classList.remove("active");
  });
  $(`btn-filter-${filterType}`).classList.add("active");
  renderMapData();
  speakText(`Mostrando ${filterType === 'all' ? 'todos los puntos' : filterType === 'eco' ? 'sólo ecopuntos de reciclaje' : 'sólo reportes ciudadanos'}`);
}

function renderMapData() {
  if (!leafletMap) return;
  markerLayer.clearLayers();
  heatLayer.clearLayers();

  // 1. Renderizar Ecopuntos y Puntos de Recojo
  if (activeFilter === "all" || activeFilter === "eco") {
    CONFIG.map.ecoPoints.forEach(pt => {
      // Icono personalizado según el tipo
      const iconHtml = pt.type === "reciclaje" 
        ? `<div style="background-color: var(--green-primary); color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: grid; place-items: center; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">♻️</div>`
        : `<div style="background-color: var(--turquoise); color: white; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; display: grid; place-items: center; font-size: 14px; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">🚛</div>`;
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon",
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([pt.lat, pt.lng], { icon: customIcon });
      
      const popupContent = `
        <div class="map-popup-content">
          <div class="map-popup-title">${pt.name}</div>
          <p style="font-size: 11px; margin: 0;">${pt.description}</p>
          <div class="map-popup-info">📍 ${pt.address}</div>
          <span class="map-popup-badge resuelto" style="text-align:center;">${pt.type.toUpperCase()}</span>
        </div>
      `;
      marker.bindPopup(popupContent);
      markerLayer.addLayer(marker);
    });
  }

  // 2. Renderizar Reportes
  if (activeFilter === "all" || activeFilter === "reports") {
    state.reports.forEach(rep => {
      // Color según urgencia
      const color = rep.urgency === "Alto" ? "#ef4444" : rep.urgency === "Medio" ? "#f59e0b" : "#10b981";
      // Icono según estado
      const stateChar = rep.status === "resuelto" ? "✔️" : rep.status === "atencion" ? "🟡" : "🚨";
      
      const iconHtml = `
        <div style="background-color: ${color}; color: white; width: 30px; height: 30px; border-radius: 50%; border: 2.5px solid white; display: grid; place-items: center; font-size: 12px; font-weight: bold; box-shadow: 0 3px 6px rgba(0,0,0,0.4);">
          ${stateChar}
        </div>
      `;
      
      const customIcon = L.divIcon({
        html: iconHtml,
        className: "custom-leaflet-icon",
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });

      const marker = L.marker([rep.lat, rep.lng], { icon: customIcon });
      
      // Popup con imagen y opción de ver comparativa
      let popupContent = `
        <div class="map-popup-content">
          <div class="map-popup-title">${rep.category}</div>
          <img class="map-popup-img" src="${rep.photo}" alt="Evidencia" />
          <p style="font-size: 11px; margin: 0; font-style: italic;">"${rep.description || 'Sin descripción'}"</p>
          <div class="map-popup-info">Fecha: ${rep.date}</div>
          <div>
            <span class="map-popup-badge ${rep.status === 'resuelto' ? 'resuelto' : rep.status === 'atencion' ? 'atencion' : 'pendiente'}">
              ${rep.status.toUpperCase()}
            </span>
          </div>
      `;

      if (rep.status === "resuelto") {
        popupContent += `
          <button class="map-popup-action" onclick="showBeforeAfterComparison('${rep.id}')">Ver Antes y Después 🔄</button>
        `;
      }
      
      popupContent += `</div>`;
      
      marker.bindPopup(popupContent);
      markerLayer.addLayer(marker);

      // Agregar círculos de calor si está activo
      if (isHeatmapActive) {
        const radius = rep.urgency === "Alto" ? 60 : rep.urgency === "Medio" ? 45 : 30;
        const heatCircle = L.circle([rep.lat, rep.lng], {
          radius: radius,
          fillColor: "#ef4444",
          fillOpacity: 0.35,
          color: "none"
        });
        heatLayer.addLayer(heatCircle);
      }
    });
  }
}

// Global visualizer trigger for before and after
window.showBeforeAfterComparison = function(reportId) {
  const rep = state.reports.find(r => r.id === reportId);
  if (!rep || !rep.afterPhoto) return;

  const compareContainer = $("before-after-container");
  $("before-after-title").textContent = `${rep.category} - Resuelto en fecha ${rep.date}`;
  $("img-before").src = rep.photo;
  $("img-after").src = rep.afterPhoto;
  
  compareContainer.classList.remove("hidden");
  compareContainer.scrollIntoView({ behavior: 'smooth' });
  speakText(`Mostrando imágenes comparativas del caso resuelto. A la izquierda se observa el estado de contaminación original, y a la derecha, la zona completamente limpia.`);

  $("btn-close-comparison").onclick = () => {
    compareContainer.classList.add("hidden");
  };
};

// --- PANEL ADMINISTRATIVO SIMULADO ---
function populateAdminReportSelect() {
  const select = $("admin-report-select");
  select.innerHTML = '<option value="" disabled selected>Selecciona un caso...</option>';
  
  // Mostrar reportes no resueltos
  const activeCases = state.reports.filter(r => r.status !== "resuelto");
  
  if (activeCases.length === 0) {
    select.innerHTML = '<option value="" disabled>No hay reportes pendientes</option>';
    $("admin-status-attending").disabled = true;
    $("admin-status-resolve").disabled = true;
    return;
  }

  activeCases.forEach(rep => {
    const opt = document.createElement("option");
    opt.value = rep.id;
    opt.textContent = `[${rep.status.toUpperCase()}] ${rep.category} (${rep.date})`;
    select.appendChild(opt);
  });
}

function handleAdminSelectChange() {
  const select = $("admin-report-select");
  const reportId = select.value;
  const rep = state.reports.find(r => r.id === reportId);
  
  if (!rep) return;

  $("admin-status-attending").disabled = rep.status === "atencion";
  $("admin-status-resolve").disabled = false;
  
  // Ocultar subida de foto anterior
  $("admin-resolve-photo-box").classList.add("hidden");
}

function updateReportStatus(newStatus, afterPhotoBase64 = null) {
  const reportId = $("admin-report-select").value;
  const index = state.reports.findIndex(r => r.id === reportId);
  
  if (index === -1) return;

  state.reports[index].status = newStatus;
  
  if (afterPhotoBase64) {
    state.reports[index].afterPhoto = afterPhotoBase64;
  }

  localStorage.setItem("ayllu_reports", JSON.stringify(state.reports));
  
  alert(`Caso actualizado con éxito a: ${newStatus.toUpperCase()}`);
  speakText(`El reporte ha sido marcado como ${newStatus === 'atencion' ? 'en atención' : 'resuelto y limpiado'}.`);

  // Premiar con Wiphalas Verdes por resolver problemas ambientales en la comunidad
  if (newStatus === "resuelto") {
    addWiphalas(25);
  }

  // Resetear panel administrativo
  $("admin-resolve-photo-box").classList.add("hidden");
  $("admin-after-file").value = "";
  populateAdminReportSelect();
  renderMapData();
  updateLogrosUI();
}

function handleAdminAfterPhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const afterPhotoBase64 = event.target.result;
    updateReportStatus("resuelto", afterPhotoBase64);
  };
  reader.readAsDataURL(file);
}

// --- MINIJUEGOS EDUCATIVOS ---

// 1. Juego Clasifica Basura
function initClasificaGame() {
  const startBtn = $("game-start-btn");
  const timeDisplay = $("game-time");
  const scoreDisplay = $("game-score");
  const itemBox = $("game-item-box");
  const bins = $$(".bin-btn");

  startBtn.addEventListener("click", () => {
    if (state.game.isPlaying) return;
    startGame();
  });

  bins.forEach(bin => {
    bin.addEventListener("click", () => {
      if (!state.game.isPlaying) return;
      const selectedBin = bin.getAttribute("data-bin");
      checkAnswer(selectedBin);
    });
  });

  function startGame() {
    state.game.isPlaying = true;
    state.game.score = 0;
    state.game.timeLeft = 30;
    scoreDisplay.textContent = "0";
    timeDisplay.textContent = "30s";
    startBtn.style.display = "none";
    speakText("Clasifica los residuos lo más rápido posible.");

    // Siguiente residuo
    nextItem();

    // Intervalo de Tiempo
    state.game.timerInterval = setInterval(() => {
      state.game.timeLeft--;
      timeDisplay.textContent = state.game.timeLeft + "s";
      
      if (state.game.timeLeft <= 0) {
        endGame();
      }
    }, 1000);
  }

  function nextItem() {
    const rand = Math.floor(Math.random() * GAME_ITEMS.length);
    state.game.currentItem = GAME_ITEMS[rand];
    
    $("game-item-icon").textContent = state.game.currentItem.icon;
    $("game-item-name").textContent = state.game.currentItem.name;
    
    // Quitar clases previas de acierto/fallo
    itemBox.className = "game-item-display";

    // Leer residuo
    speakText(state.game.currentItem.name);
  }

  function checkAnswer(selectedBin) {
    const correctBin = state.game.currentItem.type;
    
    if (selectedBin === correctBin) {
      state.game.score++;
      scoreDisplay.textContent = state.game.score;
      itemBox.classList.add("game-correct");
      speakText("Correcto");
      
      // Sonido corto simulado por vibración
      if (navigator.vibrate) navigator.vibrate(50);
    } else {
      itemBox.classList.add("game-wrong");
      speakText("Incorrecto");
      if (navigator.vibrate) navigator.vibrate(200);
    }

    setTimeout(nextItem, 500);
  }

  function endGame() {
    clearInterval(state.game.timerInterval);
    state.game.isPlaying = false;
    startBtn.style.display = "block";
    startBtn.textContent = "Jugar otra vez";
    
    $("game-item-icon").textContent = "⏱️";
    $("game-item-name").textContent = "Juego terminado";
    
    speakText(`Tiempo agotado. Conseguiste un puntaje de ${state.game.score} puntos.`);
    alert(`Fin del juego. Puntuación final: ${state.game.score}`);
    
    // Gamificación
    if (state.game.score >= 10) {
      unlockBadge("game_master");
    }
    
    // Sumar Wiphalas ganadas
    addWiphalas(state.game.score * 2);
  }
}

// 2. Juego Quiz Ambiental
function initQuiz() {
  const progress = $("quiz-progress-text");
  const questionText = $("quiz-question-text");
  const optionsBox = $("quiz-options-box");
  const explanationBox = $("quiz-explanation-box");
  const nextBtn = $("quiz-next-btn");
  const resultBox = $("quiz-result-box");
  const restartBtn = $("quiz-restart-btn");
  const quizContainer = $("quiz-game-container");

  function startQuiz() {
    state.quiz.currentQuestion = 0;
    state.quiz.score = 0;
    state.quiz.answers = [];
    
    quizContainer.classList.remove("hidden");
    resultBox.classList.add("hidden");
    nextBtn.classList.add("hidden");
    explanationBox.classList.add("hidden");

    loadQuestion();
  }

  function loadQuestion() {
    const qData = CONFIG.quizQuestions[state.quiz.currentQuestion];
    progress.textContent = `Pregunta ${state.quiz.currentQuestion + 1} de ${CONFIG.quizQuestions.length}`;
    questionText.textContent = qData.question;
    optionsBox.innerHTML = "";
    explanationBox.classList.add("hidden");
    nextBtn.classList.add("hidden");

    // Leer pregunta
    speakText(qData.question);

    qData.options.forEach((opt, index) => {
      const btn = document.createElement("button");
      btn.className = "quiz-opt-btn";
      btn.innerHTML = `<strong>${String.fromCharCode(65 + index)})</strong> ${opt}`;
      
      btn.addEventListener("click", () => {
        // Bloquear opciones una vez respondido
        const answered = optionsBox.querySelector(".correct") || optionsBox.querySelector(".wrong");
        if (answered) return;
        
        selectOption(index, btn);
      });
      optionsBox.appendChild(btn);
    });
  }

  function selectOption(index, btn) {
    const qData = CONFIG.quizQuestions[state.quiz.currentQuestion];
    const isCorrect = index === qData.answer;
    
    if (isCorrect) {
      btn.classList.add("correct");
      state.quiz.score++;
      speakText("Correcto. " + qData.explanation);
    } else {
      btn.classList.add("wrong");
      // Mostrar la correcta
      const correctBtn = optionsBox.children[qData.answer];
      correctBtn.classList.add("correct");
      speakText("Incorrecto. " + qData.explanation);
    }

    explanationBox.textContent = qData.explanation;
    explanationBox.classList.remove("hidden");
    nextBtn.classList.remove("hidden");
  }

  nextBtn.addEventListener("click", () => {
    state.quiz.currentQuestion++;
    if (state.quiz.currentQuestion < CONFIG.quizQuestions.length) {
      loadQuestion();
    } else {
      showQuizResults();
    }
  });

  function showQuizResults() {
    quizContainer.classList.add("hidden");
    resultBox.classList.remove("hidden");
    
    const percentage = Math.round((state.quiz.score / CONFIG.quizQuestions.length) * 100);
    $("quiz-score-text").textContent = `Obtuviste ${state.quiz.score} de ${CONFIG.quizQuestions.length} respuestas correctas (${percentage}%).`;
    
    speakText(`Cuestionario completado. Respondiste correctamente ${state.quiz.score} preguntas.`);

    if (state.quiz.score === CONFIG.quizQuestions.length) {
      unlockBadge("quiz_perfect");
    }

    // Sumar wiphalas
    addWiphalas(state.quiz.score * 5);
  }

  restartBtn.addEventListener("click", startQuiz);

  // Inicializar al cargar pestaña
  startQuiz();
}

function initAprendeTabs() {
  const btnGuides = $("tab-btn-guides");
  const btnGame1 = $("tab-btn-game1");
  const btnGame2 = $("tab-btn-game2");
  
  const contentGuides = $("aprende-content-guides");
  const contentGame1 = $("aprende-content-game1");
  const contentGame2 = $("aprende-content-game2");

  function hideAll() {
    contentGuides.classList.add("hidden");
    contentGame1.classList.add("hidden");
    contentGame2.classList.add("hidden");
    
    btnGuides.classList.remove("active");
    btnGame1.classList.remove("active");
    btnGame2.classList.remove("active");
    
    // Parar intervalos de juego si cambias de pestaña
    if (state.game.timerInterval) {
      clearInterval(state.game.timerInterval);
      state.game.isPlaying = false;
      $("game-start-btn").style.display = "block";
    }
  }

  btnGuides.addEventListener("click", () => {
    hideAll();
    contentGuides.classList.remove("hidden");
    btnGuides.classList.add("active");
    renderGuides();
  });

  btnGame1.addEventListener("click", () => {
    hideAll();
    contentGame1.classList.remove("hidden");
    btnGame1.classList.add("active");
  });

  btnGame2.addEventListener("click", () => {
    hideAll();
    contentGame2.classList.remove("hidden");
    btnGame2.classList.add("active");
    initQuiz();
  });
}

function renderGuides() {
  const container = $("guides-container");
  container.innerHTML = "";

  CONFIG.tutorials.forEach(t => {
    const card = document.createElement("article");
    card.className = "guide-card";
    
    let stepsHtml = "";
    t.steps.forEach(step => {
      stepsHtml += `<li class="guide-step-item">${step}</li>`;
    });

    card.innerHTML = `
      <h3>${t.title}</h3>
      <div class="guide-meta">
        <span>⏱️ Duración: ${t.duration}</span>
        <span>🏷️ Tipo: ${t.type}</span>
      </div>
      <p class="guide-summary">${t.summary}</p>
      <ul class="guide-steps">
        ${stepsHtml}
      </ul>
    `;
    container.appendChild(card);
  });
}

// --- COMUNIDAD Y MINK'AS ---
function initComunidad() {
  const minkasList = $("minkas-list-container");
  const createForm = $("create-minka-form");
  const openFormBtn = $("btn-open-create-minka");
  const cancelFormBtn = $("btn-cancel-minka");

  // Obtener de localStorage o usar por defecto
  state.minkas = JSON.parse(localStorage.getItem("ayllu_minkas")) || CONFIG.defaultMinkas;
  localStorage.setItem("ayllu_minkas", JSON.stringify(state.minkas));

  function renderMinkas() {
    minkasList.innerHTML = "";
    state.minkas.forEach(minka => {
      const card = document.createElement("div");
      card.className = "minka-item-card";
      
      const isJoined = minka.joined;
      const btnText = isJoined ? "¡Inscrito! ✔️" : "Voy a participar 🤝";
      
      card.innerHTML = `
        <h4>${minka.title}</h4>
        <p>${minka.description}</p>
        <div class="minka-meta-grid">
          <span class="minka-meta-item">📅 ${minka.date}</span>
          <span class="minka-meta-item">⏰ HORA: ${minka.time}</span>
          <span class="minka-meta-item">📍 LUGAR: ${minka.location}</span>
          <span class="minka-meta-item">👤 CONVOCA: ${minka.creator}</span>
        </div>
        <div class="minka-footer">
          <span class="minka-participants-badge">${minka.participants} participantes inscritos</span>
          <button class="minka-join-btn ${isJoined ? 'joined' : ''}" data-id="${minka.id}">
            ${btnText}
          </button>
        </div>
      `;

      card.querySelector(".minka-join-btn").addEventListener("click", () => {
        toggleMinkaParticipation(minka.id);
      });

      minkasList.appendChild(card);
    });
  }

  function toggleMinkaParticipation(minkaId) {
    const idx = state.minkas.findIndex(m => m.id === minkaId);
    if (idx === -1) return;

    const m = state.minkas[idx];
    if (m.joined) {
      m.joined = false;
      m.participants--;
      speakText("Has cancelado tu participación en la faena.");
    } else {
      m.joined = true;
      m.participants++;
      speakText("Inscripción exitosa. ¡Gracias por colaborar bajo el principio andino de la Mink'a!");
      addWiphalas(15);
      unlockBadge("minka_helper");
    }

    localStorage.setItem("ayllu_minkas", JSON.stringify(state.minkas));
    renderMinkas();
    updateLogrosUI();
  }

  // Apertura de Formulario
  openFormBtn.addEventListener("click", () => {
    createForm.classList.remove("hidden");
    openFormBtn.classList.add("hidden");
  });

  cancelFormBtn.addEventListener("click", () => {
    createForm.classList.add("hidden");
    openFormBtn.classList.remove("hidden");
    createForm.reset();
  });

  // Envío de Nueva Faena
  createForm.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const title = $("minka-title").value.trim();
    const description = $("minka-desc").value.trim();
    const date = $("minka-date").value;
    const time = $("minka-time").value;
    const location = $("minka-loc").value.trim();

    const newMinka = {
      id: "minka_" + Date.now(),
      title,
      description,
      date,
      time,
      location,
      creator: "Vecino / Estudiante",
      participants: 1,
      joined: true
    };

    state.minkas.unshift(newMinka);
    localStorage.setItem("ayllu_minkas", JSON.stringify(state.minkas));
    
    renderMinkas();
    createForm.reset();
    createForm.classList.add("hidden");
    openFormBtn.classList.remove("hidden");

    speakText("Faena comunitaria convocada con éxito. Te hemos inscrito automáticamente.");
    addWiphalas(20);
    unlockBadge("minka_helper");
    updateLogrosUI();
  });

  renderMinkas();
}

// --- GAMIFICACIÓN: INSIGNIAS Y WIPHALAS ---
function addWiphalas(amount) {
  state.user.wiphalas += amount;
  localStorage.setItem("ayllu_user", JSON.stringify(state.user));
  updateBadgesUI();
}

function unlockBadge(badgeId) {
  if (state.user.unlockedBadges.includes(badgeId)) return;

  state.user.unlockedBadges.push(badgeId);
  localStorage.setItem("ayllu_user", JSON.stringify(state.user));
  
  // Mostrar notificación animada
  const badgeNames = {
    first_report: "🛡️ Primer Guardián",
    game_master: "⏱️ Clasificador Veloz",
    quiz_perfect: "🎓 Sabio del Altiplano",
    minka_helper: "🤝 Colaborador Ayni"
  };

  speakText(`¡Felicitaciones! Has ganado la wiphala verde: ${badgeNames[badgeId]}`);
  alert(`🌟 ¡Insignia ganada! 🌟\nHas desbloqueado: ${badgeNames[badgeId]}`);
  
  updateBadgesUI();
}

function updateBadgesUI() {
  $("user-wiphalas").textContent = state.user.wiphalas;
  $("stat-wiphalas-totales").textContent = state.user.wiphalas;
  
  state.user.unlockedBadges.forEach(badgeId => {
    const badgeElement = $("badge-" + badgeId.replace("_", "-"));
    if (badgeElement) {
      badgeElement.classList.remove("locked");
    }
  });
}

function updateLogrosUI() {
  // Cantidad de reportes resueltos
  const resolvedCount = state.reports.filter(r => r.status === "resuelto").length;
  $("stat-reportes-resueltos").textContent = resolvedCount;

  // Peso de basura recogida (calculado ficticiamente a razón de 15kg por reporte resuelto)
  const baseWeight = 80; // Inicial fijo
  const totalWeight = baseWeight + (resolvedCount * 15);
  $("stat-total-basura").textContent = totalWeight + " kg";

  // Faenas realizadas
  const minkaCount = state.minkas.length;
  $("stat-faenas-comunidad").textContent = minkaCount;
}

// --- VISOR / APLICADOR DE CONFIGURACIÓN ---
function initConfigEditor() {
  const commInput = $("edit-config-community");
  const schoolInput = $("edit-config-school");
  const applyBtn = $("btn-apply-config");

  // Mostrar valores actuales
  commInput.value = CONFIG.community.name;
  schoolInput.value = CONFIG.community.school;

  applyBtn.addEventListener("click", () => {
    const newCommName = commInput.value.trim();
    const newSchoolName = schoolInput.value.trim();

    if (!newCommName || !newSchoolName) return;

    // Actualizar configuración en vivo
    CONFIG.community.name = newCommName;
    CONFIG.community.school = newSchoolName;
    CONFIG.community.appName = `Guardianes de la Comunidad — Ayllu Ariri ${newCommName}`;

    // Actualizar UI
    $("app-title").textContent = `Ayllu Ariri ${newCommName}`;
    $("school-badge").textContent = `${newSchoolName} - 4to A`;
    
    // Cambiar centro del mapa levemente si cambia de comunidad (solo para demostración)
    if (newCommName.toLowerCase() !== "rosaspata" && leafletMap) {
      // Coordenadas ficticias de una comunidad vecina
      const neighborCenter = [-15.2750, -69.5180]; 
      leafletMap.setView(neighborCenter, CONFIG.map.zoom);
    }

    speakText("Configuración actualizada. La interfaz y el mapa han sido adaptados en vivo para la nueva comunidad.");
    alert("¡Configuración aplicada en vivo con éxito!");
  });
}

// --- EXPORTACIÓN DE MÉTRICAS ---
function initDataExport() {
  $("btn-export-excel").addEventListener("click", exportReportsToCSV);
  $("btn-export-pdf").addEventListener("click", () => {
    speakText("Preparando la vista para impresión en PDF. Pulsa aceptar en el diálogo del sistema.");
    window.print();
  });
}

function exportReportsToCSV() {
  speakText("Generando hoja de cálculo CSV con las métricas ambientales de Rosaspata.");

  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Cabecera
  csvContent += "ID,Fecha,Categoria,Urgencia,Latitud,Longitud,Estado,Descripcion\n";
  
  // Filas
  state.reports.forEach(r => {
    // Sanitizar descripción para evitar roturas por comas
    const desc = (r.description || "").replace(/,/g, ";").replace(/\n/g, " ");
    csvContent += `"${r.id}","${r.date}","${r.category}","${r.urgency}",${r.lat},${r.lng},"${r.status}","${desc}"\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `metricas_ambientales_ayllu_ariri_${CONFIG.community.name.toLowerCase()}.csv`);
  document.body.appendChild(link);
  
  link.click();
  document.body.removeChild(link);
}

// --- PERSISTENCIA LOCAL DE USUARIO ---
function saveLocalState() {
  localStorage.setItem("ayllu_user_accessibility", JSON.stringify(state.accessibility));
}

function loadAccessibilitySettings() {
  const saved = JSON.parse(localStorage.getItem("ayllu_user_accessibility"));
  if (saved) {
    state.accessibility = saved;
  }
}

// --- INICIALIZACIÓN GENERAL ---
document.addEventListener("DOMContentLoaded", () => {
  loadAccessibilitySettings();
  initNavigation();
  initAccessibility();
  initConnectionMonitor();
  initChatbot();
  initReporting();
  initComunidad();
  initAprendeTabs();
  renderGuides();
  initConfigEditor();
  initDataExport();
  
  // Cargar estado inicial de gamificación y logros
  updateBadgesUI();
  updateLogrosUI();
  
  // Iniciar juego clasificador
  initClasificaGame();
  
  // Registrar Service Worker
  if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker Registrado con éxito.", reg.scope))
      .catch(err => console.warn("Error al registrar Service Worker.", err));
  }
});
