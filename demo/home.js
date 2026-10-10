(function () {
  const STORAGE_KEY = "astra-demo-alex-v1";
  // Resolve thumbs and module links from this script's folder so the same
  // home works at /demo/ and at the site root.
  const assetBase = new URL(
    "./",
    (document.currentScript && document.currentScript.src) || location.href
  );
  function asset(rel) {
    return new URL(String(rel).replace(/^\.\//, ""), assetBase).href;
  }

  function loadProgress() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  const progress = loadProgress();
  const done = !!progress["details-and-evidence"];

  const modules = [
    {
      zone: 1,
      n: 1,
      name: "Stellar Writers",
      blurb: "Writer identity and habits",
      open: false,
      thumb: "./lesson/scene4.jpg",
    },
    {
      zone: 1,
      n: 2,
      name: "Preparing to Write",
      blurb: "Plan before you draft",
      open: false,
      thumb: "./lesson/scene2.jpg",
    },
    {
      zone: 1,
      n: 3,
      name: "Writing a Draft",
      blurb: "Details, evidence, and quoting",
      open: true,
      href: "./writing-a-draft/",
      thumb: "./lesson/scene3.jpg",
      done,
    },
    {
      zone: 1,
      n: 4,
      name: "Revision",
      blurb: "Strengthen what you wrote",
      open: false,
      thumb: "./lesson/journal.jpg",
    },
    {
      zone: 1,
      n: 5,
      name: "Editing",
      blurb: "Polish for readers",
      open: false,
      thumb: "./lesson/cork.jpg",
    },
    {
      zone: 2,
      n: 6,
      name: "Short Responses",
      blurb: "Answer with proof",
      open: false,
      thumb: "./lesson/casefile.jpg",
    },
    {
      zone: 2,
      n: 7,
      name: "Extended Writing Responses",
      blurb: "Longer essays and projects",
      open: false,
      thumb: "./lesson/journal.jpg",
    },
  ];

  function renderCard(m) {
    const tag = m.open ? "a" : "div";
    const card = document.createElement(tag);
    card.className = "module-card " + (m.open ? "openable" : "locked") + (m.done ? " done" : "");
    if (m.open && m.href) card.href = asset(m.href);

    const num = document.createElement("div");
    num.className = "module-num";
    num.style.backgroundImage =
      "linear-gradient(145deg, rgba(47,70,52,0.55), rgba(20,32,24,0.55)), url('" + asset(m.thumb) + "')";
    num.textContent = m.done ? "✓" : String(m.n);

    const body = document.createElement("div");
    body.className = "module-body";
    const title = document.createElement("strong");
    title.textContent = m.name;
    const blurb = document.createElement("span");
    blurb.textContent = m.blurb;
    body.appendChild(title);
    body.appendChild(blurb);

    const meta = document.createElement("div");
    meta.className = "module-meta";
    meta.textContent = m.open ? (m.done ? "Done" : "Open") : "";

    card.appendChild(num);
    card.appendChild(body);
    card.appendChild(meta);
    return card;
  }

  const z1 = document.getElementById("zone1");
  const z2 = document.getElementById("zone2");
  modules.forEach((m) => {
    (m.zone === 1 ? z1 : z2).appendChild(renderCard(m));
  });
})();
