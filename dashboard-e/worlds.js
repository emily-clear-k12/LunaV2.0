/* Plan E "Lost Library": the six arched windows of the Library of the Long Lost Stories.
   DRAFT ART: assets/library.jpg and assets/worlds/*.jpg are Emily's first-pass images (1280x720) and will be replaced.
   win  = the arched window opening, in 1366x768 stage px (left, top, width, height), mapped from library.jpg
   slot = the keyhole under that window where the golden key goes (centre, stage px)
   Windows left to right match Module 1..6 (the art shows the same worlds in that order). */
window.LOST_LIBRARY = {
  storeKey: "lostLibraryDone",          // localStorage: JSON array of finished world slugs
  introVideo: null,                     // HOOK: placeholder intro video (e.g. "assets/intro.mp4") — not built yet
  worlds: [
    { slug: "sky-whale-harbor",   module: 1, name: "Sky Whale Harbor",            color: "#2f78b7", icon: "🐋", art: "assets/worlds/sky-whale-harbor.jpg",
      win: { x: 450, y: 350, w: 70, h: 176 },  slot: { x: 475, y: 535 } },
    { slug: "thornspire-ruins",   module: 2, name: "Thornspire Ruins",            color: "#4d7a3a", icon: "🌿", art: "assets/worlds/thornspire-ruins.jpg",
      win: { x: 543, y: 336, w: 72, h: 192 },  slot: { x: 573, y: 521 } },
    { slug: "glasswing-marsh",    module: 3, name: "Glasswing Marsh",             color: "#3f8f88", icon: "🦋", art: "assets/worlds/glasswing-marsh.jpg",
      win: { x: 643, y: 326, w: 74, h: 202 },  slot: { x: 675, y: 521 } },
    { slug: "amber-hive-hollow",  module: 4, name: "Amber Hive Hollow",           color: "#c27a12", icon: "🐝", art: "assets/worlds/amber-hive-hollow.jpg",
      win: { x: 870, y: 300, w: 80, h: 190 },  slot: { x: 915, y: 512 } },
    { slug: "hollowroot-caverns", module: 5, name: "Hollowroot Caverns of Echoes", color: "#6a4f8f", icon: "🌳", art: "assets/worlds/hollowroot-caverns.jpg",
      win: { x: 985, y: 286, w: 100, h: 204 }, slot: { x: 1040, y: 505 } },
    { slug: "painted-canyon",     module: 6, name: "Painted Canyon",              color: "#b8502e", icon: "🌈", art: "assets/worlds/painted-canyon.jpg",
      win: { x: 1115, y: 270, w: 90, h: 205 }, slot: { x: 1178, y: 500 } }
  ],
  done: function () { try { return JSON.parse(localStorage.getItem(this.storeKey) || "[]"); } catch (e) { return []; } },
  setDone: function (slug) { var d = this.done(); if (d.indexOf(slug) < 0) d.push(slug); try { localStorage.setItem(this.storeKey, JSON.stringify(d)); } catch (e) {} },
  reset: function () { try { localStorage.removeItem(this.storeKey); } catch (e) {} }
};
