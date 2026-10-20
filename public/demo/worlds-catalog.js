/* Every world that already has a page, grouped by the dashboard it was built for.
   href and art are relative to dashboard-a1/. */
window.ASTRA_WORLD_CATALOG = [
  { set: "Lantern tree", items: [
    ["giants-garden", "Giant's Garden", "world.html?w=giants-garden", "worlds/giants-garden.jpg"],
    ["windmill-kite-hills", "Windmill Kite Hills", "world.html?w=windmill-kite-hills", "worlds/windmill-kite-hills.jpg"],
    ["sandstone-canyon", "Sandstone Canyon", "world.html?w=sandstone-canyon", "worlds/sandstone-canyon.jpg"],
    ["bayou-market", "Bayou Market", "world.html?w=bayou-market", "worlds/bayou-market.jpg"],
    ["lightning-mountain", "Lightning Mountain", "world.html?w=lightning-mountain", "worlds/lightning-mountain.jpg"],
    ["rainforest-canopy", "Rainforest Canopy Bridges", "world.html?w=rainforest-canopy", "worlds/rainforest-canopy.jpg"]
  ]},
  { set: "Trunk doors", items: [
    ["frostpine-peak", "Frostpine Peak", "../dashboard-a2/world.html?w=frostpine-peak", "../dashboard-a2/worlds/frostpine-peak.jpg"],
    ["bamboo-lantern-valley", "Bamboo Lantern Valley", "../dashboard-a2/world.html?w=bamboo-lantern-valley", "../dashboard-a2/worlds/bamboo-lantern-valley.jpg"],
    ["teacup-kingdom", "Teacup Kingdom", "../dashboard-a2/world.html?w=teacup-kingdom", "../dashboard-a2/worlds/teacup-kingdom.jpg"],
    ["thornspire-ruins", "Thornspire Ruins", "../dashboard-a2/world.html?w=thornspire-ruins", "../dashboard-a2/worlds/thornspire-ruins.jpg"],
    ["glasswing-marsh", "Glasswing Marsh", "../dashboard-a2/world.html?w=glasswing-marsh", "../dashboard-a2/worlds/glasswing-marsh.jpg"],
    ["mushroom-hollow", "Mushroom Hollow", "../dashboard-a2/world.html?w=mushroom-hollow", "../dashboard-a2/worlds/mushroom-hollow.jpg"]
  ]},
  { set: "Treehouses", items: [
    ["lighthouse-grove", "Lighthouse Grove", "../dashboard-a3/world.html?w=lighthouse-grove", "../dashboard-a3/worlds/lighthouse-grove.jpg"],
    ["sky-cloud-observatory", "Sky Cloud Observatory", "../dashboard-a3/world.html?w=sky-cloud-observatory", "../dashboard-a3/worlds/sky-cloud-observatory.jpg"],
    ["amber-hive-hollow", "Amber Hive Hollow", "../dashboard-a3/world.html?w=amber-hive-hollow", "../dashboard-a3/worlds/amber-hive-hollow.jpg"],
    ["candyleaf-grove", "Candyleaf Grove", "../dashboard-a3/world.html?w=candyleaf-grove", "../dashboard-a3/worlds/candyleaf-grove.jpg"],
    ["desert-mirage-bazaar", "Desert Mirage Bazaar", "../dashboard-a3/world.html?w=desert-mirage-bazaar", "../dashboard-a3/worlds/desert-mirage-bazaar.jpg"],
    ["cloud-kite-loft", "Cloud Kite Loft", "../dashboard-a3/world.html?w=cloud-kite-loft", "../dashboard-a3/worlds/cloud-kite-loft.jpg"]
  ]},
  { set: "Crystal Railways", items: [
    ["crystal-caverns", "Crystal Caverns", "../dashboard-b/crystal-caverns/", "../dashboard-b/crystal-caverns/assets/poster.jpg"],
    ["firefly-bayou", "Firefly Bayou", "../dashboard-b/firefly-bayou/", "../dashboard-b/firefly-bayou/assets/poster.jpg"],
    ["frostpine-peak", "Frostpine Peak", "../dashboard-b/frostpine-peak/", "../dashboard-b/frostpine-peak/assets/poster.jpg"],
    ["moonwater-falls", "Moonwater Falls", "../dashboard-b/moonwater-falls/", "../dashboard-b/moonwater-falls/assets/poster.jpg"],
    ["mushroom-hollow", "Mushroom Hollow", "../dashboard-b/mushroom-hollow/", "../dashboard-b/mushroom-hollow/assets/poster.jpg"],
    ["sandstone-canyon", "Sandstone Canyon", "../dashboard-b/sandstone-canyon/", "../dashboard-b/sandstone-canyon/assets/poster.jpg"]
  ]},
  { set: "Pop-up mounts", items: [
    ["porcelain-tea-gardens", "Porcelain Tea Gardens", "../dashboard-c/porcelain-tea-gardens/", "../dashboard-c/porcelain-tea-gardens/assets/poster.jpg"],
    ["desert-mirage-bazaar", "Desert Mirage Bazaar", "../dashboard-c/desert-mirage-bazaar/", "../dashboard-c/desert-mirage-bazaar/assets/poster.jpg"],
    ["thunderpeak-aerie", "Thunderpeak Aerie", "../dashboard-c/thunderpeak-aerie/", "../dashboard-c/thunderpeak-aerie/assets/poster.jpg"],
    ["clockwork-gearworks-city", "Clockwork Gearworks City", "../dashboard-c/clockwork-gearworks-city/", "../dashboard-c/clockwork-gearworks-city/assets/poster.jpg"],
    ["windswept-ribbon-highlands", "Windswept Ribbon Highlands", "../dashboard-c/windswept-ribbon-highlands/", "../dashboard-c/windswept-ribbon-highlands/assets/poster.jpg"],
    ["candyleaf-grove", "Candyleaf Grove", "../dashboard-c/candyleaf-grove/", "../dashboard-c/candyleaf-grove/assets/poster.jpg"]
  ]},
  { set: "Lost library", items: [
    ["sky-whale-harbor", "Sky Whale Harbor", "../dashboard-e/sky-whale-harbor/", "../dashboard-e/assets/worlds/sky-whale-harbor.jpg"],
    ["thornspire-ruins", "Thornspire Ruins", "../dashboard-e/thornspire-ruins/", "../dashboard-e/assets/worlds/thornspire-ruins.jpg"],
    ["glasswing-marsh", "Glasswing Marsh", "../dashboard-e/glasswing-marsh/", "../dashboard-e/assets/worlds/glasswing-marsh.jpg"],
    ["amber-hive-hollow", "Amber Hive Hollow", "../dashboard-e/amber-hive-hollow/", "../dashboard-e/assets/worlds/amber-hive-hollow.jpg"],
    ["hollowroot-caverns", "Hollowroot Caverns of Echoes", "../dashboard-e/hollowroot-caverns/", "../dashboard-e/assets/worlds/hollowroot-caverns.jpg"],
    ["painted-canyon", "Painted Canyon", "../dashboard-e/painted-canyon/", "../dashboard-e/assets/worlds/painted-canyon.jpg"]
  ]}
].map(function (g, gi) {
  return { set: g.set, items: g.items.map(function (it) {
    return { key: gi + ":" + it[0], name: it[1], href: it[2], art: it[3] };
  }) };
});
