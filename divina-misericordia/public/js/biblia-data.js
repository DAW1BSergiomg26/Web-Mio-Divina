// ============================================================
// BIBLIA CATÓLICA APOSTÓLICA ROMANA
// Todos los 73 libros: 46 Antiguo + 27 Nuevo Testamento
// ============================================================

const bibliaData = {
  at: {
    nombre: "Antiguo Testamento",
    libros: [
      // PENTATEUCO (5 libros)
      { nombre: "Génesis", capitulos: 50, abreviado: "Gén", contenido: generarContenido("Génesis", 50) },
      { nombre: "Éxodo", capitulos: 40, abreviado: "Éx", contenido: generarContenido("Éxodo", 40) },
      { nombre: "Levítico", capitulos: 27, abreviado: "Lev", contenido: generarContenido("Levítico", 27) },
      { nombre: "Números", capitulos: 36, abreviado: "Núm", contenido: generarContenido("Números", 36) },
      { nombre: "Deuteronomio", capitulos: 34, abreviado: "Dt", contenido: generarContenido("Deuteronomio", 34) },
      
      // HISTÓRICOS (16 libros)
      { nombre: "Josué", capitulos: 24, abreviado: "Jos", contenido: generarContenido("Josué", 24) },
      { nombre: "Jueces", capitulos: 21, abreviado: "Jue", contenido: generarContenido("Jueces", 21) },
      { nombre: "Rut", capitulos: 4, abreviado: "Rut", contenido: generarContenido("Rut", 4) },
      { nombre: "1 Samuel", capitulos: 31, abreviado: "1 Sam", contenido: generarContenido("1 Samuel", 31) },
      { nombre: "2 Samuel", capitulos: 24, abreviado: "2 Sam", contenido: generarContenido("2 Samuel", 24) },
      { nombre: "1 Reyes", capitulos: 22, abreviado: "1 Re", contenido: generarContenido("1 Reyes", 22) },
      { nombre: "2 Reyes", capitulos: 25, abreviado: "2 Re", contenido: generarContenido("2 Reyes", 25) },
      { nombre: "1 Crónicas", capitulos: 29, abreviado: "1 Crón", contenido: generarContenido("1 Crónicas", 29) },
      { nombre: "2 Crónicas", capitulos: 36, abreviado: "2 Crón", contenido: generarContenido("2 Crónicas", 36) },
      { nombre: "Esdras", capitulos: 10, abreviado: "Esd", contenido: generarContenido("Esdras", 10) },
      { nombre: "Nehemías", capitulos: 13, abreviado: "Neh", contenido: generarContenido("Nehemías", 13) },
      
      // DEUTEROCANÓNICOS - HISTÓRICOS (4 libros)
      { nombre: "Tobías", capitulos: 14, abreviado: "Tob", contenido: generarContenido("Tobías", 14) },
      { nombre: "Judit", capitulos: 16, abreviado: "Jdt", contenido: generarContenido("Judit", 16) },
      { nombre: "Ester (Vulgata)", capitulos: 10, abreviado: "Est", contenido: generarContenido("Ester", 10) },
      { nombre: "1 Macabeos", capitulos: 16, abreviado: "1 Mac", contenido: generarContenido("1 Macabeos", 16) },
      { nombre: "2 Macabeos", capitulos: 15, abreviado: "2 Mac", contenido: generarContenido("2 Macabeos", 15) },
      
      // SAPIENCIALES (7 libros)
      { nombre: "Job", capitulos: 42, abreviado: "Job", contenido: generarContenido("Job", 42) },
      { nombre: "Salmos", capitulos: 150, abreviado: "Sal", contenido: {
        1: [{v:1,t:"Bienaventurado el varón que no anduvo en consejo de malos..."}],
        23: [{v:1,t:"Jehová es mi pastor; nada me faltará."}],
        91: [{v:1,t:"El que habita al abrigo del Altísimo, bajo la sombra del Omnipotente descansará."}],
        103: [{v:1,t:"Bendice, alma mía, a Jehovah, y bendigan todas mis entrañas su santo nombre."}]
      }},
      { nombre: "Proverbios", capitulos: 31, abreviado: "Prov", contenido: generarContenido("Proverbios", 31) },
      { nombre: "Eclesiastés", capitulos: 12, abreviado: "Ecl", contenido: generarContenido("Eclesiastés", 12) },
      { nombre: "Cantares", capitulos: 8, abreviado: "Cant", contenido: generarContenido("Cantares", 8) },
      
      // DEUTEROCANÓNICOS - SAPIENCIALES (2 libros)
      { nombre: "Sabiduría", capitulos: 19, abreviado: "Sab", contenido: generarContenido("Sabiduría", 19) },
      { nombre: "Eclesiástico", capitulos: 51, abreviado: "Eclo", contenido: generarContenido("Eclesiástico", 51) },
      
      // PROFETAS MAYORES (5 libros)
      { nombre: "Isaías", capitulos: 66, abreviado: "Is", contenido: {
        7: [{v:14,t:"Por esto el Señor mismo os dará señal: La Virgen concebirá y dará a luz un hijo, y llamará su nombre Emanuel."}],
        9: [{v:6,t:"Porque un niño nos es nacido, hijo nos es dado, y el principado será sobre su hombro; y se llamará su nombre Admirable, Consejero, Dios fuerte, Padre eterno, Príncipe de paz."}],
        40: [{v:31,t:"Pero los que esperan a Jehovah tendrán nuevas fuerzas; levantarán alas como las águilas."}],
        53: [{v:5,t:"Mas él fue wounded por nuestras rebeliones, molido por nuestros pecados; el castigo de nuestra paz fue sobre él, y por su llaga nosotros fuimos sanados."}]
      }},
      { nombre: "Jeremías", capitulos: 52, abreviado: "Jer", contenido: generarContenido("Jeremías", 52) },
      { nombre: "Lamentaciones", capitulos: 5, abreviado: "Lam", contenido: generarContenido("Lamentaciones", 5) },
      { nombre: "Baruc", capitulos: 6, abreviado: "Bar", contenido: generarContenido("Baruc", 6) },
      { nombre: "Ezequiel", capitulos: 48, abreviado: "Ez", contenido: generarContenido("Ezequiel", 48) },
      { nombre: "Daniel", capitulos: 14, abreviado: "Dan", contenido: {
        3: [{v:26,t:"Entonces Nabucodonosor expresó: Bendito sea el Dios de Sadrac, Mesac y Abed-nego, que envió su ángel y libertó a sus siervos."}],
        9: [{v:4,t:"Y oré a Jehovah mi Dios, e hice confesión diciendo: Ah, Señor, Dios grande y temible, que guardas el pacto y la misericordia con los que te aman."}]
      }},
      
      // PROFETAS MENORES (12 libros)
      { nombre: "Oseas", capitulos: 14, abreviado: "Os", contenido: generarContenido("Oseas", 14) },
      { nombre: "Joel", capitulos: 3, abreviado: "Jl", contenido: generarContenido("Joel", 3) },
      { nombre: "Amós", capitulos: 9, abreviado: "Am", contenido: generarContenido("Amós", 9) },
      { nombre: "Abdías", capitulos: 1, abreviado: "Abd", contenido: generarContenido("Abdías", 1) },
      { nombre: "Jonás", capitulos: 4, abreviado: "Jon", contenido: generarContenido("Jonás", 4) },
      { nombre: "Miqueas", capitulos: 7, abreviado: "Miq", contenido: generarContenido("Miqueas", 7) },
      { nombre: "Nahúm", capitulos: 3, abreviado: "Nah", contenido: generarContenido("Nahúm", 3) },
      { nombre: "Habacuc", capitulos: 3, abreviado: "Hab", contenido: generarContenido("Habacuc", 3) },
      { nombre: "Sofonías", capitulos: 3, abreviado: "Sof", contenido: generarContenido("Sofonías", 3) },
      { nombre: "Ageo", capitulos: 2, abreviado: "Ag", contenido: generarContenido("Ageo", 2) },
      { nombre: "Zacarías", capitulos: 14, abreviado: "Zac", contenido: generarContenido("Zacarías", 14) },
      { nombre: "Malaquías", capitulos: 4, abreviado: "Mal", contenido: generarContenido("Malaquías", 4) }
    ]
  },
  
  nt: {
    nombre: "Nuevo Testamento",
    libros: [
      // EVANGELIOS (4 libros)
      { nombre: "Mateo", capitulos: 28, abreviado: "Mt", contenido: {
        1: [{v:1,t:"Libro de la genealogía de Jesucristo, hijo de David, hijo de Abraham."}],
        5: [{v:9,t:"Bienaventurados los pacificadores, porque ellos serán llamados hijos de Dios."}],
        11: [{v:28,t:"Venid a mí todos los que estáis trabajados y cargados, y yo os daré descanso."}],
        16: [{v:18,t:"Y yo también te digo, que tú eres Pedro, y sobre esta piedra edificaré mi iglesia; y las puertas del Hades no prevalecerán contra ella."}]
      }},
      { nombre: "Marcos", capitulos: 16, abreviado: "Mc", contenido: {
        1: [{v:1,t:"Principio del evangelio de Jesucristo, Hijo de Dios."}],
        16: [{v:15,t:"Y les dijo: Id por todo el mundo y predicad el evangelio a toda criatura."}]
      }},
      { nombre: "Lucas", capitulos: 24, abreviado: "Lc", contenido: {
        1: [{v:1,t:"Puesto que muchos han intentado poner en orden la narración de los hechos entre nosotros."}],
        2: [{v:11,t:"Porque hoy os ha nacido en la ciudad de David un Salvador, que es el Cristo Señor."}],
        15: [{v:11,t:"Y dijo: Un hombre tenía dos hijos;"}]
      }},
      { nombre: "Juan", capitulos: 21, abreviado: "Jn", contenido: {
        1: [{v:1,t:"En el principio era el Verbo, y el Verbo era con Dios, y el Verbo era Dios."}],
        3: [{v:16,t:"Porque tanto amó Dios al mundo, que ha dado a su Hijo unigénito, para que todo el que cree en él no se pierda, sino que tenga vida eterna."}],
        14: [{v:6,t:"Jesús le dijo: Yo soy el camino, y la verdad, y la vida; nadie viene al Padre sino por mí."}]
      }},
      
      // HECHOS
      { nombre: "Hechos", capitulos: 28, abreviado: "Hch", contenido: {
        1: [{v:8,t:"Pero recibiréis poder, cuando haya venido sobre vosotros el Espíritu Santo, y me seréis testigos en Jerusalén, en toda Judea, en Samaria, y hasta lo último de la tierra."}],
        2: [{v:38,t:"Pedro les dijo: Arrepentíos, y bautícese cada uno de vosotros en el nombre de Jesucristo para perdón de los pecados; y recibiréis el don del Espíritu Santo."}]
      }},
      
      // CARTAS PAULINAS (13 libros)
      { nombre: "Romanos", capitulos: 16, abreviado: "Rom", contenido: {
        1: [{v:16,t:"Porque no me avergüenzo del evangelio, porque es poder de Dios para salvación a todo aquel que cree."}],
        8: [{v:28,t:"Y sabemos que todas las cosas cooperan para el bien de los que aman a Dios, que son llamados según su propósito."}]
      }},
      { nombre: "1 Corintios", capitulos: 16, abreviado: "1 Cor", contenido: {
        10: [{v:13,t:"No os ha sobrevenido ninguna tentación que no sea común al hombre; pero fiel es Dios, que no让你们被试探，过于你们能忍受的；并且在你们受试探的时候，总要给你们开一条出路，叫你们能忍受得住。"}],
        13: [{v:4,t:"El amor es sufrido, es benigno; el amor no tiene envidia; el amor no se jacta, no se envanece."}]
      }},
      { nombre: "2 Corintios", capitulos: 13, abreviado: "2 Cor", contenido: generarContenido("2 Corintios", 13) },
      { nombre: "Gálatas", capitulos: 6, abreviado: "Gal", contenido: generarContenido("Gálatas", 6) },
      { nombre: "Efesios", capitulos: 6, abreviado: "Ef", contenido: {
        4: [{v:32,t:"Antes sed benignos unos con otros, misericordiosos, perdónanse mutuamente, así como Dios os perdonó en Cristo."}],
        6: [{v:11,t:"Vestíos de toda la armadura de Dios, para que podáis estar firmes contra las asechanzas del diablo."}]
      }},
      { nombre: "Filipenses", capitulos: 4, abreviado: "Flp", contenido: generarContenido("Filipenses", 4) },
      { nombre: "Colosenses", capitulos: 4, abreviado: "Col", contenido: generarContenido("Colosenses", 4) },
      { nombre: "1 Tesalonicenses", capitulos: 5, abreviado: "1 Tes", contenido: generarContenido("1 Tesalonicenses", 5) },
      { nombre: "2 Tesalonicenses", capitulos: 3, abreviado: "2 Tes", contenido: generarContenido("2 Tesalonicenses", 3) },
      { nombre: "1 Timoteo", capitulos: 6, abreviado: "1 Tim", contenido: generarContenido("1 Timoteo", 6) },
      { nombre: "2 Timoteo", capitulos: 4, abreviado: "2 Tim", contenido: generarContenido("2 Timoteo", 4) },
      { nombre: "Tito", capitulos: 3, abreviado: "Tit", contenido: generarContenido("Tito", 3) },
      { nombre: "Filemón", capitulos: 1, abreviado: "Flm", contenido: generarContenido("Filemón", 1) },
      
      // CARTAS CATÓLICAS (7 libros)
      { nombre: "Hebreos", capitulos: 13, abreviado: "Heb", contenido: {
        1: [{v:1,t:"Dios, que en diversas ocasiones y de diferentes maneras habló a los padres por los profetas, nos ha hablado en estos últimos días por su Hijo."}],
        11: [{v:1,t:"Es la certeza de lo que no se ve, la prueba de lo que se espera."}]
      }},
      { nombre: "Santiago", capitulos: 5, abreviado: "Sant", contenido: {
        1: [{v:17,t:"Toda buena dádiva y todo don perfecto desciende de lo alto, del Padre de las luces."}]
      }},
      { nombre: "1 Pedro", capitulos: 5, abreviado: "1 Ped", contenido: generarContenido("1 Pedro", 5) },
      { nombre: "2 Pedro", capitulos: 3, abreviado: "2 Ped", contenido: generarContenido("2 Pedro", 3) },
      { nombre: "1 Juan", capitulos: 5, abreviado: "1 Jn", contenido: {
        1: [{v:1,t:"Lo que era desde el principio, lo que hemos oído, lo que hemos visto con nuestros ojos, lo que contemplamos y tocaron nuestras manos concernant la Palabra de vida."}],
        4: [{v:8,t:"El que no ama no ha conocido a Dios; porque Dios es amor."}]
      }},
      { nombre: "2 Juan", capitulos: 1, abreviado: "2 Jn", contenido: generarContenido("2 Juan", 1) },
      { nombre: "3 Juan", capitulos: 1, abreviado: "3 Jn", contenido: generarContenido("3 Juan", 1) },
      { nombre: "Judas", capitulos: 1, abreviado: "Judas", contenido: generarContenido("Judas", 1) },
      
      // APOCALIPSIS
      { nombre: "Apocalipsis", capitulos: 22, abreviado: "Ap", contenido: {
        1: [{v:8,t:"Yo soy el Alfa y la Omega, dice el Señor Dios, el que es, el que era y el que ha de venir, el Todopoderoso."}],
        21: [{v:4,t:"Enjugará Dios toda lágrima de sus ojos, y no habrá más muerte, ni habrá más llanto, ni clamor, ni dolor."}]
      }}
    ]
  }
};

// Función para generar contenido de ejemplo
function generarContenido(nombre, capitulos) {
  const contenido = {};
  // Solo generamos algunos versículos de ejemplo
  contenido[1] = [{v:1,t:`Libro de ${nombre}, capítulo 1. Texto de ejemplo.`}];
  if (capitulos > 3) {
    contenido[Math.floor(capitulos/2)] = [{v:1,t:`${nombre} - Texto representativo del libro.`}];
  }
  return contenido;
}

// Exportar
if (typeof module !== 'undefined' && module.exports) {
  module.exports = bibliaData;
}
