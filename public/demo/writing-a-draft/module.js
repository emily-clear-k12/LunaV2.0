(function () {
  const STORAGE_KEY = "astra-demo-alex-v1";
  let done = false;
  try {
    done = !!JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}")["details-and-evidence"];
  } catch {
    done = false;
  }

  const lessons = [
    { name: "Strong paragraphs", open: false },
    { name: "Writing introductions", open: false },
    {
      name: "Details and Evidence",
      open: true,
      href: "../lesson/",
      done,
      blurb: "Details · evidence · quoting",
    },
    { name: "Writing conclusions", open: false },
    { name: "Transitions that connect ideas", open: false },
  ];

  const root = document.getElementById("lessons");
  lessons.forEach((lesson) => {
    const row = document.createElement(lesson.open ? "a" : "div");
    row.className =
      "lesson-row " + (lesson.open ? "openable" : "locked") + (lesson.done ? " done" : "");
    if (lesson.open && lesson.href) row.href = lesson.href;

    const dot = document.createElement("span");
    dot.className = "lesson-dot";
    dot.setAttribute("aria-hidden", "true");

    const body = document.createElement("div");
    body.className = "module-body";
    const title = document.createElement("strong");
    title.textContent = lesson.name;
    body.appendChild(title);
    if (lesson.blurb) {
      const blurb = document.createElement("span");
      blurb.textContent = lesson.blurb;
      body.appendChild(blurb);
    }

    const meta = document.createElement("div");
    meta.className = "module-meta";
    meta.textContent = lesson.open ? (lesson.done ? "Done" : "Start") : "";

    row.appendChild(dot);
    row.appendChild(body);
    row.appendChild(meta);
    root.appendChild(row);
  });
})();
