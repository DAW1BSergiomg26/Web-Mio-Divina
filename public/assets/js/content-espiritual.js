/**
 * Contenido Espiritual - Cápsulas de reflexión
 * Inspirado en la espiritualidad de Santa Faustina Kowalska.
 * 
 * Uso: Acceder mediante ContenidoEspiritual.temas[nombreTema]
 */
const ContenidoEspiritual = {
  temas: {
    confianza: [
      "La confianza es el puente entre nuestra miseria y el océano de la Misericordia divina.",
      "Cuando sientas que todo se oscurece, repite desde el fondo del alma: Jesús, en Ti confío.",
      "No temas al mañana; el mismo Dios que te cuida hoy, te cuidará mañana y siempre.",
      "El abandono en las manos de Dios es el descanso más seguro para el alma cansada.",
      "Jesús nos pide sencillez. Confiar es simplemente dejarle actuar."
    ],
    misericordia: [
      "La Misericordia no es un premio para los perfectos, es el refugio de los que se saben necesitados.",
      "Cada latido de tu corazón es una invitación de Jesús a descansar en su amor misericordioso.",
      "La Misericordia es el rostro de Dios que más desea encontrarte hoy.",
      "No busques entender el misterio del dolor, busca el abrazo del Misericordioso.",
      "Eres amado no por lo que haces, sino por Aquel que te ha creado."
    ],
    sufrimiento: [
      "Todo sufrimiento ofrecido es una gota de agua que calma la sed de almas lejanas.",
      "Unidos a la Cruz, nuestros dolores adquieren un valor redentor infinito.",
      "Jesús no elimina el dolor, pero lo transfigura en amor cuando se lo entregamos.",
      "En el silencio de la prueba, Dios está esculpiendo una belleza que no ves todavía.",
      "No cargues solo tu cruz, permite que Jesús la lleve contigo."
    ],
    esperanza: [
      "El amanecer siempre sigue a la noche más oscura; la Resurrección es nuestra certeza.",
      "Ninguna situación es definitiva si la ponemos en manos del Señor de la Vida.",
      "La esperanza es ver la luz de Dios incluso cuando los ojos solo ven sombras.",
      "Tu historia, unida a la de Cristo, es una historia de salvación.",
      "La paz que el mundo no puede dar, el Señor la ofrece a quienes esperan en Él."
    ]
  },

  // Método auxiliar para obtener una cápsula aleatoria
  obtenerReflexion: function(tema) {
    const categoria = this.temas[tema] || this.temas.confianza;
    return categoria[Math.floor(Math.random() * categoria.length)];
  }
};

// Exportar para uso global si estamos en entorno Node o exponer al window
if (typeof window !== 'undefined') {
  window.ContenidoEspiritual = ContenidoEspiritual;
}
