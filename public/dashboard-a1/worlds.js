/* Plan A.1 lantern-tree: six modules in lantern order (left top-down, then right top-down). x,y,w,h = lantern hotspot on the 1366x768 stage. */
window.A1_WORLDS = [
  { id: "giants-garden",     m: 1, name: "Giant's Garden",           color: "#4aa3ff", x: 230,  y: 180, w: 92, h: 150, art: "worlds/giants-garden.jpg",
    crystals: [[454, 620], [664, 547], [987, 627], [475, 440]] },
  { id: "willow-wisp-marsh", m: 2, name: "Willow Wisp Marsh",        color: "#2ec4b6", x: 397,  y: 275, w: 86, h: 140 },
  { id: "sandstone-canyon",  m: 3, name: "Sandstone Canyon",         color: "#a66bff", x: 294,  y: 387, w: 86, h: 150, art: "worlds/sandstone-canyon.jpg",
    crystals: [[240, 547], [507, 394], [309, 287], [860, 327]] },
  { id: "bayou-market",      m: 4, name: "Bayou Market",             color: "#ff8a3d", x: 1101, y: 192, w: 92, h: 150 },
  { id: "lightning-mountain",m: 5, name: "Lightning Mountain",       color: "#f5b400", x: 964,  y: 300, w: 86, h: 140 },
  { id: "rainforest-canopy", m: 6, name: "Rainforest Canopy Bridges", short: "Canopy Bridges", color: "#ff5fa8", x: 1201, y: 300, w: 86, h: 140 }
];
