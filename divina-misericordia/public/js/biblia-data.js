// Datos de la Biblia - libros, capítulos y versículos
const bibliaData = {
  nt: {
    nombre: "Nuevo Testamento",
    libros: [
      { nombre: "Mateo", capitulos: 28, abreviado: "Mt" },
      { nombre: "Marcos", capitulos: 16, abreviado: "Mc" },
      { nombre: "Lucas", capitulos: 24, abreviado: "Lc" },
      { nombre: "Juan", capitulos: 21, abreviado: "Jn" },
      { nombre: "Hechos", capitulos: 28, abreviado: "Hch" },
      { nombre: "Romanos", capitulos: 16, abreviado: "Rom" },
      { nombre: "1 Corintios", capitulos: 16, abreviado: "1 Cor" },
      { nombre: "2 Corintios", capitulos: 13, abreviado: "2 Cor" },
      { nombre: "Gálatas", capitulos: 6, abreviado: "Gal" },
      { nombre: "Efesios", capitulos: 6, abreviado: "Ef" },
      { nombre: "Filipenses", capitulos: 4, abreviado: "Flp" },
      { nombre: "Colosenses", capitulos: 4, abreviado: "Col" },
      { nombre: "1 Tesalonicenses", capitulos: 5, abreviado: "1 Tes" },
      { nombre: "2 Tesalonicenses", capitulos: 3, abreviado: "2 Tes" },
      { nombre: "1 Timoteo", capitulos: 6, abreviado: "1 Tim" },
      { nombre: "2 Timoteo", capitulos: 4, abreviado: "2 Tim" },
      { nombre: "Tito", capitulos: 3, abreviado: "Tit" },
      { nombre: "Filemón", capitulos: 1, abreviado: "Flm" },
      { nombre: "Hebreos", capitulos: 13, abreviado: "Heb" },
      { nombre: "Santiago", capitulos: 5, abreviado: "Sant" },
      { nombre: "1 Pedro", capitulos: 5, abreviado: "1 Ped" },
      { nombre: "2 Pedro", capitulos: 3, abreviado: "2 Ped" },
      { nombre: "1 Juan", capitulos: 5, abreviado: "1 Jn" },
      { nombre: "2 Juan", capitulos: 1, abreviado: "2 Jn" },
      { nombre: "3 Juan", capitulos: 1, abreviado: "3 Jn" },
      { nombre: "Judas", capitulos: 1, abreviado: "Judas" },
      { nombre: "Apocalipsis", capitulos: 22, abreviado: "Ap" }
    ]
  },
  at: {
    nombre: "Antiguo Testamento",
    libros: [
      { nombre: "Génesis", capitulos: 50, abreviado: "Gén" },
      { nombre: "Éxodo", capitulos: 40, abreviado: "Éx" },
      { nombre: "Levítico", capitulos: 27, abreviado: "Lev" },
      { nombre: "Números", capitulos: 36, abreviado: "Núm" },
      { nombre: "Deuteronomio", capitulos: 34, abreviado: "Dt" },
      { nombre: "Josué", capitulos: 24, abreviado: "Jos" },
      { nombre: "Jueces", capitulos: 21, abreviado: "Jue" },
      { nombre: "Rut", capitulos: 4, abreviado: "Rut" },
      { nombre: "1 Samuel", capitulos: 31, abreviado: "1 Sam" },
      { nombre: "2 Samuel", capitulos: 24, abreviado: "2 Sam" },
      { nombre: "1 Reyes", capitulos: 22, abreviado: "1 Re" },
      { nombre: "2 Reyes", capitulos: 25, abreviado: "2 Re" },
      { nombre: "1 Crónicas", capitulos: 29, abreviado: "1 Crón" },
      { nombre: "2 Crónicas", capitulos: 36, abreviado: "2 Crón" },
      { nombre: "Esdras", capitulos: 10, abreviado: "Esd" },
      { nombre: "Nehemías", capitulos: 13, abreviado: "Neh" },
      { nombre: "Tobías", capitulos: 14, abreviado: "Tob" },
      { nombre: "Judit", capitulos: 16, abreviado: "Jdt" },
      { nombre: "Ester", capitulos: 10, abreviado: "Est" },
      { nombre: "Job", capitulos: 42, abreviado: "Job" },
      { nombre: "Salmos", capitulos: 150, abreviado: "Sal" },
      { nombre: "Proverbios", capitulos: 31, abreviado: "Prov" },
      { nombre: "Eclesiastés", capitulos: 12, abreviado: "Ecl" },
      { nombre: "Cantares", capitulos: 8, abreviado: "Cant" },
      { nombre: "Sabiduría", capitulos: 19, abreviado: "Sab" },
      { nombre: "Eclesiástico", capitulos: 51, abreviado: "Eclo" },
      { nombre: "Isaías", capitulos: 66, abreviado: "Is" },
      { nombre: "Jeremías", capitulos: 52, abreviado: "Jer" },
      { nombre: "Lamentaciones", capitulos: 5, abreviado: "Lam" },
      { nombre: "Baruc", capitulos: 6, abreviado: "Bar" },
      { nombre: "Ezequiel", capitulos: 48, abreviado: "Ez" },
      { nombre: "Daniel", capitulos: 14, abreviado: "Dan" },
      { nombre: "Oseas", capitulos: 14, abreviado: "Os" },
      { nombre: "Joel", capitulos: 3, abreviado: "Jl" },
      { nombre: "Amós", capitulos: 9, abreviado: "Am" },
      { nombre: "Abdías", capitulos: 1, abreviado: "Abd" },
      { nombre: "Jonás", capitulos: 4, abreviado: "Jon" },
      { nombre: "Miqueas", capitulos: 7, abreviado: "Miq" },
      { nombre: "Nahúm", capitulos: 3, abreviado: "Nah" },
      { nombre: "Habacuc", capitulos: 3, abreviado: "Hab" },
      { nombre: "Sofonías", capitulos: 3, abreviado: "Sof" },
      { nombre: "Ageo", capitulos: 2, abreviado: "Ag" },
      { nombre: "Zacarías", capitulos: 14, abreviado: "Zac" },
      { nombre: "Malaquías", capitulos: 4, abreviado: "Mal" }
    ]
  }
};

// Exportar para uso global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = bibliaData;
}
