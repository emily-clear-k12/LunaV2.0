/* Plan C world-page registry (shared by the dashboard and every world page).
   To add a world: drop its clip in <slug>/assets/ (world.mp4, poster.jpg = first frame, hold.jpg = hold frame),
   copy windswept-ribbon-highlands/index.html to <slug>/index.html, and add an entry here.
   color/icon: the dashboard bookmark colour + icon (module pill). hold: seconds into the clip to stop on (null = play to the end). Hotspots are 1366x768 stage px (x, y = crystal centre, w, h). */
window.POPUP_WORLD_PAGES = {
  "windswept-ribbon-highlands": {
    module: 5, name: "Windswept Ribbon Highlands", ribbon: "highlands", color: "#c0414f", icon: "🪁",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,
    hotspots: [
      { x: 230,  y: 470, w: 84, h: 160 },   // Lesson 1: big crystal on the stump beside Astra
      { x: 885,  y: 580, w: 66, h: 110 },   // Lesson 2: front crystal by the path
      { x: 1207, y: 393, w: 64, h: 112 },   // Lesson 3: right ledge
      { x: 1049, y: 207, w: 58, h: 96 }     // Lesson 4: top, under the windmill tree
    ]
  },
  "thunderpeak-aerie": {
    module: 3, name: "Thunderpeak Aerie", ribbon: "thunderpeak", color: "#4f7f3c", icon: "⚡",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,
    hotspots: [
      { x: 483,  y: 467, w: 60, h: 84 },    // Lesson 1: left crystal by the elk
      { x: 724,  y: 587, w: 76, h: 116 },   // Lesson 2: big front crystal on the path
      { x: 1038, y: 263, w: 52, h: 76 },    // Lesson 3: top of the stone tower
      { x: 1181, y: 480, w: 64, h: 90 }     // Lesson 4: right ledge
    ]
  },
  "clockwork-gearworks-city": {
    module: 4, name: "Clockwork Gearworks City", ribbon: "clockwork", color: "#8a5426", icon: "⚙️",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,   // clip trimmed to 7.63s: Astra looks up smiling (later frames look down at the book)
    hotspots: [   // Emily's clip shows 4 crystals; Module 4 expects 5
      { x: 167, y: 496, w: 54, h: 88 },    // Lesson 1: left, on the gear pedestal
      { x: 424, y: 571, w: 74, h: 108 },   // Lesson 2: big front crystal
      { x: 820, y: 540, w: 48, h: 74 },    // Lesson 3: by the stream, near the pod
      { x: 514, y: 157, w: 36, h: 56 }     // Lesson 4: top of the clocktower city
    ]
  },
  "desert-mirage-bazaar": {
    module: 2, name: "Desert Mirage Bazaar", ribbon: "desert", color: "#7a45b5", icon: "🏜️",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,   // short 3.58s clip; Astra smiling, eyes open at the end
    hotspots: [
      { x: 215, y: 554, w: 60, h: 88 },    // Lesson 1: left pedestal
      { x: 535, y: 627, w: 68, h: 88, below: true },   // Lesson 2: big front crystal
      { x: 607, y: 531, w: 46, h: 66 },    // Lesson 3: in the oasis pool
      { x: 387, y: 496, w: 46, h: 66 },    // Lesson 4: by the market stalls
      { x: 650, y: 451, w: 42, h: 60 },    // Lesson 5: on the ledge above the pool
      { x: 626, y: 140, w: 40, h: 60 }     // Lesson 6: top of the golden dome palace
    ]
  },
  "candyleaf-grove": {
    module: 6, name: "Candyleaf Grove", ribbon: "candyleaf", color: "#d8742a", icon: "🍬",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,   // blink at 8.25s; end frame eyes open, smiling
    hotspots: [
      { x: 503, y: 324, w: 50, h: 82 },    // Lesson 1: left of the bridges
      { x: 926, y: 440, w: 74, h: 112 },   // Lesson 2: big front-right crystal
      { x: 794, y: 327, w: 50, h: 82 },    // Lesson 3: right of the bridges
      { x: 654, y: 229, w: 40, h: 60 }     // Lesson 4: far bridge
    ]
  },
  "porcelain-tea-gardens": {
    module: 1, name: "Porcelain Tea Gardens", ribbon: "porcelain", color: "#3f7cc0", icon: "🫖",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,
    hotspots: [   // Emily's clip shows 3 crystals; Module 1 expects 5 (or 4)
      { x: 117, y: 550, w: 66, h: 100 },   // Lesson 1: left pedestal by the castle
      { x: 395, y: 595, w: 68, h: 104 },   // Lesson 2: centre, below the waterfalls
      { x: 804, y: 584, w: 60, h: 92 }     // Lesson 3: by the tea pool
    ]
  }
};
