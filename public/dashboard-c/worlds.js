/* Plan C world-page registry (shared by the dashboard and every world page).
   To add a world: drop its clip in <slug>/assets/ (world.mp4, poster.jpg = first frame, hold.jpg = hold frame),
   copy windswept-ribbon-highlands/index.html to <slug>/index.html, and add an entry here.
   hold: seconds into the clip to stop on (null = play to the end). Hotspots are 1366x768 stage px (x, y = crystal centre, w, h). */
window.POPUP_WORLD_PAGES = {
  "windswept-ribbon-highlands": {
    module: 5, name: "Windswept Ribbon Highlands", ribbon: "highlands",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,
    hotspots: [
      { x: 230,  y: 470, w: 84, h: 160 },   // Lesson 1: big crystal on the stump beside Astra
      { x: 885,  y: 580, w: 66, h: 110 },   // Lesson 2: front crystal by the path
      { x: 1207, y: 393, w: 64, h: 112 },   // Lesson 3: right ledge
      { x: 1049, y: 207, w: 58, h: 96 }     // Lesson 4: top, under the windmill tree
    ]
  },
  "thunderpeak-aerie": {
    module: 3, name: "Thunderpeak Aerie", ribbon: "thunderpeak",
    video: "assets/world.mp4", poster: "assets/poster.jpg", holdImg: "assets/hold.jpg", hold: null, rate: 0.75,
    hotspots: [
      { x: 483,  y: 467, w: 60, h: 84 },    // Lesson 1: left crystal by the elk
      { x: 724,  y: 587, w: 76, h: 116 },   // Lesson 2: big front crystal on the path
      { x: 1038, y: 263, w: 52, h: 76 },    // Lesson 3: top of the stone tower
      { x: 1181, y: 480, w: 64, h: 90 }     // Lesson 4: right ledge
    ]
  }
};
