/**
 * Base de Datos de Fiestas Litúrgicas
 * Fiestas marianas, santos del santoral y solemnidades del Señor
 * Sin dependencias - Módulo puro JavaScript
 */
(function(global) {
  'use strict';

  const FEAST_DAYS = [
    // ======================
    // FIESTAS MARIANAS
    // ======================
    {
      month: 1, day: 1,
      name: "María Madre de Dios",
      type: "solemnidad",
      category: "mariana",
      color: "blanco",
      description: "Solemnidad de María, Madre de Dios, celebrate el 1 de enero.",
      section: "maria.html"
    },
    {
      month: 1, day: 8,
      name: "Santa María Reina",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "María es reconocida como Reina y Madre de la Iglesia.",
      section: "maria.html"
    },
    {
      month: 2, day: 2,
      name: "Presentación del Señor",
      type: "solemnidad",
      category: "senor",
      color: "blanco",
      description: "María presentará a Jesús en el templo 40 días después del nacimiento.",
      section: null
    },
    {
      month: 2, day: 11,
      name: "Nuestra Señora de Lourdes",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "Aparición de la Virgen a Bernadette en Lourdes (1858).",
      section: "devociones-marianas.html"
    },
    {
      month: 3, day: 19,
      name: "San José Esposo de María",
      type: "solemnidad",
      category: "santos",
      color: "blanco",
      description: "Fiesta de San José, patrón de la Iglesia universal.",
      section: "san-jose.html"
    },
    {
      month: 3, day: 25,
      name: "Anunciación del Señor",
      type: "solemnidad",
      category: "senor",
      color: "blanco",
      description: "El ángel Gabriel anuncia a María que será Madre del Salvador.",
      section: "maria.html"
    },
    {
      month: 4, day: 25,
      name: "San Marcos Evangelista",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Evangelista, autor del segundo evangelio.",
      section: null
    },
    {
      month: 5, day: 1,
      name: "San José Trabajador",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "San José como modelo del trabajador.",
      section: "san-jose.html"
    },
    {
      month: 5, day: 13,
      name: "Nuestra Señora de Fátima",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "Apariciones de la Virgen en Fátima (1917).",
      section: "devociones-marianas.html"
    },
    {
      month: 5, day: 31,
      name: "Visitación de la Virgen María",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "María visita a su prima Isabel.",
      section: "maria.html"
    },
    {
      month: 6, day: 8,
      name: "Nuestra Señora de la Merced",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "María como Reina y Madre de la redención.",
      section: "devociones-marianas.html"
    },
    {
      month: 6, day: 13,
      name: "San Antonio de Padua",
      type: "fiesta",
      category: "santos",
      color: "blanco",
      description: "Santo-taumaturgo, patrón de los objetos perdidos.",
      section: "oracion-san-antonio.html"
    },
    {
      month: 6, day: 21,
      name: "San Luis Gonzaga",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Patrón de la juventud.",
      section: null
    },
    {
      month: 6, day: 24,
      name: "Nacimiento de San Juan Bautista",
      type: "solemnidad",
      category: "santos",
      color: "blanco",
      description: "Preursor de Jesús.",
      section: null
    },
    {
      month: 6, day: 29,
      name: "San Pedro y San Pablo",
      type: "solemnidad",
      category: "santos",
      color: "rojo",
      description: "Apóstoles, columnas de la Iglesia.",
      section: null
    },
    {
      month: 7, day: 2,
      name: "Nuestra Señora de los Desamparados",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "Patrona de Valencia y de los abandonados.",
      section: "devociones-marianas.html"
    },
    {
      month: 7, day: 16,
      name: "Nuestra Señora del Carmen",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "María como estrella del mar y protectora de los marineros.",
      section: "devociones-marianas.html"
    },
    {
      month: 7, day: 22,
      name: "Santa María Magdalena",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Testigo de la resurrección.",
      section: null
    },
    {
      month: 7, day: 25,
      name: "Santiago Apóstol",
      type: "solemnidad",
      category: "santos",
      color: "rojo",
      description: "Patrón de España.",
      section: null
    },
    {
      month: 7, day: 31,
      name: "San Ignacio de Loyola",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Fundador de los Jesuitas.",
      section: null
    },
    {
      month: 8, day: 1,
      name: "San Alfonso María de Ligorio",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Doctor de la Iglesia.",
      section: null
    },
    {
      month: 8, day: 5,
      name: "Dedicación de la basílica de Santa María",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "Dedicación de la basílica de Santa María la Mayor.",
      section: "maria.html"
    },
    {
      month: 8, day: 6,
      name: "Transfiguración del Señor",
      type: "fiesta",
      category: "senor",
      color: "blanco",
      description: "Jesús se transfigura ante Pedro, Santiago y Juan.",
      section: null
    },
    {
      month: 8, day: 8,
      name: "San Cayetano",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Patrón del pan y del trabajo.",
      section: "san-cayetano.html"
    },
    {
      month: 8, day: 11,
      name: "Santa Clara de Asís",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Fundadora de las Clarisas.",
      section: null
    },
    {
      month: 8, day: 14,
      name: "San Maximiliano Kolbe",
      type: "memoria",
      category: "santos",
      color: "rojo",
      description: "Mártir de la caridad, patrono de los presos.",
      section: null
    },
    {
      month: 8, day: 15,
      name: "Asunción de la Virgen María",
      type: "solemnidad",
      category: "mariana",
      color: "blanco",
      description: "María es asumida body y alma al cielo.",
      section: "maria.html"
    },
    {
      month: 8, day: 16,
      name: "San Roque",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Patrón de los enfermos.",
      section: null
    },
    {
      month: 8, day: 20,
      name: "San Bernardo de Claraval",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Doctor de la Iglesia, mariólogo.",
      section: null
    },
    {
      month: 8, day: 22,
      name: "María Reina",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "María comme Reina del cielo y de la tierra.",
      section: "maria.html"
    },
    {
      month: 8, day: 27,
      name: "Santa Monica",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Madre de San Agustín.",
      section: null
    },
    {
      month: 8, day: 29,
      name: "Martirio de San Juan Bautista",
      type: "memoria",
      category: "santos",
      color: "rojo",
      description: "Muerte del precursor.",
      section: null
    },
    {
      month: 9, day: 8,
      name: "Natividad de la Virgen María",
      type: "solemnidad",
      category: "mariana",
      color: "blanco",
      description: "Nacimiento de María.",
      section: "maria.html"
    },
    {
      month: 9, day: 12,
      name: "Santo Nombre de María",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "Celebración del nombre de María.",
      section: "maria.html"
    },
    {
      month: 9, day: 14,
      name: "Exaltación de la Santa Cruz",
      type: "solemnidad",
      category: "senor",
      color: "rojo",
      description: "Celebración de la Cruz de Cristo.",
      section: "cruz-del-perdon.html"
    },
    {
      month: 9, day: 15,
      name: "Nuestra Señora de Covadonga",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "Aparición de la Virgen en Covadonga.",
      section: "devociones-marianas.html"
    },
    {
      month: 9, day: 21,
      name: "San Mateo Apóstol",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Evangelista.",
      section: null
    },
    {
      month: 9, day: 24,
      name: "Nuestra Señora de la Merced",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "María nos concede su maternidad espiritual.",
      section: "devociones-marianas.html"
    },
    {
      month: 9, day: 29,
      name: "San Miguel Arcángel",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Protector de la Iglesia.",
      section: "oracion-san-miguel.html"
    },
    {
      month: 10, day: 1,
      name: "Santa Teresa del Niño Jesús",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Doctora de la Iglesia, patrona de las misiones.",
      section: null
    },
    {
      month: 10, day: 2,
      name: "Ángeles Custodios",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Celebración de los ángeles guardianes.",
      section: null
    },
    {
      month: 10, day: 4,
      name: "San Francisco de Asís",
      type: "fiesta",
      category: "santos",
      color: "blanco",
      description: "Patrón de Italia y de los ecólogos.",
      section: "san-francisco.html"
    },
    {
      month: 10, day: 7,
      name: "Nuestra Señora del Rosario",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "María nos entrega el Rosario.",
      section: "santo-rosario.html"
    },
    {
      month: 10, day: 9,
      name: "San Juan Pablo II",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Papa polaco, propagation de la Divina Misericordia.",
      section: "ss-juan-pablo-ii.html"
    },
    {
      month: 10, day: 18,
      name: "San Lucas Evangelista",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Evangelista, médico.",
      section: null
    },
    {
      month: 10, day: 28,
      name: "San Simón y San Judas",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Apóstoles.",
      section: "san-judas-tadeo.html"
    },
    {
      month: 11, day: 1,
      name: "Todos los Santos",
      type: "solemnidad",
      category: "santos",
      color: "blanco",
      description: "Celebración de todos los santos.",
      section: null
    },
    {
      month: 11, day: 2,
      name: "Conmemoración de los difuntos",
      type: "memoria",
      category: "temporal",
      color: "morado",
      description: "Oración por las almas del purgatorio.",
      section: null
    },
    {
      month: 11, day: 9,
      name: "Dedicación de la basílica de Letrán",
      type: "solemnidad",
      category: "senor",
      color: "blanco",
      description: "Catedral de Roma.",
      section: null
    },
    {
      month: 11, day: 10,
      name: "San León Magno",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Doctor de la Iglesia.",
      section: null
    },
    {
      month: 11, day: 11,
      name: "San Martín de Tours",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Patrón de los soldados.",
      section: null
    },
    {
      month: 11, day: 13,
      name: "Santa Isabel de Hungría",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Ejemplo de caridad.",
      section: null
    },
    {
      month: 11, day: 18,
      name: "Dedicación de las basílicas de Pedro y Pablo",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Basílicas Vaticana y de San Pablo.",
      section: null
    },
    {
      month: 11, day: 21,
      name: "Presentacion de Maria",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "María presentada en el templo.",
      section: "maria.html"
    },
    {
      month: 11, day: 22,
      name: "Santa Cecilia",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Patrona de los músicos.",
      section: null
    },
    {
      month: 11, day: 24,
      name: "San Andrés Dung-Lac y compañeros",
      type: "memoria",
      category: "santos",
      color: "rojo",
      description: "Mártires vietnamitas.",
      section: null
    },
    {
      month: 11, day: 30,
      name: "San Andrés Apóstol",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Patrón de Escocia.",
      section: null
    },
    {
      month: 12, day: 3,
      name: "San Francisco Javier",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Misionero, patrón de las misiones.",
      section: null
    },
    {
      month: 12, day: 4,
      name: "San Juan de la Cruz",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Doctor de la Iglesia, místico.",
      section: null
    },
    {
      month: 12, day: 6,
      name: "San Nicolás de Bari",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Patrón de los niños.",
      section: null
    },
    {
      month: 12, day: 8,
      name: "Inmaculada Concepción de María",
      type: "solemnidad",
      category: "mariana",
      color: "blanco",
      description: "María preservada del pecado original.",
      section: "maria.html"
    },
    {
      month: 12, day: 12,
      name: "Nuestra Señora de Guadalupe",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "Aparición de la Virgen a Juan Diego.",
      section: "devociones-marianas.html"
    },
    {
      month: 12, day: 13,
      name: "Santa Lucía",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Mártir, patrona de la vista.",
      section: null
    },
    {
      month: 12, day: 21,
      name: "San Pedro Canisio",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Doctor de la Iglesia.",
      section: null
    },
    {
      month: 12, day: 25,
      name: "Natividad del Señor",
      type: "solemnidad",
      category: "senor",
      color: "blanco",
      description: "Nacimiento de Jesús.",
      section: "index.html"
    },
    {
      month: 12, day: 26,
      name: "San Esteban Protomártir",
      type: "fiesta",
      category: "santos",
      color: "rojo",
      description: "Primer mártir.",
      section: null
    },
    {
      month: 12, day: 27,
      name: "San Juan Apóstol",
      type: "fiesta",
      category: "santos",
      color: "blanco",
      description: "Evangelista, amado de Jesús.",
      section: null
    },
    {
      month: 12, day: 28,
      name: "Santos Inocentes",
      type: "memoria",
      category: "santos",
      color: "rojo",
      description: "Niños degollados por Herodes.",
      section: null
    },
    {
      month: 12, day: 31,
      name: "San Silvestre I",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Papa, último día del año.",
      section: null
    },
    // ======================
    // ADVOCACIONES ESPAÑOLAS
    // ======================
    {
      month: 12, day: 8,
      name: "Virgen de la Inmaculada Concepción",
      type: "solemnidad",
      category: "mariana",
      color: "blanco",
      description: "Patrona de España.",
      section: "maria.html"
    },
    {
      month: 1, day: 6,
      name: "Epifanía del Señor",
      type: "solemnidad",
      category: "senor",
      color: "blanco",
      description: "Los Reyes Magos adoran al Niño Jesús.",
      section: null
    },
    {
      month: 1, day: 7,
      name: "Virgen del Pilar",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "Patrona de España, aparición en Zaragoza.",
      section: "devociones-marianas.html"
    },
    {
      month: 9, day: 8,
      name: "Virgen de la Victoria",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "Patrona de Málaga.",
      section: "devociones-marianas.html"
    },
    {
      month: 9, day: 15,
      name: "Virgen de Covadonga",
      type: "fiesta",
      category: "mariana",
      color: "blanco",
      description: "Patrona de Asturias.",
      section: "virgen-caacupe.html"
    },
    {
      month: 8, day: 15,
      name: "Virgen de la Asunción",
      type: "solemnidad",
      category: "mariana",
      color: "blanco",
      description: "Patrona de muchas regiones.",
      section: "maria.html"
    },
    {
      month: 9, day: 24,
      name: "Virgen de la Merced",
      type: "memoria",
      category: "mariana",
      color: "blanco",
      description: "Patrona de Barcelona.",
      section: "devociones-marianas.html"
    },
    // ======================
    // FIESTAS DE LA DIVINA MISERICORDIA
    // ======================
    {
      month: 4, day: 0, // Calculado dinámicamente desde Pascua
      name: "Domingo de Resurrección",
      type: "solemnidad",
      category: "temporal",
      color: "blanco",
      description: "Pascua - Resurrección de Cristo.",
      section: "index.html"
    },
    {
      month: 4, day: -46, // Calculado desde Pascua
      name: "Miércoles de Ceniza",
      type: "temporal",
      category: "temporal",
      color: "morado",
      description: "Inicio de la Cuaresma.",
      section: null
    },
    {
      month: 4, day: 1,
      name: "Divina Misericordia (Domingo)",
      type: "fiesta",
      category: "senor",
      color: "rojo",
      description: "Domingo de la Divina Misericordia - Jesús, En Vos Confío.",
      section: "index.html"
    },
    {
      month: 11, day: 1,
      name: "Cristo Rey",
      type: "solemnidad",
      category: "senor",
      color: "blanco",
      description: "Solemnidad de Nuestro Señor Jesucristo, Rey del Universo.",
      section: null
    },
    // ======================
    // SANTOS ESPAÑOLES
    // ======================
    {
      month: 7, day: 9,
      name: "Santa María Goretti",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Joven mártir italiana.",
      section: null
    },
    {
      month: 10, day: 25,
      name: "San Antonio María Claret",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Misionero, fundador.",
      section: null
    },
    {
      month: 11, day: 14,
      name: "San José de Calasanz",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Fundador de los Escolapios.",
      section: null
    },
    {
      month: 5, day: 30,
      name: "San Fernando",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Rey de Castilla.",
      section: null
    },
    {
      month: 6, day: 30,
      name: "San Pedro",
      type: "solemnidad",
      category: "santos",
      color: "rojo",
      description: "Príncipe de los Apóstoles.",
      section: null
    },
    {
      month: 7, day: 20,
      name: "San Vicente de Paúl",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Fundador de la Caridad.",
      section: null
    },
    {
      month: 7, day: 26,
      name: "Santos Joaquín y Ana",
      type: "memoria",
      category: "santos",
      color: "blanco",
      description: "Padres de la Virgen María.",
      section: "maria.html"
    }
  ];

  // Función helper para obtener fiesta por fecha
  function getFeastByDate(month, day) {
    return FEAST_DAYS.find(f => f.month === month && f.day === day);
  }

  // Función para obtener todas las fiestas del mes
  function getFeastsByMonth(month) {
    return FEAST_DAYS.filter(f => f.month === month);
  }

  // Función para buscar fiestas por nombre
  function searchFeasts(query) {
    const q = query.toLowerCase();
    return FEAST_DAYS.filter(f => 
      f.name.toLowerCase().includes(q) || 
      f.description.toLowerCase().includes(q)
    );
  }

  // Exportar al ámbito global
  global.FEAST_DAYS = FEAST_DAYS;
  global.getFeastByDate = getFeastByDate;
  global.getFeastsByMonth = getFeastsByMonth;
  global.searchFeasts = searchFeasts;

})(typeof window !== 'undefined' ? window : this);