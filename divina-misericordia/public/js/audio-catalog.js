const AudioCatalog = (function() {
  function convertTrack(track) {
    return {
      title: track.title,
      artist: track.artist,
      src: 'mp3/' + track.file
    };
  }

  function getCategories() {
    return [
      {
        category: "🙏 Himnos de Devoción",
        icon: "🙏",
        tracks: [
          { file: "00. Ave Maria.mp3", title: "Ave Maria", artist: "Canto Gregoriano" },
          { file: "00. Jesus Paid It All.mp3", title: "Jesus Paid It All", artist: "Himno Evangélico" },
          { file: "00. Santa Faustina, Himno Moderno.mp3", title: "Santa Faustina - Himno", artist: "Dedicación" },
          { file: "01. Jesus is all the world to me.mp3", title: "Jesus is All the World", artist: "Himno Tradicional" },
          { file: "02. More About Jesus.mp3", title: "More About Jesus", artist: "Himno Evangélico" },
          { file: "03. I Have Decided to Follow Jesus.mp3", title: "I Have Decided to Follow Jesus", artist: "Himno Tradicional" },
          { file: "04. Sweet Hour of Prayer.mp3", title: "Sweet Hour of Prayer", artist: "Himno de Oración" },
          { file: "05. A New Name in Glory - Instrumental.mp3", title: "A New Name in Glory", artist: "Himno Celebración" }
        ].map(convertTrack)
      },
      {
        category: "🎻 Música Barroca Clásica",
        icon: "🎻",
        tracks: [
          { file: "05. Brandenburg Concerto No. 1 in F Major, BWV 1046_ I.mp3", title: "Brandenburg Concerto No. 1", artist: "J.S. Bach" },
          { file: "01. Concierto-de-Branderburgo-n.1-BWV-1046-en-Fa-mayor-Adagio.mp3", title: "Concierto de Brandeburgo No. 1", artist: "J.S. Bach" },
          { file: "03. Concierto-de-Branderburgo-n.3-BWV-1048-en-Sol-Mayor-Allegro-moderato.mp3", title: "Concierto de Brandeburgo No. 3", artist: "J.S. Bach" },
          { file: "06. Serse, HWV 40_ Largo _Ombra mai fu.mp3", title: "Largo 'Ombra mai fu' (Xerxes)", artist: "G.F. Handel" },
          { file: "09. J.S. Bach_ J.S. Bach_ Orchestral Suite No. 3 in D Major, BWV 1068_ 2.mp3", title: "Air (Suite No. 3)", artist: "J.S. Bach" },
          { file: "07. Aria de la Suite no. 3 en Re Mayor, BWV 1068.mp3", title: "Aria de la Suite No. 3", artist: "J.S. Bach" },
          { file: "08. Handel _ Orch. Hale_ Keyboard Suite No. 4 in D Minor, HWV 437_ III. Sarabande.mp3", title: "Sarabande (Keyboard Suite)", artist: "G.F. Handel" },
          { file: "01. Brockes Passion, HWV 48_ No. 1, Sinfonie.mp3", title: "Sinfonie (Brockes Passion)", artist: "G.F. Handel" }
        ].map(convertTrack)
      },
      {
        category: "🕊️ Música de Contemplación",
        icon: "🕊️",
        tracks: [
          { file: "14. Pachelbel Canon in D.mp3", title: "Canon in D (Pachelbel)", artist: "Pachelbel" },
          { file: "15. Canon in D.mp3", title: "Canon in D", artist: "Pachelbel" },
          { file: "00. Violin Sonata No. 3 in C Major, BWV 1005 (Arr. for Piano by Víkingur Ólafsson)_ I. Adagio.mp3", title: "Violin Sonata No. 3", artist: "J.S. Bach" },
          { file: "11. Swan Lake, Op. 20a_ I. Scène.mp3", title: "Swan Lake - Scène", artist: "P.I. Tchaikovsky" },
          { file: "12. Shades and Shadows.mp3", title: "Shades and Shadows", artist: "Ambient" },
          { file: "13. The Essence.mp3", title: "The Essence", artist: "Ambient" },
          { file: "16. Sonata violino solo representativa in A Major_ III. Allemande.mp3", title: "Sonata Violino Solo - Allemande", artist: "H.I.F. Biber" },
          { file: "17. Sonata quarta in D Major_ I. Ciaccona.mp3", title: "Sonata Quarta - Ciaccona", artist: "D. Castello" },
          { file: "18. Violin Sonata No. 1 in D Minor_ VI. Aria.mp3", title: "Violin Sonata No. 1 - Aria", artist: "J.S. Bach" }
        ].map(convertTrack)
      },
      {
        category: "✨ Música de Gloria",
        icon: "✨",
        tracks: [
          { file: "10. Spring (La Primavera) Op.8 No.1 E Major_ Allegro.mp3", title: "La Primavera (Spring)", artist: "A. Vivaldi" },
          { file: "19. Concerto 2 in D Major, Op. 7_ I. Adagio.mp3", title: "Concerto in D Major - Adagio", artist: "A. Vivaldi" },
          { file: "20. Canzona undecima a due canti _detta la plettenberger.mp3", title: "Canzona Undecima", artist: "G. Gabrieli" },
          { file: "21. Les plaisirs_ Sarabande.mp3", title: "Les Plaisirs - Sarabande", artist: "M. Marais" },
          { file: "22. 5e livre de viole_ Chaconne.mp3", title: "5e Livre de Viole - Chaconne", artist: "M. Marais" },
          { file: "23. Concerto Grosso in D Major, Op. 1, No. 5_ III. Largo.mp3", title: "Concerto Grosso - Largo", artist: "A. Corelli" }
        ].map(convertTrack)
      },
      {
        category: "🎬 Música Cinematográfica Sagrada",
        icon: "🎬",
        tracks: [
          { file: "06. Braveheart-End Titles.mp3", title: "Braveheart - End Titles", artist: "James Horner" },
          { file: "00 .Braveheart-End Titles.mp3", title: "Braveheart - End Titles (Alt)", artist: "James Horner" },
          { file: "27. Now We Are Free (Gladiator) - Instrumental Version.mp3", title: "Now We Are Free (Gladiator)", artist: "Hans Zimmer" },
          { file: "28. Now We Are Free (from _Gladiator_) - Piano Solo Version.mp3", title: "Now We Are Free - Piano", artist: "Hans Zimmer" },
          { file: "29. Tennessee.mp3", title: "Tennessee", artist: "Hans Zimmer" },
          { file: "30. Honor Him.mp3", title: "Honor Him", artist: "Hans Zimmer" },
          { file: "31. The Kiss.mp3", title: "The Kiss", artist: "James Horner" },
          { file: "32. Elysium.mp3", title: "Elysium", artist: "James Horner" },
          { file: "33. Evenstar.mp3", title: "Evenstar", artist: "Howard Shore" },
          { file: "55. A Gift Of A Thistle.mp3", title: "A Gift of a Thistle", artist: "James Horner" },
          { file: "56. For The Love Of A Princess.mp3", title: "For the Love of a Princess", artist: "James Horner" },
          { file: "57. Murron's Burial.mp3", title: "Murron's Burial", artist: "James Horner" },
          { file: "58. Revenge [Braveheart - Original Sound Track].mp3", title: "Revenge (Braveheart)", artist: "James Horner" },
          { file: "59. The Battle Of Stirling [Braveheart - Original Sound Track].mp3", title: "The Battle of Stirling", artist: "James Horner" },
          { file: "60. The Princess Pleads For Wallace's Life.mp3", title: "The Princess Pleads for Wallace", artist: "James Horner" },
          { file: "61.The Secret Wedding.mp3", title: "The Secret Wedding", artist: "James Horner" }
        ].map(convertTrack)
      },
      {
        category: "⚔️ Música Épica y Aventura",
        icon: "⚔️",
        tracks: [
          { file: "34. Heart of Courage.mp3", title: "Heart of Courage", artist: "Two Steps From Hell" },
          { file: "35. Day One (Interstellar Theme).mp3", title: "Day One (Interstellar)", artist: "Hans Zimmer" },
          { file: "36. Becoming Human.mp3", title: "Becoming Human", artist: "Hans Zimmer" },
          { file: "37. Main Title.mp3", title: "Main Title", artist: "Hans Zimmer" },
          { file: "38.He's a Pirate.mp3", title: "He's a Pirate", artist: "Hans Zimmer" },
          { file: "49. Aphelion.mp3", title: "Aphelion", artist: "Hans Zimmer" },
          { file: "50. Winter Is Here.mp3", title: "Winter is Here", artist: "Ramin Djawadi" },
          { file: "42. No Sacrifice, No Victory.mp3", title: "No Sacrifice, No Victory", artist: "Steve Jablonsky" },
          { file: "41. Pact Sworn in Blood.mp3", title: "Pact Sworn in Blood", artist: "Inon Zur" },
          { file: "44. Promentory.mp3", title: "Promentory (Last of the Mohicans)", artist: "Trevor Jones" },
          { file: "46. Blackheart.mp3", title: "Blackheart", artist: "Inon Zur" },
          { file: "47. Goodbye Brother.mp3", title: "Goodbye Brother", artist: "Inon Zur" },
          { file: "48. Optimus.mp3", title: "Optimus", artist: "Steve Jablonsky" }
        ].map(convertTrack)
      },
      {
        category: "🏰 El Señor de los Anillos",
        icon: "🏰",
        tracks: [
          { file: "39. Concerning Hobbits.mp3", title: "Concerning Hobbits", artist: "Howard Shore" },
          { file: "40. The Way Home.mp3", title: "The Way Home", artist: "Howard Shore" },
          { file: "43. This Land.mp3", title: "This Land", artist: "Howard Shore" },
          { file: "45. The Grey Havens (feat. Sir James Galway).mp3", title: "The Grey Havens", artist: "Howard Shore" },
          { file: "51. El señor de los anillos (Suite) (La comunidad del anillo).mp3", title: "Suite Señor de los Anillos", artist: "Howard Shore" },
          { file: "52. The Shire.mp3", title: "The Shire", artist: "Howard Shore" },
          { file: "53. The Council of Elrond (feat. _Aniron_) [Theme for Aragorn and Arwen].mp3", title: "The Council of Elrond", artist: "Howard Shore" },
          { file: "54. The Bridge Of Khazad-Dum (From _The Lord Of The Rings_).mp3", title: "The Bridge of Khazad-dûm", artist: "Howard Shore" }
        ].map(convertTrack)
      },
      {
        category: "🦁 Crónicas de Narnia",
        icon: "🦁",
        tracks: [
          { file: "62. A Narnia Lullaby (From _The Chronicles of Narnia_) - Piano Version.mp3", title: "A Narnia Lullaby (Piano)", artist: "Harry Gregson-Williams" },
          { file: "63. A Narnia Lullaby.mp3", title: "A Narnia Lullaby", artist: "Harry Gregson-Williams" },
          { file: "64. Only The Beginning of The Adventure.mp3", title: "Only the Beginning", artist: "Harry Gregson-Williams" },
          { file: "65. Aslan Appears.mp3", title: "Aslan Appears", artist: "Harry Gregson-Williams" },
          { file: "66. Aslan's Breath.mp3", title: "Aslan's Breath", artist: "Harry Gregson-Williams" },
          { file: "67. Raid on the Castle - Score.mp3", title: "Raid on the Castle", artist: "Harry Gregson-Williams" },
          { file: "68. The Battle.mp3", title: "The Battle", artist: "Harry Gregson-Williams" },
          { file: "69. The Kings and Queens of Old - Score.mp3", title: "The Kings and Queens of Old", artist: "Harry Gregson-Williams" }
        ].map(convertTrack)
      },
      {
        category: "❤️ Divina Misericordia",
        icon: "❤️",
        tracks: [
          { file: "24. Vía Crucis - Para Orar.mp3", title: "Vía Crucis - Para Orar", artist: "Devoción" },
          { file: "25. Novena Divine Inspiration.mp3", title: "Novena Divine Inspiration", artist: "Oración" },
          { file: "26. Hora de la Coronilla de la Divina Misericordia - Instrumental.mp3", title: "Hora de la Coronilla", artist: "Divina Misericordia" },
          { file: "00. Salve Regina.mp3", title: "Salve Regina", artist: "Canto Gregoriano" },
          { file: "00. Himno a San José.mp3", title: "Himno a San José", artist: "Dedicación" },
          { file: "00. Messiah, HWV 56, Pt. 2_ No. 44, Chorus. Hallelujah, for the Lord God Omnipotent Reigneth.mp3", title: "Hallelujah (Messiah)", artist: "G.F. Handel" }
        ].map(convertTrack)
      }
    ];
  }

  return {
    version: "1.0",
    lastUpdated: "2026-03-31",
    totalTracks: 70,
    getCategories: getCategories
  };
})();
