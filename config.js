// Archivo de Configuración Modular para Replicabilidad - Ayllu Ariri
// Permite adaptar la aplicación a cualquier comunidad sin modificar el código fuente.

const CONFIG = {
  // Datos de Identidad
  community: {
    name: "Rosaspata",
    district: "Rosaspata",
    province: "Huancané",
    region: "Puno",
    country: "Perú",
    school: "I.E. Rosaspata",
    gradeSection: "4to Año Sección A",
    contest: "Concurso de Crédito 2026",
    appName: "Guardianes de la Comunidad — Ayllu Ariri"
  },

  // Configuración del Mapa
  map: {
    // Coordenadas iniciales (Centro de Rosaspata, Puno)
    center: [-15.2644, -69.5312],
    zoom: 15,
    maxZoom: 19,
    minZoom: 12,
    
    // Ecopuntos y Puntos de Recojo preestablecidos
    ecoPoints: [
      {
        id: "eco_plaza",
        name: "Ecopunto Plaza de Armas de Rosaspata",
        description: "Contenedores diferenciados para plásticos, vidrios y residuos orgánicos.",
        type: "reciclaje", // 'reciclaje' o 'recojo'
        lat: -15.2639,
        lng: -69.5310,
        address: "Esquina Noroeste de la Plaza de Armas"
      },
      {
        id: "eco_colegio",
        name: "Ecopunto I.E. Rosaspata",
        description: "Punto de recolección escolar de botellas plásticas y compostera piloto.",
        type: "reciclaje",
        lat: -15.2652,
        lng: -69.5325,
        address: "Ingreso principal de la I.E. Rosaspata"
      },
      {
        id: "recojo_municipalidad",
        name: "Punto de Acopio Central",
        description: "Contenedor general del camión recolector municipal.",
        type: "recojo",
        lat: -15.2642,
        lng: -69.5298,
        address: "Jr. Huancané (Frente a la Municipalidad)"
      },
      {
        id: "eco_bofedal_camino",
        name: "Punto Ecológico Entrada de Bofedal",
        description: "Protección de humedales altoandinos. Contenedor de plástico y latas.",
        type: "reciclaje",
        lat: -15.2605,
        lng: -69.5350,
        address: "Camino rural al bofedal norte"
      }
    ]
  },

  // Glosario Ambiental Bilingüe (Aymara - Castellano)
  glossary: [
    { aymara: "Ayllu", spanish: "Comunidad", definition: "Unidad social y familiar andina basada en la ayuda mutua y el trabajo colectivo." },
    { aymara: "Ariri", spanish: "Guardián / Protector", definition: "Persona encargada de velar por la seguridad y conservación del entorno." },
    { aymara: "Mink'a (Minca)", spanish: "Trabajo Comunitario", definition: "Tradición precolombina de trabajo colectivo voluntario con fines de utilidad social." },
    { aymara: "Ayni", spanish: "Reciprocidad", definition: "Sistema de ayuda mutua familiar basada en el principio: 'Hoy por ti, mañana por mí'." },
    { aymara: "Pachamama", spanish: "Madre Tierra", definition: "Deidad andina que representa la naturaleza, la fertilidad, el sustento y la vida." },
    { aymara: "Quta", spanish: "Lago", definition: "Cuerpo de agua, vital en la cosmología andina (ej. Titicaca Quta)." },
    { aymara: "Jawira", spanish: "Río", definition: "Corriente natural de agua. Rosaspata cuenta con ríos que alimentan el lago." },
    { aymara: "Jari", spanish: "Agua limpia", definition: "Agua apta para el consumo y la vida, libre de contaminación." },
    { aymara: "Wiphala", spanish: "Bandera andina", definition: "Símbolo cuadrangular de siete colores que representa la armonía, la igualdad y la unidad andina." },
    { aymara: "Uma", spanish: "Agua", definition: "Elemento sagrado y recurso fundamental para la agricultura y ganadería altiplánica." },
    { aymara: "Q'ara", spanish: "Basura / Desecho", definition: "Residuos sólidos generados por actividades humanas que ensucian el entorno." },
    { aymara: "Llaqta", spanish: "Pueblo / Territorio", definition: "Espacio geográfico y social habitado por la comunidad." }
  ],

  // Preguntas del Quiz Ambiental
  quizQuestions: [
    {
      question: "¿Cuál es el principal objetivo del proyecto 'Guardianes de la Comunidad — Ayllu Ariri'?",
      options: [
        "Jugar minijuegos escolares",
        "Promover el cuidado ambiental de Rosaspata mediante reportes ciudadanos y participación",
        "Vender artesanías de totora",
        "Ganar un concurso de oratoria"
      ],
      answer: 1,
      explanation: "El proyecto busca empoderar a la comunidad escolar y vecinal para reportar basura y participar en faenas de limpieza."
    },
    {
      question: "¿Qué significa la palabra aymara 'Ariri'?",
      options: [
        "Río caudaloso",
        "Guardián o protector",
        "Tierra fértil",
        "Cielo despejado"
      ],
      answer: 1,
      explanation: "'Ariri' significa guardián o protector en aymara, haciendo alusión a nuestro rol de cuidar el medio ambiente."
    },
    {
      question: "¿Cuánto tiempo tarda aproximadamente en degradarse una botella de plástico tirada en el campo o el lago?",
      options: [
        "Entre 5 y 10 años",
        "Aproximadamente 50 años",
        "Alrededor de 450 a 500 años",
        "Nunca se degrada"
      ],
      answer: 2,
      explanation: "El plástico tarda cerca de 500 años en descomponerse y se fragmenta en microplásticos dañinos para peces y ganado."
    },
    {
      question: "¿Qué es una 'Mink'a' (Minca) en el contexto de nuestra comunidad?",
      options: [
        "Un tipo de danza típica de Huancané",
        "Faena o trabajo comunitario voluntario para beneficio de todos",
        "Una comida tradicional a base de quinua",
        "El nombre del camión recolector de basura"
      ],
      answer: 1,
      explanation: "La Mink'a es el trabajo colectivo andino que une a la comunidad para limpiar ríos, plazas o sembrar campos."
    },
    {
      question: "¿Por qué los bofedales (humedales altoandinos) son tan importantes para Huancané?",
      options: [
        "Porque regulan el agua y sirven de pasto húmedo para alpacas y ganado todo el año",
        "Porque contienen minerales preciosos para la minería",
        "Porque no sirven para la agricultura",
        "Porque son atractivos turísticos de cemento"
      ],
      answer: 0,
      explanation: "Los bofedales actúan como esponjas naturales de agua dulce en el altiplano, esenciales frente a sequías y heladas."
    }
  ],

  // Faenas Comunitarias (Mink'as/Ayni) por Defecto
  defaultMinkas: [
    {
      id: "minka_1",
      title: "Limpieza del río local y bofedal Rosaspata",
      description: "Recojo de plásticos, latas y residuos acumulados en los márgenes del río de Rosaspata para evitar que desemboquen en el lago Titicaca.",
      date: "2026-07-12",
      time: "08:30",
      location: "Puente peatonal de entrada a Rosaspata",
      creator: "Estudiantes 4to A (I.E. Rosaspata)",
      participants: 12,
      joined: false
    },
    {
      id: "minka_2",
      title: "Faena comunitaria de clasificación en Plaza de Armas",
      description: "Instalación de letreros educativos y pintado de contenedores de basura para separar residuos en orgánico, botellas plásticas y papel.",
      date: "2026-07-18",
      time: "09:00",
      location: "Plaza de Armas de Rosaspata",
      creator: "Municipio Escolar",
      participants: 8,
      joined: false
    },
    {
      id: "minka_3",
      title: "Compostaje escolar en el huerto de la I.E. Rosaspata",
      description: "Taller práctico de preparación de abono orgánico con cáscaras de verduras y rastrojos del colegio.",
      date: "2026-07-25",
      time: "10:30",
      location: "Biohuerto de la I.E. Rosaspata",
      creator: "Profesor Juan (Asesor)",
      participants: 15,
      joined: false
    }
  ],

  // Tutoriales y Recursos
  tutorials: [
    {
      title: "El Secreto del Compost Casero",
      type: "Lectura rápida",
      duration: "3 min",
      summary: "Transforma los restos de papa, quinua, verduras y estiércol en abono fértil para el altiplano.",
      steps: [
        "Usa un contenedor con ventilación o cava un hoyo en tu huerto.",
        "Coloca una capa de paja seca o aserrín abajo.",
        "Agrega los restos orgánicos (sin carnes ni grasas).",
        "Cubre con un poco de tierra húmeda y voltea una vez por semana.",
        "En 3 a 5 meses tendrás tierra negra con olor a bosque, ideal para tus cultivos."
      ]
    },
    {
      title: "Clasificación de Residuos en el Altiplano",
      type: "Educativo",
      duration: "2 min",
      summary: "Guía práctica para separar y evitar que el viento disperse el plástico hacia las pasturas.",
      steps: [
        "Verde (Orgánicos): Cáscaras de verduras, frutas y estiércol.",
        "Blanco o Azul (Aprovechables): Botellas plásticas vacías, cartón seco y latas.",
        "Negro (No aprovechables): Papel higiénico, pañales y restos de comida cocida.",
        "Rojo (Peligrosos): Pilas usadas, jeringas, medicamentos vencidos (entregar al puesto de salud)."
      ]
    }
  ]
};
