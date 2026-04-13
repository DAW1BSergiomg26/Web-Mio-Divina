/**
 * REPORTE DE CURADURÍA MUSICAL
 * Mapeo de secciones HTML → pistas de audio
 */

// Helper para codificar rutas de forma segura
function encodeTrackPath(filename) {
  if (filename === 'all') return filename;
  return encodeURI(filename).replace(/'/g, '%27');
}

const rawMapping = {
  // ==================== SECCIONES PRINCIPALES ====================
  'index': {
    page: 'index.html',
    title: 'Inicio',
    pistaPrincipal: '34. Heart of Courage.mp3',
    pistaAlternativa: '10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3',
    justificacion: 'Pista épica de máximo impacto espiritual para bienvenida'
  },
  'quienes-somos': {
    page: 'quienes-somos.html',
    title: 'Quiénes Somos',
    pistaPrincipal: '27. Now We Are Free (Gladiator) - Instrumental Version.mp3',
    pistaAlternativa: '29. Tennessee.mp3',
    justificacion: 'Música épica que transmite profundidad histórica y espiritual'
  },
  'introduccion': {
    page: 'introduccion.html',
    title: 'Introducción',
    pistaPrincipal: '12. Shades and Shadows.mp3',
    pistaAlternativa: '13. The Essence.mp3',
    justificacion: 'Ambient contemplativo para meditación inicial'
  },
  'santa-faustina': {
    page: 'santa-faustina.html',
    title: 'Santa Faustina',
    pistaPrincipal: '87. Santa Faustina, Himno Moderno.mp3',
    pistaAlternativa: '103. Anna Netrebko - Pie Jesu.mp3',
    justificacion: 'Himno moderno dedicado + Pie Jesu suave para contemplación'
  },
  'hora-de-la-misericordia': {
    page: 'hora-de-la-misericordia.html',
    title: 'Hora de la Misericordia',
    pistaPrincipal: '06. Serse, HWV 40_ Largo _Ombra mai fu.mp3',
    pistaAlternativa: '14. Pachelbel Canon in D.mp3',
    justificacion: 'Ombra mai fu de Handel - meditación a la hora de las 3'
  },
  'coronilla': {
    page: 'coronilla.html',
    title: 'Coronilla',
    pistaPrincipal: '26. Hora de la Coronilla de la Divina Misericordia - Instrumental.mp3',
    pistaAlternativa: '14. Pachelbel Canon in D.mp3',
    justificacion: 'Instrumental específico para la coronilla + Canon para meditación'
  },
  'novena': {
    page: 'novena.html',
    title: 'Novena',
    pistaPrincipal: '25. Novena Divine Inspiration.mp3',
    pistaAlternativa: '10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3',
    justificacion: 'Inspiración novena + primavera symboliza renovación espiritual'
  },
  'via-crucis': {
    page: 'via-crucis.html',
    title: 'Vía Crucis',
    pistaPrincipal: '81. Braveheart-End Titles.mp3',
    pistaAlternativa: '17. Sonata quarta in D Major_ I. Ciaccona.mp3',
    justificacion: 'Braveheart para emoción pasional + Ciaccona para meditación'
  },
  'santo-rosario': {
    page: 'santo-rosario.html',
    title: 'Santo Rosario',
    pistaPrincipal: '161. Swan Lake, Op. 20a_ I. Scène.mp3',
    pistaAlternativa: '14. Pachelbel Canon in D.mp3',
    justificacion: 'Swan Lake para reflexión mariana + Canon para contemplación'
  },
  'maria': {
    page: 'maria.html',
    title: 'María',
    pistaPrincipal: '109. 4 Sacred Pieces (Quattro pezzi sacri)_ Laudi alla vergine Maria.mp3',
    pistaAlternativa: '86. Salve Regina.mp3',
    justificacion: 'Laudi alla Vergine Maria de Puccini + Salve Regina gregoriano'
  },
  'devociones-marianas': {
    page: 'devociones-marianas.html',
    title: 'Devociones Marianas',
    pistaPrincipal: '106. Pavarotti - Ave Maria.mp3',
    pistaAlternativa: '86. Salve Regina.mp3',
    justificacion: 'Ave Maria de Pavarotti + Salve Regina para devoción mariana'
  },
  'virgen-lujan': {
    page: 'virgen-lujan.html',
    title: 'Virgen de Luján',
    pistaPrincipal: '99. Virgencita de Lujan.mp3',
    pistaAlternativa: '56. For The Love Of A Princess.mp3',
    justificacion: 'Canto devocional argentino + melodía épica para patrona'
  },
  'virgen-caacupe': {
    page: 'virgen-caacupe.html',
    title: 'Virgen de Caacupé',
    pistaPrincipal: '151. Virgencita de Caacupe - Viky Codas.mp3',
    pistaAlternativa: '145. Tupâsy Ka\'akupépe - Las Paraguayas.mp3',
    justificacion: 'Canto paraguayo tradicional para la patrona de Paraguay'
  },
  'maria-auxiliadora': {
    page: 'maria-auxiliadora.html',
    title: 'María Auxiliadora',
    pistaPrincipal: '86. Salve Regina.mp3',
    pistaAlternativa: '109. Laudi alla Vergine Maria.mp3',
    justificacion: 'Salve Regina para Auxiliadora + himnos marianos'
  },
  'medalla-milagrosa': {
    page: 'medalla-milagrosa.html',
    title: 'Medalla Milagrosa',
    pistaPrincipal: '86. Salve Regina.mp3',
    pistaAlternativa: '105. Luciano Pavarotti - Ave Maria.mp3',
    justificacion: 'Salve Regina + Ave Maria para devoción mariana'
  },
  'oraciones': {
    page: 'oraciones.html',
    title: 'Oraciones',
    pistaPrincipal: '14. Pachelbel Canon in D.mp3',
    pistaAlternativa: '18. Violin Sonata No. 1 in D Minor_ VI. Aria.mp3',
    justificacion: 'Canon in D universal para oración + Aria de Bach'
  },
  'oracion-eucharistia': {
    page: 'oracion-eucharistia.html',
    title: 'Oración Eucarística',
    pistaPrincipal: '115. Panis Angelicus.mp3',
    pistaAlternativa: '127. Ave verum corpus, K. 618.mp3',
    justificacion: 'Panis Angelicus + Ave Verum para comunión y eucaristía'
  },
  'oracion-san-miguel': {
    page: 'oracion-san-miguel.html',
    title: 'Oración a San Miguel',
    pistaPrincipal: '30. Honor Him.mp3',
    pistaAlternativa: '41. Pact Sworn in Blood.mp3',
    justificacion: 'Música épica para guerrero espiritual'
  },
  'oracion-san-antonio': {
    page: 'oracion-san-antonio.html',
    title: 'Oración a San Antonio',
    pistaPrincipal: '91. Jesu, Joy of Man\'s Desiring.mp3',
    pistaAlternativa: '140. Jesus bleibet meine Freude.mp3',
    justificacion: 'Jesu Joy para alegría del findedor'
  },
  'oracion-santa-cruz': {
    page: 'oracion-santa-cruz.html',
    title: 'Oración a la Santa Cruz',
    pistaPrincipal: '17. Sonata quarta in D Major_ I. Ciaccona.mp3',
    pistaAlternativa: '81. Braveheart-End Titles.mp3',
    justificacion: 'Ciaccona para meditación en la cruz'
  },
  'oracion-del-estudiante': {
    page: 'oracion-del-estudiante.html',
    title: 'Oración del Estudiante',
    pistaPrincipal: '91. Jesu, Joy of Man\'s Desiring.mp3',
    pistaAlternativa: '09. J.S. Bach_ J.S. Bach_ Orchestral Suite No. 3 in D Major, BWV 1068_ 2.mp3',
    justificacion: 'Música studious con Bach para concentración'
  },
  'oracion-san-pancracio': {
    page: 'oracion-san-pancracio.html',
    title: 'Oración a San Pancracio',
    pistaPrincipal: '84. Jesus Paid It All.mp3',
    pistaAlternativa: '03. I Have Decided to Follow Jesus.mp3',
    justificacion: 'Himnos de dedicación y seguimiento'
  },
  'san-jose': {
    page: 'san-jose.html',
    title: 'San José',
    pistaPrincipal: '83. Himno a San José.mp3',
    pistaAlternativa: '20. Canzona undecima a due canti _detta la plettenberger.mp3',
    justificacion: 'Himno dedicado + música procesional para patriarca'
  },
  'san-jose-dormido': {
    page: 'san-jose-dormido.html',
    title: 'San José Dormido',
    pistaPrincipal: '83. Himno a San José.mp3',
    pistaAlternativa: '23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3',
    justificacion: 'Himno a José + Largo contemplativo para paz del sueño'
  },
  'san-francisco': {
    page: 'san-francisco.html',
    title: 'San Francisco',
    pistaPrincipal: '47. Goodbye Brother.mp3',
    pistaAlternativa: '20. Canzona undecima a due canti.mp3',
    justificacion: 'Despedida fraternal + música medieval para pobreza'
  },
  'san-cayetano': {
    page: 'san-cayetano.html',
    title: 'San Cayetano',
    pistaPrincipal: '30. Honor Him.mp3',
    pistaAlternativa: '42. No Sacrifice, No Victory.mp3',
    justificacion: 'Música épica para trabajo y pan'
  },
  'san-benito': {
    page: 'san-benito.html',
    title: 'San Benito',
    pistaPrincipal: '20. Canzona undecima a due canti _detta la plettenberger.mp3',
    pistaAlternativa: '22. 5e livre de viole_ Chaconne.mp3',
    justificacion: 'Música renacentista para patrono de monjes'
  },
  'san-judas-tadeo': {
    page: 'san-judas-tadeo.html',
    title: 'San Judas Tadeo',
    pistaPrincipal: '42. No Sacrifice, No Victory.mp3',
    pistaAlternativa: '34. Heart of Courage.mp3',
    justificacion: 'Música épica para santo de causas difíciles'
  },
  'san-sanson': {
    page: 'san-sanson.html',
    title: 'San Sansón',
    pistaPrincipal: '34. Heart of Courage.mp3',
    pistaAlternativa: '44. Promentory.mp3',
    justificacion: 'Música épica para fortaleza'
  },
  'santa-francisca-romana': {
    page: 'santa-francisca-romana.html',
    title: 'Santa Francisca Romana',
    pistaPrincipal: '109. Laudi alla Vergine Maria.mp3',
    pistaAlternativa: '86. Salve Regina.mp3',
    justificacion: 'Música mariana para santa romana'
  },
  'ss-juan-pablo-ii': {
    page: 'ss-juan-pablo-ii.html',
    title: 'San Juan Pablo II',
    pistaPrincipal: '155. Messiah, HWV 56, Pt. 2_ No. 44, Chorus. Hallelujah.mp3',
    pistaAlternativa: '34. Heart of Courage.mp3',
    justificacion: 'Hallelujah épico para san gran impacto'
  },
  'ss-francisco': {
    page: 'ss-francisco.html',
    title: 'San Francisco',
    pistaPrincipal: '47. Goodbye Brother.mp3',
    pistaAlternativa: '20. Canzona undecima.mp3',
    justificacion: 'Música emotiva para papa Francisco'
  },
  'ss-benedicto-xvi': {
    page: 'ss-benedicto-xvi.html',
    title: 'San Benedicto XVI',
    pistaPrincipal: '86. Salve Regina.mp3',
    pistaAlternativa: '109. Laudi alla Vergine Maria.mp3',
    justificacion: 'Música gregoriana para teólogo'
  },
  'ss-leon-xiv': {
    page: 'ss-leon-xiv.html',
    title: 'San León XIV',
    pistaPrincipal: '20. Canzona undecima a due canti.mp3',
    pistaAlternativa: '22. 5e livre de viole_ Chaconne.mp3',
    justificacion: 'Música renacentista para época medieval'
  },
  'otras-devociones': {
    page: 'otras-devociones.html',
    title: 'Otras Devociones',
    pistaPrincipal: '86. Salve Regina.mp3',
    pistaAlternativa: '14. Pachelbel Canon in D.mp3',
    justificacion: 'Salve Regina universal + Canon para devociones varias'
  },
  'consagracion': {
    page: 'consagracion.html',
    title: 'Consagración',
    pistaPrincipal: '03. I Have Decided to Follow Jesus.mp3',
    pistaAlternativa: '30. Honor Him.mp3',
    justificacion: 'Himno de decisión + música de honor para consagración'
  },
  'consagracion-sagrado-corazon': {
    page: 'consagracion-sagrado-corazon.html',
    title: 'Consagración al Sagrado Corazón',
    pistaPrincipal: '84. Jesus Paid It All.mp3',
    pistaAlternativa: '137. Jesu, Joy Of Man\'s Desiring.mp3',
    justificacion: 'Jesús pagó todo + Jesu Joy para amor sagrado'
  },
  'cruz-del-perdon': {
    page: 'cruz-del-perdon.html',
    title: 'Cruz del Perdon',
    pistaPrincipal: '17. Sonata quarta in D Major_ I. Ciaccona.mp3',
    pistaAlternativa: '57. Murron\'s Burial.mp3',
    justificacion: 'Ciaccona para penitencia + música para perdón'
  },
  'divino-nino-jesus': {
    page: 'divino-nino-jesus.html',
    title: 'Divino Niño Jesús',
    pistaPrincipal: '62. A Narnia Lullaby (From _The Chronicles of Narnia_) - Piano Version.mp3',
    pistaAlternativa: '63. A Narnia Lullaby.mp3',
    justificacion: 'Narnia Lullaby para infancia divina'
  },
  'la-santina': {
    page: 'la-santina.html',
    title: 'La Santina',
    pistaPrincipal: '62. A Narnia Lullaby.mp3',
    pistaAlternativa: '109. Laudi alla Vergine Maria.mp3',
    justificacion: 'Nanna suave para devotion infantil'
  },
  'los-rayos': {
    page: 'los-rayos.html',
    title: 'Los Rayos de la Divina Misericordia',
    pistaPrincipal: '35. Day One (Interstellar Theme).mp3',
    pistaAlternativa: '33. Evenstar.mp3',
    justificacion: 'Música épica para los rayos de misericordia'
  },
  'obras-de-misericordia': {
    page: 'obras-de-misericordia.html',
    title: 'Obras de Misericordia',
    pistaPrincipal: '84. Jesus Paid It All.mp3',
    pistaAlternativa: '03. I Have Decided to Follow Jesus.mp3',
    justificacion: 'Himnos de servicio y caridad'
  },
  'misterios-gozosos': {
    page: 'misterios-gozosos.html',
    title: 'Misterios Gozosos',
    pistaPrincipal: '10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3',
    pistaAlternativa: '161. Swan Lake, Op. 20a_ I. Scène.mp3',
    justificacion: 'Primavera + Cisne para gozo mariano'
  },
  'misterios-dolorosos': {
    page: 'misterios-dolorosos.html',
    title: 'Misterios Dolorosos',
    pistaPrincipal: '81. Braveheart-End Titles.mp3',
    pistaAlternativa: '17. Sonata quarta in D Major_ I. Ciaccona.mp3',
    justificacion: 'Música para sufrimiento y pasión'
  },
  'misterios-luminosos': {
    page: 'misterios-luminosos.html',
    title: 'Misterios Luminosos',
    pistaPrincipal: '91. Jesu, Joy of Man\'s Desiring.mp3',
    pistaAlternativa: '140. Jesus bleibet meine Freude.mp3',
    justificacion: 'Jesu Joy para luz y alegría'
  },
  'misterios-de-gloria': {
    page: 'misterios-de-gloria.html',
    title: 'Misterios de Gloria',
    pistaPrincipal: '155. Messiah, HWV 56, Pt. 2_ No. 44, Chorus. Hallelujah.mp3',
    pistaAlternativa: '116. Messiah _ Part 2_ 42. Chorus_ _Hallelujah.mp3',
    justificacion: 'Hallelujah para gloria resurrección'
  },
  'estudios-biblicos': {
    page: 'estudios-biblicos.html',
    title: 'Estudios Bíblicos',
    pistaPrincipal: '16. Sonata violino solo representativa in A Major_ III. Alemande.mp3',
    pistaAlternativa: '08. Handel _ Orch. Hale_ Keyboard Suite No. 4 in D Minor, HWV 437_ III. Sarabande.mp3',
    justificacion: 'Música barroca para estudio serio'
  },
  'lugares-de-culto': {
    page: 'lugares-de-culto.html',
    title: 'Lugares de Culto',
    pistaPrincipal: '20. Canzona undecima a due canti _detta la plettenberger.mp3',
    pistaAlternativa: '23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3',
    justificacion: 'Música para lugares sagrados'
  },
  'galeria': {
    page: 'galeria.html',
    title: 'Galería',
    pistaPrincipal: '61.The Secret Wedding.mp3',
    pistaAlternativa: '52. The Shire.mp3',
    justificacion: 'Música festiva para galería de imágenes'
  },
  'noticias': {
    page: 'noticias.html',
    title: 'Noticias',
    pistaPrincipal: '37. Main Title.mp3',
    pistaAlternativa: '59. The Battle Of Stirling.mp3',
    justificacion: 'Música de noticia épica'
  },
  'contacto': {
    page: 'contacto.html',
    title: 'Contacto',
    pistaPrincipal: '14. Pachelbel Canon in D.mp3',
    pistaAlternativa: '18. Violin Sonata No. 1 in D Minor_ VI. Aria.mp3',
    justificacion: 'Música amigable para contacto'
  },
  'enlaces': {
    page: 'enlaces.html',
    title: 'Enlaces',
    pistaPrincipal: '91. Jesu, Joy of Man\'s Desiring.mp3',
    pistaAlternativa: '09. Air (Suite No. 3).mp3',
    justificacion: 'Música útil para navegación'
  },
  'lecturas-recomendadas': {
    page: 'lecturas-recomendadas.html',
    title: 'Lecturas Recomendadas',
    pistaPrincipal: '09. J.S. Bach_ Orchestral Suite No. 3 in D Major, BWV 1068_ 2.mp3',
    pistaAlternativa: '07. Aria de la Suite no. 3 en Re Mayor, BWV 1068.mp3',
    justificacion: 'Air de Bach para lectura reflexiva'
  },
  'espacio-jovenes': {
    page: 'espacio-jovenes.html',
    title: 'Espacio Jóvenes',
    pistaPrincipal: '38.He's a Pirate.mp3',
    pistaAlternativa: '64. Only The Beginning of The Adventure.mp3',
    justificacion: 'Música aventurera para jóvenes'
  },
  'el-altar': {
    page: 'el-altar.html',
    title: 'El Altar',
    pistaPrincipal: '115. Panis Angelicus.mp3',
    pistaAlternativa: '110. Agnus Dei.mp3',
    justificacion: 'Panis Angelicus + Agnus Dei para altar'
  },
  'musica-sacra': {
    page: 'musica-sacra.html',
    title: 'Música Sacra',
    pistaPrincipal: 'all',
    pistaAlternativa: null,
    justificacion: 'Biblioteca completa de música sacra'
  }
};

const sectionMusicMapping = {};

for (const [key, value] of Object.entries(rawMapping)) {
  sectionMusicMapping[key] = {
    ...value,
    pistaPrincipal: value.pistaPrincipal !== 'all' ? encodeTrackPath(value.pistaPrincipal) : 'all',
    pistaAlternativa: value.pistaAlternativa ? encodeTrackPath(value.pistaAlternativa) : null
  };
}

// Exportar para uso global
window.SectionMusicMapping = sectionMusicMapping;

console.log('REPORTE DE CURADURÍA MUSICAL (OPTIMIZADO):', Object.keys(sectionMusicMapping).length, 'secciones.');
