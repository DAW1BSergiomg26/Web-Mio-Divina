/**
 * Audio Catalog - Catálogo Completo de Música Sacra
 * Sistema de Curaduría Musical para Divina Misericordia
 * Total: 181 pistas (actualizado)
 */

const AudioCatalog = (function() {
  function convertTrack(track) {
    return {
      title: track.title,
      artist: track.artist,
      src: 'mp3/' + track.file,
      tempo: track.tempo || 'moderada',
      caracter: track.caracter || 'sagrado',
      instrumentacion: track.instrumentacion || 'orquestal',
      sections: track.sections || []
    };
  }

  function getCategories() {
    return [
      {
        category: "🎵 Música Sacra Premium - Los Grandes Intérpretes",
        icon: "🎵",
        tracks: [
          { file: "103. Anna Netrebko - Pie Jesu.mp3", title: "Pie Jesu", artist: "Anna Netrebko", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["santa-faustina", "oraciones", "divina-misericordia"] },
          { file: "104. José Carreras - Pie Jesu.mp3", title: "Pie Jesu", artist: "José Carreras", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["santa-faustina", "oraciones"] },
          { file: "105. Luciano Pavarotti - Ave Maria, D839 - Remastered 2013.mp3", title: "Ave Maria", artist: "Luciano Pavarotti", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "virgen-lujan", "virgen-caacupe"] },
          { file: "106. Pavarotti - Ave Maria.mp3", title: "Ave Maria", artist: "Luciano Pavarotti", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "devociones-marianas"] },
          { file: "107. Pavarotti & Erip Claton - Holy Mother.mp3", title: "Holy Mother", artist: "Pavarotti & Eric Clapton", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["maria", "oraciones"] },
          { file: "108. Tres Tenores - Silent Night (1).mp3", title: "Silent Night", artist: "Tres Tenores", tempo: "lenta", caracter: "jubiloso", instrumentacion: "coral", sections: ["navidad", "index"] },
          { file: "133. Mille cherubini in coro (After Wiegenlied, D. 498) [Arr. Mercurio for Tenor].mp3", title: "Mille Cherubini in Coro", artist: "Tenor", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] }
        ].map(convertTrack)
      },
      {
        category: "🙏 Himnos de Devoción y Oración",
        icon: "🙏",
        tracks: [
          { file: "00. Virgen de los Estudiantes.mp3", title: "Virgen de los Estudiantes", artist: "Canto Popular", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "virgen-lujan"] },
          { file: "01. Jesus is all the world to me.mp3", title: "Jesus is All the World", artist: "Himno Tradicional", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["oraciones", "index"] },
          { file: "02. More About Jesus.mp3", title: "More About Jesus", artist: "Himno Evangélico", tempo: "moderada", caracter: "contemplativo", instrumentacion: "coral", sections: ["estudios-biblicos", "oraciones"] },
          { file: "03. I Have Decided to Follow Jesus.mp3", title: "I Have Decided to Follow Jesus", artist: "Himno Tradicional", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["consagracion", "quienes-somos"] },
          { file: "95. Sweet Hour of Prayer.mp3", title: "Sweet Hour of Prayer", artist: "Himno de Oración", tempo: "lenta", caracter: "contemplativo", instrumentacion: "piano", sections: ["oraciones", "hora-de-la-misericordia"] },
          { file: "96. A New Name in Glory - Instrumental.mp3", title: "A New Name in Glory", artist: "Himno Celebración", tempo: "moderada", caracter: "celebracion", instrumentacion: "orquestal", sections: ["noticias", "galeria"] },
          { file: "84. Jesus Paid It All.mp3", title: "Jesus Paid It All", artist: "Himno Evangélico", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["oraciones", "consagracion"] },
          { file: "83. Himno a San José.mp3", title: "Himno a San José", artist: "Dedicación", tempo: "moderada", caracter: "sagrado", instrumentacion: "coral", sections: ["san-jose", "san-jose-dormido"] },
          { file: "87. Santa Faustina, Himno Moderno.mp3", title: "Santa Faustina - Himno", artist: "Dedicación", tempo: "moderada", caracter: "sagrado", instrumentacion: "coral", sections: ["santa-faustina", "divina-misericordia"] },
          { file: "119. Pregária.mp3", title: "Pregária", artist: "Canto Devocional", tempo: "lenta", caracter: "contemplativo", instrumentacion: "coral", sections: ["oraciones", "novena"] },
          { file: "120. Repentir.mp3", title: "Repentir", artist: "Canto Devocional", tempo: "lenta", caracter: "penitencial", instrumentacion: "coral", sections: ["via-crucis", "oraciones"] },
          { file: "158. Violin Sonata No. 3 in C Major, BWV 1005 (Arr. for Piano by Víkingur Ólafsson)_ I. Adagio.mp3", title: "Violin Sonata No. 3 - Adagio", artist: "J.S. Bach", tempo: "lenta", caracter: "contemplativo", instrumentacion: "piano", sections: ["estudios-biblicos", "oraciones"] }
        ].map(convertTrack)
      },
      {
        category: "🇦🇷 Devociones Marianas - Virgen de Luján",
        icon: "🇦🇷",
        tracks: [
          { file: "99. Virgencita de Lujan.mp3", title: "Virgencita de Luján", artist: "Canto Devocional", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-lujan", "oraciones"] },
          { file: "100. Virgencita de Lujan.mp3", title: "Virgencita de Luján", artist: "Canto Popular", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-lujan", "maria"] },
          { file: "101. Virgencita de Lujan.mp3", title: "Virgencita de Luján", artist: "Canto Popular", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-lujan", "devociones-marianas"] },
          { file: "102. Virgencita de Luján.mp3", title: "Virgencita de Luján", artist: "Coro Parroquial", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-lujan", "oraciones"] },
          { file: "98. Virgen India.mp3", title: "Virgen India", artist: "Canto Devocional", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "virgen-caacupe"] },
          { file: "86. Salve Regina.mp3", title: "Salve Regina", artist: "Canto Gregoriano", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "virgen-lujan", "virgen-caacupe", "devociones-marianas"] }
        ].map(convertTrack)
      },
      {
        category: "🇵🇾 Devociones Marianas - Virgen de Caacupé",
        icon: "🇵🇾",
        tracks: [
          { file: "151. Virgencita de Caacupe - Viky Codas.mp3", title: "Virgencita de Caacupé", artist: "Viky Codas", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "devociones-marianas"] },
          { file: "150. Virgencita de Caacupe - Odilio Roman.mp3", title: "Virgencita de Caacupé", artist: "Odilio Roman", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "maria"] },
          { file: "149. Virgencita de Caacupe - Los Tres Sudamericanos.mp3", title: "Virgencita de Caacupé", artist: "Los Tres Sudamericanos", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "oraciones"] },
          { file: "74. Virgencita de Caacupe - Edgar Galeano.mp3", title: "Virgencita de Caacupé", artist: "Edgar Galeano", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "devociones-marianas"] },
          { file: "75. Virgencita De Caacupe - Francisco Russo.mp3", title: "Virgencita de Caacupé", artist: "Francisco Russo", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "maria"] },
          { file: "76. Virgencita de Caacupe - Grupo Coral (3).mp3", title: "Virgencita de Caacupé", artist: "Grupo Coral", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "maria"] },
          { file: "145. Tupâsy Ka'akupépe - Las Paraguayas.mp3", title: "Tupasy Ka'akupë", artist: "Las Paraguayas", tempo: "moderada", caracter: "mariano", instrumentacion: "coral", sections: ["virgen-caacupe", "maria"] }
        ].map(convertTrack)
      },
      {
        category: "🎼 Música Litúrgica y Sacramental",
        icon: "🎼",
        tracks: [
          { file: "110. Agnus Dei (Choral Version of the Intermezzo from L'Arlésienne, Op. 23, WD 28).mp3", title: "Agnus Dei", artist: "G. Bizet", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "113. German Mass, D.872_ Heilig, heilig, heilig.mp3", title: "Heilig", artist: "F. Schubert", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "115. Panis Angelicus.mp3", title: "Panis Angelicus", artist: "C. Franck", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "eucaristia"] },
          { file: "117. Panis Angelicus.mp3", title: "Panis Angelicus", artist: "Cesar Franck", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "128. Panis Angelicus, FWV 61.mp3", title: "Panis Angelicus", artist: "C. Franck", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["eucaristia", "misa"] },
          { file: "155. Messiah, HWV 56, Pt. 2_ No. 44, Chorus. Hallelujah, for the Lord God Omnipotent Reigneth.mp3", title: "Hallelujah (Messiah)", artist: "G.F. Handel", tempo: "rapida", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "pascoa", "navidad"] },
          { file: "116. Messiah _ Part 2_ 42. Chorus_ _Hallelujah.mp3", title: "Hallelujah", artist: "G.F. Handel", tempo: "rapida", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "pascoa", "navidad"] },
          { file: "127. Ave verum corpus, K. 618.mp3", title: "Ave Verum Corpus", artist: "W.A. Mozart", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["eucaristia", "oraciones"] },
          { file: "124. Sancta Maria.mp3", title: "Sancta Maria", artist: "Canto Gregoriano", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "oraciones"] },
          { file: "122. Pietà, Signore.mp3", title: "Pietà, Signore", artist: "Canto Gregoriano", tempo: "lenta", caracter: "penitencial", instrumentacion: "gregoriano", sections: ["via-crucis", "oraciones"] },
          { file: "118. Pietà, Signore.mp3", title: "Pietà, Signore", artist: "A. Stradella", tempo: "lenta", caracter: "penitencial", instrumentacion: "coral", sections: ["via-crucis", "oraciones"] },
          { file: "123. Stabat Mater_ II. Cujus animam gementem.mp3", title: "Stabat Mater", artist: "G.B. Pergolesi", tempo: "lenta", caracter: "penitencial", instrumentacion: "coral", sections: ["via-crucis", "maria"] },
          { file: "129. Requiem_ IIh. Ingemisco.mp3", title: "Ingemisco", artist: "G. Verdi", tempo: "lenta", caracter: "contemplativo", instrumentacion: "coral", sections: ["oraciones", "difuntos"] },
          { file: "70. Missa Solemnis In C Major 'Dilectantenmesse'- VI. Agnus Dei. Larghetto.mp3", title: "Agnus Dei - Missa Solemnis", artist: "L. van Beethoven", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "93. Missa solemnis in D Major, Op. 123_ I. Kyrie_ Kyrie eleison. Assai sostenuto.mp3", title: "Kyrie - Missa Solemnis", artist: "L. van Beethoven", tempo: "lenta", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "71. Introductory Choir from \"Gloria in excelsis Deo\", BWV 191.mp3", title: "Gloria in Excelsis Deo", artist: "J.S. Bach", tempo: "rapida", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "navidad"] },
          { file: "73. Introductory Choir from \"Gloria in excelsis Deo\", BWV 191.mp3", title: "Gloria in Excelsis Deo", artist: "J.S. Bach", tempo: "rapida", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "navidad"] },
          { file: "72. Cantata BWV 147 Jesús, Alegría de los hombres.mp3", title: "Jesús, Alegría de los Hombres", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "132. Petite messe solennelle_ II. Gloria. Domine Deus.mp3", title: "Gloria - Domine Deus", artist: "G. Rossini", tempo: "moderada", caracter: "sagrado", instrumentacion: "coral", sections: ["misa", "oraciones"] }
        ].map(convertTrack)
      },
      {
        category: "🎻 Música Barroca Clásica",
        icon: "🎻",
        tracks: [
          { file: "05. Brandenburg Concerto No. 1 in F Major, BWV 1046_ I.mp3", title: "Brandenburg Concerto No. 1", artist: "J.S. Bach", tempo: "procesional", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["novena", "consagracion", "index"] },
          { file: "90. Concierto-de-Branderburgo-n.1-BWV-1046-en-Fa-mayor-Adagio.mp3", title: "Concierto de Brandeburgo No. 1 - Adagio", artist: "J.S. Bach", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["estudios-biblicos", "oraciones"] },
          { file: "92. Concierto-de-Branderburgo-n.1-BWV-1046-en-Fa-mayor-Adagio_ok.mp3", title: "Concierto de Brandeburgo No. 1", artist: "J.S. Bach", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["estudios-biblicos"] },
          { file: "04. Concierto-de-Branderburgo-n.3-BWV-1048-en-Sol-Mayor-Allegro-moderato_ok.mp3", title: "Concierto de Brandeburgo No. 3", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["noticias", "galeria"] },
          { file: "94. Concierto-de-Branderburgo-n.3-BWV-1048-en-Sol-Mayor-Allegro-moderato.mp3", title: "Concierto de Brandeburgo No. 3", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["noticias"] },
          { file: "06. Serse, HWV 40_ Largo _Ombra mai fu.mp3", title: "Largo 'Ombra mai fu' (Xerxes)", artist: "G.F. Handel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["hora-de-la-misericordia", "via-crucis", "oraciones", "coronilla"] },
          { file: "130. Serse, HWV 40, Act I_ Frondi tenere e belle - Ombra mai fu.mp3", title: "Ombra mai fu", artist: "G.F. Handel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "hora-de-la-misericordia"] },
          { file: "09. J.S. Bach_ J.S. Bach_ Orchestral Suite No. 3 in D Major, BWV 1068_ 2.mp3", title: "Air (Suite No. 3)", artist: "J.S. Bach", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["hora-de-la-misericordia", "coronilla", "estudios-biblicos"] },
          { file: "07. Aria de la Suite no. 3 en Re Mayor, BWV 1068.mp3", title: "Aria de la Suite No. 3", artist: "J.S. Bach", tempo: "lenta", caracter: "contemplativo", instrumentacion: "cuerda", sections: ["oraciones", "maria"] },
          { file: "08. Handel _ Orch. Hale_ Keyboard Suite No. 4 in D Minor, HWV 437_ III. Sarabande.mp3", title: "Sarabande (Keyboard Suite)", artist: "G.F. Handel", tempo: "lenta", caracter: "penitencial", instrumentacion: "organo", sections: ["via-crucis", "estudios-biblicos", "oraciones"] },
          { file: "134. Adeste Fideles.mp3", title: "Adeste Fideles", artist: "Canto de Navidad", tempo: "rapida", caracter: "jubiloso", instrumentacion: "coral", sections: ["navidad", "index"] },
          { file: "135. Gloria a te, Cristo Gesù.mp3", title: "Gloria a te, Cristo Gesù", artist: "Canto Gregoriano", tempo: "lenta", caracter: "sagrado", instrumentacion: "gregoriano", sections: ["navidad", "oraciones"] },
          { file: "91. Jesu, Joy of Man's Desiring.mp3", title: "Jesu, Joy of Man's Desiring", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["oraciones", "index"] },
          { file: "136. Jesu, Joy of Man's Desiring.mp3", title: "Jesu, Joy of Man's Desiring", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["oraciones", "index"] },
          { file: "137. Jesu, Joy of Man's Desiring.mp3", title: "Jesu, Joy of Man's Desiring", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["oraciones", "consagracion"] },
          { file: "138. Jesu, Joy Of Man's Desiring.mp3", title: "Jesu, Joy of Man's Desiring", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["noticias", "galeria"] },
          { file: "139.Jesu, Joy of Man's Desiring (From _Herz und Mund und Tat und Leben, BWV 147_).mp3", title: "Jesu, Joy of Man's Desiring", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["novena", "oraciones"] },
          { file: "140. Herz und Mund und Tat und Leben, Cantata BWV 147_ 10. Choral_ _Jesus bleibet meine Freude.mp3", title: "Jesus bleibet meine Freude", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "index"] },
          { file: "114. Herz und Mund und Tat und Leben, Cantata BWV 147_ 10. Choral_ _Jesus bleibet meine Freude.mp3", title: "Jesus bleibet meine Freude", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "coral", sections: ["misa", "oraciones"] },
          { file: "141. Jesu, Joy of Man's Desiring, BWV 147.mp3", title: "Jesu, Joy of Man's Desiring", artist: "J.S. Bach", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["oraciones", "novena"] },
          { file: "89. Brockes Passion, HWV 48_ No. 1, Sinfonie.mp3", title: "Sinfonie (Brockes Passion)", artist: "G.F. Handel", tempo: "moderada", caracter: "sagrado", instrumentacion: "orquestal", sections: ["semana-santa", "via-crucis"] }
        ].map(convertTrack)
      },
      {
        category: "🕊️ Música de Contemplación",
        icon: "🕊️",
        tracks: [
          { file: "14. Pachelbel Canon in D.mp3", title: "Canon in D (Pachelbel)", artist: "Pachelbel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "cuerda", sections: ["oraciones", "coronilla", "hora-de-la-misericordia", "santo-rosario", "novena"] },
          { file: "15. Canon in D.mp3", title: "Canon in D", artist: "Pachelbel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "cuerda", sections: ["oraciones", "coronilla", "maria"] },
          { file: "161. Swan Lake, Op. 20a_ I. Scène.mp3", title: "Swan Lake - Scène", artist: "P.I. Tchaikovsky", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["santo-rosario", "maria"] },
          { file: "12. Shades and Shadows.mp3", title: "Shades and Shadows", artist: "Ambient", tempo: "lenta", caracter: "contemplativo", instrumentacion: "ambiente", sections: ["oraciones", "introduccion"] },
          { file: "13. The Essence.mp3", title: "The Essence", artist: "Ambient", tempo: "lenta", caracter: "contemplativo", instrumentacion: "ambiente", sections: ["oraciones", "quienes-somos"] },
          { file: "16. Sonata violino solo representativa in A Major_ III. Allemande.mp3", title: "Sonata Violino Solo - Allemande", artist: "H.I.F. Biber", tempo: "moderada", caracter: "contemplativo", instrumentacion: "cuerda", sections: ["estudios-biblicos"] },
          { file: "17. Sonata quarta in D Major_ I. Ciaccona.mp3", title: "Sonata Quarta - Ciaccona", artist: "D. Castello", tempo: "moderada", caracter: "sagrado", instrumentacion: "cuerda", sections: ["via-crucis"] },
          { file: "18. Violin Sonata No. 1 in D Minor_ VI. Aria.mp3", title: "Violin Sonata No. 1 - Aria", artist: "J.S. Bach", tempo: "lenta", caracter: "contemplativo", instrumentacion: "cuerda", sections: ["oraciones"] },
          { file: "131. Wesendonck Lieder, WWV 91_ I. Der Engel (Orch. Mottl).mp3", title: "Der Engel", artist: "R. Wagner", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "maria"] },
          { file: "109. 4 Sacred Pieces (Quattro pezzi sacri)_ Laudi alla vergine Maria.mp3", title: "Laudi alla Vergine Maria", artist: "G. Puccini", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "oraciones"] }
        ].map(convertTrack)
      },
      {
        category: "✨ Música de Gloria - Vivaldi y Grandes Maestros",
        icon: "✨",
        tracks: [
          { file: "10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3", title: "La Primavera (Spring)", artist: "A. Vivaldi", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["novena", "noticias", "index"] },
          { file: "19. Concerto 2 in D Major, Op. 7_ I. Adagio.mp3", title: "Concerto in D Major - Adagio", artist: "A. Vivaldi", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "maria"] },
          { file: "20. Canzona undecima a due canti _detta la plettenberger.mp3", title: "Canzona Undecima", artist: "G. Gabrieli", tempo: "procesional", caracter: "sagrado", instrumentacion: "orquestal", sections: ["consagracion", "misa"] },
          { file: "21. Les plaisirs_ Sarabande.mp3", title: "Les Plaisirs - Sarabande", artist: "M. Marais", tempo: "lenta", caracter: "contemplativo", instrumentacion: "cuerda", sections: ["oraciones"] },
          { file: "22. 5e livre de viole_ Chaconne.mp3", title: "5e Livre de Viole - Chaconne", artist: "M. Marais", tempo: "moderada", caracter: "sagrado", instrumentacion: "cuerda", sections: ["via-crucis", "estudios-biblicos"] },
          { file: "23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3", title: "Concerto Grosso - Largo", artist: "A. Corelli", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "maria"] }
        ].map(convertTrack)
      },
      {
        category: "🎬 Música Cinematográfica Sagrada",
        icon: "🎬",
        tracks: [
          { file: "27. Now We Are Free (Gladiator) - Instrumental Version.mp3", title: "Now We Are Free (Gladiator)", artist: "Hans Zimmer", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["quienes-somos", "index", "noticias"] },
          { file: "28. Now We Are Free (from _Gladiator_) - Piano Solo Version.mp3", title: "Now We Are Free - Piano", artist: "Hans Zimmer", tempo: "lenta", caracter: "epico", instrumentacion: "piano", sections: ["oraciones", "consagracion"] },
          { file: "29. Tennessee.mp3", title: "Tennessee", artist: "Hans Zimmer", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "quienes-somos"] },
          { file: "30. Honor Him.mp3", title: "Honor Him", artist: "Hans Zimmer", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["martires", "consagracion"] },
          { file: "31. The Kiss.mp3", title: "The Kiss", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["maria", "oraciones"] },
          { file: "32. Elysium.mp3", title: "Elysium", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["oraciones", "consagracion"] },
          { file: "33. Evenstar.mp3", title: "Evenstar", artist: "Howard Shore", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["maria", "oraciones"] },
          { file: "41. Pact Sworn in Blood.mp3", title: "Pact Sworn in Blood", artist: "Two Steps From Hell", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["consagracion", "martires"] },
          { file: "81. Braveheart-End Titles.mp3", title: "Braveheart - End Titles", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["via-crucis", "consagracion"] },
          { file: "97. Braveheart-End Titles.mp3", title: "Braveheart - End Titles (Alt)", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["via-crucis", "martires"] },
          { file: "56. For The Love Of A Princess.mp3", title: "For the Love of a Princess", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["maria", "virgen-lujan"] },
          { file: "57. Murron's Burial.mp3", title: "Murron's Burial", artist: "James Horner", tempo: "lenta", caracter: "penitencial", instrumentacion: "orquestal", sections: ["via-crucis", "oraciones"] },
          { file: "58. Revenge [Braveheart - Original Sound Track].mp3", title: "Revenge (Braveheart)", artist: "James Horner", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["martires", "consagracion"] },
          { file: "59. The Battle Of Stirling [Braveheart - Original Sound Track].mp3", title: "The Battle of Stirling", artist: "James Horner", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["noticias", "index"] },
          { file: "60. The Princess Pleads For Wallace's Life.mp3", title: "The Princess Pleads for Wallace", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["maria", "oraciones"] },
          { file: "61.The Secret Wedding.mp3", title: "The Secret Wedding", artist: "James Horner", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["noticias", "galeria"] },
          { file: "55. A Gift Of A Thistle.mp3", title: "A Gift of a Thistle", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "celta", sections: ["maria", "devociones-marianas"] }
        ].map(convertTrack)
      },
      {
        category: "⚔️ Música Épica y Aventura",
        icon: "⚔️",
        tracks: [
          { file: "34. Heart of Courage.mp3", title: "Heart of Courage", artist: "Two Steps From Hell", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "consagracion", "noticias"] },
          { file: "35. Day One (Interstellar Theme).mp3", title: "Day One (Interstellar)", artist: "Hans Zimmer", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "estudios-biblicos"] },
          { file: "36. Becoming Human.mp3", title: "Becoming Human", artist: "Hans Zimmer", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["quienes-somos", "espacio-jovenes"] },
          { file: "37. Main Title.mp3", title: "Main Title", artist: "Hans Zimmer", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "noticias"] },
          { file: "38.He's a Pirate.mp3", title: "He's a Pirate", artist: "Hans Zimmer", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["espacio-jovenes", "noticias"] },
          { file: "49. Aphelion.mp3", title: "Aphelion", artist: "Hans Zimmer", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "oraciones"] },
          { file: "50. Winter Is Here.mp3", title: "Winter is Here", artist: "Ramin Djawadi", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "invierno"] },
          { file: "42. No Sacrifice, No Victory.mp3", title: "No Sacrifice, No Victory", artist: "Steve Jablonsky", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["consagracion", "martires"] },
          { file: "44. Promentory.mp3", title: "Promentory (Last of the Mohicans)", artist: "Trevor Jones", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "quienes-somos"] },
          { file: "46. Blackheart.mp3", title: "Blackheart", artist: "Inon Zur", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["martires"] },
          { file: "47. Goodbye Brother.mp3", title: "Goodbye Brother", artist: "Inon Zur", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["oraciones", "san-francisco"] },
          { file: "48. Optimus.mp3", title: "Optimus", artist: "Steve Jablonsky", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["quienes-somos", "noticias"] }
        ].map(convertTrack)
      },
      {
        category: "🏰 El Señor de los Anillos",
        icon: "🏰",
        tracks: [
          { file: "39. Concerning Hobbits.mp3", title: "Concerning Hobbits", artist: "Howard Shore", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["espacio-jovenes", "index"] },
          { file: "40. The Way Home.mp3", title: "The Way Home", artist: "Howard Shore", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "quienes-somos"] },
          { file: "43. This Land.mp3", title: "This Land", artist: "Howard Shore", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "quienes-somos"] },
          { file: "45. The Grey Havens (feat. Sir James Galway).mp3", title: "The Grey Havens", artist: "Howard Shore", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["oraciones", "consagracion"] },
          { file: "51. El señor de los anillos (Suite) (La comunidad del anillo).mp3", title: "Suite Señor de los Anillos", artist: "Howard Shore", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "espacio-jovenes"] },
          { file: "52. The Shire.mp3", title: "The Shire", artist: "Howard Shore", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["espacio-jovenes", "galeria"] },
          { file: "53. The Council of Elrond (feat. _Aniron_) [Theme for Aragorn and Arwen].mp3", title: "The Council of Elrond", artist: "Howard Shore", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["consagracion"] },
          { file: "54. The Bridge Of Khazad-Dum (From _The Lord Of The Rings_).mp3", title: "The Bridge of Khazad-dûm", artist: "Howard Shore", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "noticias"] }
        ].map(convertTrack)
      },
      {
        category: "🦁 Crónicas de Narnia",
        icon: "🦁",
        tracks: [
          { file: "62. A Narnia Lullaby (From _The Chronicles of Narnia_) - Piano Version.mp3", title: "A Narnia Lullaby (Piano)", artist: "Harry Gregson-Williams", tempo: "lenta", caracter: "contemplativo", instrumentacion: "piano", sections: ["maria", "oraciones", "espacio-jovenes"] },
          { file: "63. A Narnia Lullaby.mp3", title: "A Narnia Lullaby", artist: "Harry Gregson-Williams", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["maria", "oraciones"] },
          { file: "64. Only The Beginning of The Adventure.mp3", title: "Only the Beginning", artist: "Harry Gregson-Williams", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["espacio-jovenes", "index"] },
          { file: "65. Aslan Appears.mp3", title: "Aslan Appears", artist: "Harry Gregson-Williams", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "quienes-somos"] },
          { file: "66. Aslan's Breath.mp3", title: "Aslan's Breath", artist: "Harry Gregson-Williams", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "consagracion"] },
          { file: "67. Raid on the Castle - Score.mp3", title: "Raid on the Castle", artist: "Harry Gregson-Williams", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["noticias", "martires"] },
          { file: "68. The Battle.mp3", title: "The Battle", artist: "Harry Gregson-Williams", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["noticias", "consagracion"] },
          { file: "69. The Kings and Queens of Old - Score.mp3", title: "The Kings and Queens of Old", artist: "Harry Gregson-Williams", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["santos", "consagracion"] }
        ].map(convertTrack)
      },
      {
        category: "❤️ Divina Misericordia - Oraciones y Devociones",
        icon: "❤️",
        tracks: [
          { file: "24. Vía Crucis - Para Orar.mp3", title: "Vía Crucis - Para Orar", artist: "Devoción", tempo: "lenta", caracter: "penitencial", instrumentacion: "orquestal", sections: ["via-crucis"] },
          { file: "25. Novena Divine Inspiration.mp3", title: "Novena Divine Inspiration", artist: "Oración", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["novena", "oraciones"] },
          { file: "26. Hora de la Coronilla de la Divina Misericordia - Instrumental.mp3", title: "Hora de la Coronilla", artist: "Divina Misericordia", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["hora-de-la-misericordia", "coronilla"] },
          { file: "82. Ave Maria.mp3", title: "Ave Maria", artist: "Canto Gregoriano", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "virgen-lujan"] },
          { file: "111. Ave Maria.mp3", title: "Ave Maria", artist: "Canto Gregoriano", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "oraciones"] },
          { file: "112. Ave Maria.mp3", title: "Ave Maria", artist: "Coro de la Catedral", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "virgen-caacupe"] },
          { file: "121. Ave Maria.mp3", title: "Ave Maria", artist: "Voces Sacras", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "virgen-lujan"] },
          { file: "125. Ave Maria, CG 89a (After J.S. Bach_ Prelude in C Major, BWV 846).mp3", title: "Ave Maria", artist: "Canto Gregoriano", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "oraciones"] },
          { file: "126. Ave Maria, D. 839.mp3", title: "Ave Maria", artist: "Franz Schubert", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "virgen-lujan"] },
          { file: "142. Ave Maria, dolce Maria.mp3", title: "Ave Maria, dolce Maria", artist: "Canto Gregoriano", tempo: "lenta", caracter: "mariano", instrumentacion: "gregoriano", sections: ["maria", "devociones-marianas"] },
          { file: "143. Ave Maria.mp3", title: "Ave Maria", artist: "Coro Mariano", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "virgen-caacupe"] },
          { file: "144. Ave Maria (Duet With Placido Domingo) (with Plácido Domingo).mp3", title: "Ave Maria (Dueto)", artist: "Plácido Domingo", tempo: "lenta", caracter: "mariano", instrumentacion: "coral", sections: ["maria", "oraciones"] }
        ].map(convertTrack)
      },
      {
        category: "🎹 Música Clásica Adicional",
        icon: "🎹",
        tracks: [
          { file: "147. Conquest of Paradise.mp3", title: "Conquest of Paradise", artist: "Vangelis", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "consagracion"] },
          { file: "148. Por un Puñado de Dólares (From _Per un Pugno Di Dollari.mp3", title: "Por un Puñado de Dólares", artist: "Ennio Morricone", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["index"] },
          { file: "152. La Conquista del Oeste I (From _How The West Was Won.mp3", title: "La Conquista del Oeste", artist: "Leonard Rosenman", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["noticias"] },
          { file: "153. Main Title_ De Guella _ The Green Leaves of Summer.mp3", title: "The Green Leaves of Summer", artist: "Alex North", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["index"] },
          { file: "154. The Ludlows (From _Legends Of The Fall_ Soundtrack).mp3", title: "The Ludlows", artist: "James Horner", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["oraciones", "maria"] },
          { file: "156. The Mission.mp3", title: "The Mission", artist: "Ennio Morricone", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["misa", "oraciones"] },
          { file: "157. The Ecstasy of Gold - L'Estasi Dell'oro.mp3", title: "The Ecstasy of Gold", artist: "Ennio Morricone", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["consagracion"] },
          { file: "159. The Good, The Bad And The Ugly - 2004 Remaster.mp3", title: "The Good, The Bad and The Ugly", artist: "Ennio Morricone", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["noticias"] },
          { file: "160. The Ecstasy of Gold - L'Estasi Dell'oro.mp3", title: "The Ecstasy of Gold", artist: "Ennio Morricone", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["consagracion", "index"] },
          { file: "162. Swan Lake, Op. 20a_ II. Valse.mp3", title: "Swan Lake - Valse", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["maria", "galeria"] },
          { file: "163. Swan Lake, Op. 20a_ III. Danse des cygnes.mp3", title: "Swan Lake - Danse des Cygnes", artist: "P.I. Tchaikovsky", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "maria"] },
          { file: "164. Swan Lake, Op. 20a_ IV. Pas d'action andantino quasi moderato.mp3", title: "Swan Lake - Pas d'Action", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones"] },
          { file: "165. Swan Lake, Op. 20a_ V. Czardas_ Danse hongroise.mp3", title: "Swan Lake - Czardas", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["galeria", "noticias"] },
          { file: "166. Swan Lake, Op. 20a_ VI. Danse rspagnole.mp3", title: "Swan Lake - Danse Espagnole", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["galeria"] },
          { file: "167. The Nutcracker, Op. 71_ Miniature Overture.mp3", title: "The Nutcracker - Overture", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["navidad", "index"] },
          { file: "168. Swan Lake, Op. 20a_ VII. Danse napolitaine.mp3", title: "Swan Lake - Danse Napolitaine", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["galeria"] },
          { file: "169. Swan Lake, Op. 20a_ VIII. Mazurka.mp3", title: "Swan Lake - Mazurka", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["galeria"] },
          { file: "170. The Sleeping Beauty, Op. 66a_ I. Introduction_spotdown.org.mp3", title: "The Sleeping Beauty - Introduction", artist: "P.I. Tchaikovsky", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones"] },
          { file: "171. The Sleeping Beauty, Op. 66a_ II. Adagio.mp3", title: "The Sleeping Beauty - Adagio", artist: "P.I. Tchaikovsky", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones", "maria"] },
          { file: "172. The Sleeping Beauty, Op. 66a_ III. Pas de caractère.mp3", title: "The Sleeping Beauty - Pas de Caractère", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["galeria"] },
          { file: "173. The Nutcracker, Op. 71, Act I_ The Decoration of the Christmas Tree.mp3", title: "The Nutcracker - Christmas Tree", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["navidad", "index"] },
          { file: "174. The Nutcracker, Op. 71, Act I_ March.mp3", title: "The Nutcracker - March", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["navidad", "index"] },
          { file: "175. The Nutcracker, Op. 71, Act I_ Children's Galop and Entry of the Parents.mp3", title: "The Nutcracker - Galop", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["navidad"] },
          { file: "176. The Nutcracker, Op. 71, Act I_ Arrival of Drosselmeyer.mp3", title: "The Nutcracker - Arrival of Drosselmeyer", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "epico", instrumentacion: "orquestal", sections: ["navidad"] },
          { file: "177. The Nutcracker, Op. 71, Act I_ Grandfather's Dance.mp3", title: "The Nutcracker - Grandfather's Dance", artist: "P.I. Tchaikovsky", tempo: "rapida", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["navidad"] },
          { file: "178. The Sleeping Beauty, Op. 66a_ IV. Panorama.mp3", title: "The Sleeping Beauty - Panorama", artist: "P.I. Tchaikovsky", tempo: "lenta", caracter: "contemplativo", instrumentacion: "orquestal", sections: ["oraciones"] },
          { file: "179. The Nutcracker, Op. 71, Act I_ Clara and the Nutcracker.mp3", title: "The Nutcracker - Clara and the Nutcracker", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["navidad"] },
          { file: "180. The Sleeping Beauty, Op. 66a_ V. Waltz.mp3", title: "The Sleeping Beauty - Waltz", artist: "P.I. Tchaikovsky", tempo: "moderada", caracter: "jubiloso", instrumentacion: "orquestal", sections: ["galeria", "index"] },
          { file: "78. The Magnificent Seven - Main Title.mp3", title: "The Magnificent Seven - Main Title", artist: "Elmer Bernstein", tempo: "procesional", caracter: "epico", instrumentacion: "orquestal", sections: ["index", "noticias"] },
          { file: "79. The Good, The Bad and The Ugly - Il Buono, Il Brutto, Il Cattivo (Titles).mp3", title: "The Good, The Bad and The Ugly", artist: "Ennio Morricone", tempo: "rapida", caracter: "epico", instrumentacion: "orquestal", sections: ["noticias"] },
          { file: "80. The John Dunbar Theme (From _Dance with Wolves.mp3", title: "The John Dunbar Theme", artist: "John Barry", tempo: "lenta", caracter: "epico", instrumentacion: "orquestal", sections: ["oraciones", "quienes-somos"] },
          { file: "181. Organ Concerto No. 13 in F Major_ _Cuckoo and the Nightingale_ HWV 295_ 5. Allegro - George Frideric Handel.mp3", title: "Organ Concerto No. 13 - Allegro", artist: "G.F. Handel", tempo: "moderada", caracter: "jubiloso", instrumentacion: "organo", sections: ["misa", "oraciones"] },
          { file: "182. Organ Concerto No. 13 in F Major_ _Cuckoo and the Nightingale_ HWV 295_ 3. Organo ad libitum_ Aria _ Passpied _Telemann_ - George Frideric Handel.mp3", title: "Organ Concerto No. 13 - Aria", artist: "G.F. Handel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "organo", sections: ["oraciones"] },
          { file: "183. Organ Concerto No. 13 in F Major_ _Cuckoo and the Nightingale_ HWV 295_ 2. Adagio - George Frideric Handel.mp3", title: "Organ Concerto No. 13 - Adagio", artist: "G.F. Handel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "organo", sections: ["oraciones", "hora-de-la-misericordia"] },
          { file: "184. Organ Concerto No. 13 in F Major_ HWV 295 _The Cuckoo and the Nightingale__ 4. Larghetto - George Frideric Handel.mp3", title: "Organ Concerto No. 13 - Larghetto", artist: "G.F. Handel", tempo: "lenta", caracter: "contemplativo", instrumentacion: "organo", sections: ["oraciones"] },
          { file: "185. Handel_ Organ Concerto No. 13 in F Major_ HWV 295 _The Cuckoo and the Nightingale__ II. Allegro - George Frideric Handel.mp3", title: "Organ Concerto No. 13 - Allegro II", artist: "G.F. Handel", tempo: "moderada", caracter: "jubiloso", instrumentacion: "organo", sections: ["misa", "noticias"] }
        ].map(convertTrack)
      }
    ];
  }

  function getTrackBySection(sectionName) {
    const categories = getCategories();
    const matchingTracks = [];
    
    categories.forEach(cat => {
      cat.tracks.forEach(track => {
        if (track.sections.includes(sectionName)) {
          matchingTracks.push(track);
        }
      });
    });
    
    return matchingTracks;
  }

  function getAllSections() {
    const sections = new Set();
    const categories = getCategories();
    
    categories.forEach(cat => {
      cat.tracks.forEach(track => {
        track.sections.forEach(section => sections.add(section));
      });
    });
    
    return Array.from(sections).sort();
  }

  return {
    version: "5.0",
    lastUpdated: "2026-04-03",
    totalTracks: 0,
    getCategories: getCategories,
    getTrackBySection: getTrackBySection,
    getAllSections: getAllSections
  };
})();

AudioCatalog.totalTracks = AudioCatalog.getCategories().reduce((acc, cat) => acc + cat.tracks.length, 0);
console.log('🎵 AudioCatalog cargado con', AudioCatalog.totalTracks, 'canciones');