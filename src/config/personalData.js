/**
 * Datos personales y narrativos extraidos de references/documents/texto_extraido.txt
 * NO INVENTAR NADA - Solo usar lo extraido fielmente de los PDFs
 */

export const personalData = {
  // Informacion principal
  title: "Nuestra historia todavia tiene paginas por escribir",
  dedication: "Para Yaheyli, mi nina.\nDe Victor, alguien que todavia tiene muchisimas cosas bonitas que quisiera vivir contigo",

  // Personajes
  characters: {
    victor: {
      name: "Victor",
      height: 182,
      location: "Panama"
    },
    yaheyli: {
      name: "Yaheyli",
      height: 163,
      location: "El Paso, Texas"
    }
  },

  // Frases iconicas extraidas
  iconicPhrases: [
    "Nuestra historia todavia tiene paginas por escribir",
    "Tu eres mi todo",
    "Te puedo decir algo lindo?",
    "Te amo",
    "VA PORFI, INTENTALO...",
    "ESTA BIEN...",
    "PULSA LA CARTA",
    "CANCIONES QUE ME RECUERDAN A TI",
    "Una de estas pokeballs contiene tu regalo. Descubre cual!",
    "OH NO! POKEBALL INCORRECTA. VUELVE A INTENTARLO...",
    "TRY AGAIN",
    "FELICIDADES! HAS ENCONTRADO LA BOLA CORRECTA. PULSA EN ELLA!",
    "TU MAYOR SUERTE <3 444",
    "<3 Te escojo a ti...",
    "POR ULTIMO PERO MENOS IMPORTANTE...",
    "TIENE NORMAS: 1. UN SOLO USO. 2. SE PUEDEN USAR CUANDO DESEES.",
    "ACEPTAR",
    "DENEGAR",
    "ESPERO TE HAYA GUSTADO, YAHEYLI",
    "VOLVER A JUGAR",
    "GALERIA DE RECUERDOS"
  ],

  // Mensaje central del libro (extraido textualmente)
  centralMessage: `No quiero que pienses que solamente recuerdo los momentos bonitos ni que olvido las veces que nos equivocamos. Recuerdo ambas cosas, porque nuestra historia no fue perfecta, pero para mi fue importante y significo muchisimo.
Se que amar tambien significa reconocer cuando uno se equivoca, aprender, cambiar y demostrarlo.
No quiero prometerte que nunca volveremos a tener dificultades. Quiero prometerte que estoy dispuesto a trabajar en mi, aprender a escucharte y hacer las cosas mejor.
Todavia tengo suenos que alguna vez imagine contigo. Todavia hay lugares que quisiera conocer a tu lado, abrazos que quisiera darte y recuerdos que me encantaria construir.
No quiero obligarte a sentir lo mismo que yo ni pedirte que ignores lo que has sentido.
Quiero que sepas que mi intencion es sincera y que, si algun dia ambos queremos intentarlo nuevamente, me gustaria hacerlo de una manera mucho mas bonita y madura.
Porque para mi, Yaheyli, nuestra historia todavia tiene paginas que me gustaria escribir contigo.`,

  // Canciones extraidas de los PDFs
  songs: [
    {
      id: 1,
      title: "Ebrio de Amor (En Vivo)",
      artist: "Alta Consigna",
      description: "Nuestra cancion",
      file: null // No tenemos el archivo, solo referencia
    },
    {
      id: 2,
      title: "No One Noticed (Extended Spanish)",
      artist: "The Marias",
      description: "Nuestra segunda cancion",
      file: "No One Noticed (Extended Spanish).mp3"
    },
    {
      id: 3,
      title: "Lejos De Ti",
      artist: "The Marias",
      description: "",
      file: "The Marias - Lejos De Ti.mp3"
    },
    {
      id: 4,
      title: "Nobody New",
      artist: "The Marias",
      description: "",
      file: "The Marias - Nobody New.mp3"
    },
    {
      id: 5,
      title: "Sienna",
      artist: "The Marias",
      description: "",
      file: "The Marias - Sienna (Visualizer).mp3"
    }
  ],

  // Recuerdos y referencias extraidas de los PDFs
  memories: {
    photos: [
      "foto_0001.png", "foto_0002.png", "foto_0003.png", "foto_0004.png",
      "foto_0005.png", "foto_0006.png", "foto_0007.png", "foto_0008.png",
      "foto_0009.png", "foto_0010.png", "foto_0011.png", "foto_0012.png",
      "foto_0013.png", "foto_0014.png", "foto_0015.png", "foto_0016.png",
      "foto_0017.png", "foto_0018.png", "foto_0019.png", "foto_0020.png",
      "foto_0021.png", "foto_0022.png", "foto_0023.png", "foto_0024.png",
      "foto_0025.png", "foto_0026.png", "foto_0027.png", "foto_0028.png",
      "foto_0029.png", "foto_0030.png", "foto_0031.png", "foto_0032.png",
      "foto_0033.png", "foto_0034.png", "foto_0035.png", "foto_0036.png",
      "foto_0037.png", "foto_0038.png", "foto_0039.png", "foto_0040.png",
      "foto_0041.png", "foto_0042.png", "foto_0043.png"
    ],
    references: [
      "nuestra cancion",
      "nuestra segunda cancion",
      "jugando con mateo",
      "Ya 8 meses con la mujer que mas he amado en mi vida",
      "182 cm y 163 cm: diecinueve centimetros de diferencia",
      "Te puedo decir algo lindo?",
      "Te amo",
      "Tu eres mi todo",
      "Ella queria jugar Fortnite. Entonces jugamos Fortnite",
      "Quien es el bebe tikito de mami?",
      "Viaje desde Panama hasta El Paso",
      "Pasar juntos la Navidad y el Ano Nuevo",
      "Celebrar nuestro aniversario, alrededor del 25 de diciembre",
      "Una futura boda, una familia, mascotas y una casa",
      "Viajes"
    ]
  },

  // Regalos del Hub (Escena 3)
  gifts: [
    {
      id: 1,
      key: "letter",
      name: "Sobre lacrado",
      description: "Carta sincera de Victor para Yaheyli",
      icon: "envelope",
      completed: false,
      scene: 4
    },
    {
      id: 2,
      key: "music",
      name: "Disco CD arcoiris",
      description: "Canciones que me recuerdan a ti (The Marias + Alta Consigna)",
      icon: "cd",
      completed: false,
      scene: 5
    },
    {
      id: 3,
      key: "pokeball",
      name: "Poke Ball",
      description: "Minijuego de Pokeballs con carta coleccionable Pokemon",
      icon: "pokeball",
      completed: false,
      scene: 6
    },
    {
      id: 4,
      key: "ticket",
      name: "Ticket verde",
      description: "Buho guia y 6 tickets canjeables dorados",
      icon: "ticket",
      completed: false,
      scene: 7
    }
  ],

  // Tickets canjeables (Escena 7)
  tickets: [
    {
      id: 1,
      text: "Vale por jugar Fortnite juntos",
      redeemed: false
    },
    {
      id: 2,
      text: "Vale por ese abrazo pendiente en El Paso",
      redeemed: false
    },
    {
      id: 3,
      text: "Vale por escuchar nuestras canciones",
      redeemed: false
    },
    {
      id: 4,
      text: "Vale por una cita sin pantallas",
      redeemed: false
    },
    {
      id: 5,
      text: "Vale por escucharte siempre con calma",
      redeemed: false
    },
    {
      id: 6,
      text: "Vale por escribir una nueva pagina",
      redeemed: false
    }
  ],

  // Carta Pokemon (Escena 6 - resultado final)
  pokemonCard: {
    title: "TU MAYOR SUERTE <3 444",
    attackName: "<3 Te escojo a ti...",
    attackDescription: "Nuestra historia todavia tiene paginas por escribir",
    imageRef: "carta_pokemon_vy.png",
    hp: "inf",
    type: "AMOR",
    rarity: "HOLOGRAFICA"
  },

  // Configuracion de escenas
  scenes: {
    1: {
      id: "intro",
      name: "Portada/Introduccion",
      background: "sunset_lake",
      music: "main_theme",
      duration: 4000
    },
    2: {
      id: "deny",
      name: "Denegar - Gatito",
      background: "temple_night",
      music: "sad_theme",
      duration: 6000
    },
    3: {
      id: "hub",
      name: "Hub - Seleccion de Regalos",
      background: "forest_night",
      music: "main_theme",
      duration: 0 // Sin limite
    },
    4: {
      id: "letter",
      name: "Regalo 1: Carta",
      background: "meadow_sunset",
      music: "main_theme",
      duration: 0
    },
    5: {
      id: "music",
      name: "Regalo 2: Musica",
      background: "lake_sunset",
      music: "playlist",
      duration: 0
    },
    6: {
      id: "pokeballs",
      name: "Regalo 3: Pokeballs",
      background: "flower_field",
      music: "playful_theme",
      duration: 0
    },
    7: {
      id: "tickets",
      name: "Regalo 4: Buho y Tickets",
      background: "forest_night_owl",
      music: "gentle_theme",
      duration: 0
    },
    8: {
      id: "ending",
      name: "Desenlace y Galeria",
      background: "sunny_meadow",
      music: "ending_theme",
      duration: 0
    }
  },

  // Configuracion del juego
  gameConfig: {
    canvasWidth: 480,
    canvasHeight: 270,
    targetFPS: 60,
    pixelScale: 3,
    autoSave: true,
    saveKey: "yaheyli_game_save"
  }
};

export default personalData;