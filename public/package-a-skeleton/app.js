(function () {
  const data = window.PACKAGE_A;
  const root = document.getElementById("app");
  const state = {
    index: 0,
    answers: {},
    revealedHints: {},
  };

  function el(tag, attrs, kids) {
    const node = document.createElement(tag);
    if (attrs) {
      Object.entries(attrs).forEach(([k, v]) => {
        if (k === "className") node.className = v;
        else if (k === "text") node.textContent = v;
        else if (k === "html") node.innerHTML = v;
        else if (k === "value" && "value" in node) node.value = v == null ? "" : v;
        else if (k === "checked") node.checked = !!v;
        else if (k === "disabled") node.disabled = !!v;
        else if (k.startsWith("on") && typeof v === "function") node.addEventListener(k.slice(2).toLowerCase(), v);
        else if (v === false || v == null) return;
        else node.setAttribute(k, v === true ? "" : String(v));
      });
    }
    (kids || []).forEach((c) => {
      if (c == null) return;
      node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return node;
  }

  function getAnswer(stepId) {
    if (!state.answers[stepId]) state.answers[stepId] = {};
    return state.answers[stepId];
  }

  function passageBlock(key) {
    const p = data.passages[key];
    const box = el("div", { className: "box" }, [
      el("strong", { text: `The Text (from ${p.title} by ${p.author})` }),
    ]);
    p.sentences.forEach((s) => {
      box.appendChild(
        el("div", { className: "passage-line" }, [
          el("span", { text: `(${s.n})` }),
          el("span", { text: s.text }),
        ])
      );
    });
    return box;
  }

  function canContinue(step) {
    const a = getAnswer(step.id);
    switch (step.type) {
      case "read":
      case "done":
        return true;
      case "multi-input":
        if (!step.requireAny) return true;
        return (step.fields || []).some((f) => (a[f.id] || "").trim().length > 0);
      case "proof-fluff":
        return (step.items || []).every((item) => a[item.id] === item.answer);
      case "pick-one-sentence": {
        const p = data.passages[step.passageKey];
        return a.choice === p.bestSentence;
      }
      case "pick-two-sentences": {
        const p = data.passages[step.passageKey];
        const sel = new Set(a.selected || []);
        return p.correct.length === sel.size && p.correct.every((n) => sel.has(n));
      }
      case "mentor-fix": {
        const fixes = step.fixes || [];
        const selected = new Set(a.fixes || []);
        const correctIds = fixes.filter((f) => f.correct).map((f) => f.id);
        const fixesOk =
          correctIds.length === selected.size && correctIds.every((id) => selected.has(id));
        return fixesOk && !!a.saidIt && (a.typed || "").trim().length > 10;
      }
      case "starter-write":
        return (a.text || "").trim().length > 5;
      case "hint-ladder":
        return (a.text || "").trim().length > 10;
      case "apply-gate":
        return hasSpecificProof(a.text || "", data.passages[step.passageKey]);
      case "path-builder":
        return (
          Array.isArray(a.slots) &&
          a.slots.length === step.correctOrder.length &&
          a.slots.every((v, i) => v === step.correctOrder[i])
        );
      default:
        return true;
    }
  }

  function hasSpecificProof(text, passage) {
    const t = (text || "").toLowerCase().trim();
    if (t.length < 30) return false;
    if (/["“].{8,}["”]/.test(text)) return true;
    const tokens = passage.proofTokens || [];
    const hits = tokens.filter((tok) => t.includes(tok.toLowerCase()));
    return hits.length >= 1;
  }

  function renderProgress() {
    const slots = [];
    const seen = new Set();
    data.steps.forEach((s, i) => {
      if (s.slot === "Start" || s.slot === "Done") return;
      if (seen.has(s.slot) && data.steps[state.index].slot !== s.slot) {
        /* keep first index per slot for jump, but allow current slot multi */
      }
      if (!seen.has(s.slot)) {
        seen.add(s.slot);
        slots.push({ slot: s.slot, index: i });
      }
    });

    return el(
      "nav",
      { className: "progress", "aria-label": "Lesson slots" },
      slots.map(({ slot, index }) => {
        const currentSlot = data.steps[state.index].slot;
        const cls = [
          slot === currentSlot ? "current" : "",
          index < state.index ? "done" : "",
        ]
          .filter(Boolean)
          .join(" ");
        return el("button", {
          type: "button",
          className: cls,
          text: slot,
          onClick: () => {
            state.index = index;
            render();
          },
        });
      })
    );
  }

  function renderRead(step) {
    return el("div", {}, [
      el("ul", { className: "body-list" }, (step.body || []).map((line) => el("li", { text: line }))),
    ]);
  }

  function renderMultiInput(step) {
    const a = getAnswer(step.id);
    return el(
      "div",
      {},
      (step.fields || []).map((f) =>
        el("div", { className: "field" }, [
          el("label", { for: f.id, text: f.label }),
          el("input", {
            id: f.id,
            type: "text",
            value: a[f.id] || "",
            onInput: (e) => {
              a[f.id] = e.target.value;
              refreshActions();
            },
          }),
        ])
      )
    );
  }

  function evidenceWithRune(text, rune, draw) {
    if (!rune || !text.includes(rune)) {
      return el("div", { className: "evidence", text: text });
    }
    const i = text.indexOf(rune);
    const before = text.slice(0, i);
    const after = text.slice(i + rune.length);
    return el("div", { className: "evidence" }, [
      before ? document.createTextNode(before) : null,
      el("span", {
        className: `rune-target ${draw ? "rune-draw" : ""}`,
        text: rune,
      }),
      after ? document.createTextNode(after) : null,
    ]);
  }

  function classifyProofFluff(step, item, choice) {
    const a = getAnswer(step.id);
    if (a[item.id] === item.answer) return; // already locked correct
    if (a._mistLock) return; // ignore taps during mist

    if (choice === item.answer) {
      a[item.id] = choice;
      delete a._mist;
      render();
      return;
    }

    // Wrong: brief mist pulse, then reset — no lecture, answer does not stick
    a._mist = item.id;
    a._mistLock = true;
    render();
    window.setTimeout(() => {
      if (a._mist === item.id) delete a._mist;
      a._mistLock = false;
      render();
    }, 620);
  }

  function renderProofFluff(step) {
    const a = getAnswer(step.id);
    const items = step.items || [];
    const sortedCount = items.filter((item) => a[item.id] === item.answer).length;
    const allSorted = sortedCount === items.length && items.length > 0;

    const trail = el(
      "div",
      {
        className: `notice-trail ${allSorted ? "path-unlocked" : ""}`,
        "aria-label": `Trail progress: ${sortedCount} of ${items.length} sorted`,
      },
      [
        el("div", { className: "trail-label", text: "Trail" }),
        el(
          "div",
          { className: "trail-path", role: "list" },
          items.map((item, idx) => {
            const locked = a[item.id] === item.answer;
            const kind = locked ? item.answer : "idle";
            return el("div", {
              className: `trail-stone ${locked ? "ignited" : ""} stone-${kind}`,
              role: "listitem",
              "aria-label": locked
                ? `Stone ${idx + 1} lit — ${item.answer}`
                : `Stone ${idx + 1} waiting`,
              title: locked ? item.answer : "unsorted",
            });
          })
        ),
        el("div", {
          className: `trail-ahead ${allSorted ? "bright" : ""}`,
          "aria-hidden": "true",
        }),
        allSorted
          ? el("div", {
              className: "trail-unlock-note",
              text: "Path ahead open — evidence sorted.",
            })
          : el("div", {
              className: "trail-unlock-note muted",
              text: `${sortedCount}/${items.length} sorted`,
            }),
      ]
    );

    const cards = el(
      "div",
      { className: "notice-cards" },
      items.map((item) => {
        const picked = a[item.id];
        const locked = picked === item.answer;
        const misting = a._mist === item.id;
        const plateClass = [
          "item-card",
          "bark-plate",
          locked && item.answer === "proof" ? "magic-proof" : "",
          locked && item.answer === "fluff" ? "magic-fluff" : "",
          misting ? "mist-pulse" : "",
        ]
          .filter(Boolean)
          .join(" ");

        const statusText = locked
          ? item.answer === "proof"
            ? "Proof — supports the claim."
            : "Fluff — dims; does not prove the claim."
          : misting
            ? "Mist — try the other mark."
            : "";

        return el(
          "div",
          {
            className: plateClass,
            "data-id": item.id,
            "aria-live": misting || locked ? "polite" : "off",
          },
          [
            el("div", { className: "claim", text: `Claim: ${item.claim}` }),
            evidenceWithRune(item.text, item.rune, locked && item.answer === "proof"),
            el("div", { className: "tap-row", role: "group", "aria-label": "Mark as proof or fluff" }, [
              el("button", {
                type: "button",
                className: `choice-btn ${picked === "proof" ? "selected" : ""} ${
                  locked && item.answer === "proof" ? "ok" : ""
                }`,
                text: "Proof",
                "aria-pressed": picked === "proof" ? "true" : "false",
                disabled: locked || misting ? true : false,
                onClick: () => classifyProofFluff(step, item, "proof"),
              }),
              el("button", {
                type: "button",
                className: `choice-btn ${picked === "fluff" ? "selected" : ""} ${
                  locked && item.answer === "fluff" ? "ok" : ""
                }`,
                text: "Fluff",
                "aria-pressed": picked === "fluff" ? "true" : "false",
                disabled: locked || misting ? true : false,
                onClick: () => classifyProofFluff(step, item, "fluff"),
              }),
            ]),
            statusText
              ? el("div", {
                  className: `feedback magic-status ${
                    misting ? "warn" : locked ? "ok" : ""
                  }`,
                  text: statusText,
                })
              : null,
          ]
        );
      })
    );

    return el("div", { className: `notice-magic ${allSorted ? "all-sorted" : ""}` }, [
      trail,
      cards,
    ]);
  }

  function renderPickOne(step) {
    const p = data.passages[step.passageKey];
    const a = getAnswer(step.id);
    const wrap = el("div", {}, [
      el("div", { className: "box", text: `Student's Claim: ${p.claim}` }),
      el("div", { className: "box" }, [
        el("strong", { text: `The Text (from ${p.title} by ${p.author})` }),
        ...p.sentences.map((s) =>
          el("div", { className: "passage-line" }, [
            el("button", {
              type: "button",
              className: `${a.choice === s.n ? "selected" : ""} ${
                a.choice === p.bestSentence && s.n === p.bestSentence ? "correct-mark" : ""
              }`,
              text: String(s.n),
              onClick: () => {
                a.choice = s.n;
                render();
              },
            }),
            el("span", { text: s.text }),
          ])
        ),
      ]),
    ]);
    if (a.choice != null) {
      wrap.appendChild(
        el("div", {
          className: `feedback ${a.choice === p.bestSentence ? "ok" : "bad"}`,
          text:
            a.choice === p.bestSentence
              ? "Sentence 4 best proves the claim — Apollo 11 led to more missions."
              : "Try again — which sentence shows how the landing changed the space program?",
        })
      );
    }
    return wrap;
  }

  function renderPickTwo(step) {
    const p = data.passages[step.passageKey];
    const a = getAnswer(step.id);
    if (!a.selected) a.selected = [];
    const selected = new Set(a.selected);
    const wrap = el("div", {}, [
      el("div", { className: "box", text: `Focus: ${p.focus}` }),
      el("div", { className: "box" }, [
        el("strong", { text: `From ${p.title} by ${p.author}` }),
        ...p.sentences.map((s) =>
          el("div", { className: "passage-line" }, [
            el("button", {
              type: "button",
              className: selected.has(s.n) ? "selected" : "",
              text: String(s.n),
              onClick: () => {
                if (selected.has(s.n)) selected.delete(s.n);
                else {
                  if (selected.size >= 2) selected.clear();
                  selected.add(s.n);
                }
                a.selected = Array.from(selected);
                render();
              },
            }),
            el("span", { text: s.text }),
          ])
        ),
      ]),
    ]);
    if (a.selected.length === 2) {
      const ok = canContinue(step);
      wrap.appendChild(
        el("div", {
          className: `feedback ${ok ? "ok" : "bad"}`,
          text: ok
            ? "Nice — sentences 2 and 3 show her discoveries about chimpanzees."
            : "Pick the two sentences that best show her discoveries about chimpanzees.",
        })
      );
    }
    return wrap;
  }

  function renderMentor(step) {
    const a = getAnswer(step.id);
    if (!a.fixes) a.fixes = [];
    const selected = new Set(a.fixes);
    const wrap = el("div", {}, [
      ...(step.context || []).map((t) => el("div", { className: "box", text: t })),
      el("div", { className: "box highlight" }, [
        el("strong", { text: "Broken evidence sentence:" }),
        el("p", { text: step.brokenSentence }),
      ]),
      el("div", { className: "box", text: step.after }),
      el("p", { className: "prompt", text: "Choose ALL the ways to fix the evidence sentence:" }),
      ...step.fixes.map((f) =>
        el("button", {
          type: "button",
          className: `fix-btn ${selected.has(f.id) ? "selected" : ""}`,
          style: "display:block;width:100%;text-align:left;margin-bottom:6px;",
          text: f.label,
          onClick: () => {
            if (selected.has(f.id)) selected.delete(f.id);
            else selected.add(f.id);
            a.fixes = Array.from(selected);
            render();
          },
        })
      ),
    ]);

    const correctIds = step.fixes.filter((f) => f.correct).map((f) => f.id);
    const fixesOk =
      a.fixes.length > 0 &&
      correctIds.length === selected.size &&
      correctIds.every((id) => selected.has(id));
    if (a.fixes.length > 0) {
      wrap.appendChild(
        el("div", {
          className: `feedback ${fixesOk ? "ok" : "warn"}`,
          text: fixesOk
            ? "Fixes locked: comma after says · capitalize Rainforests · period inside quotes."
            : "Keep going — select every correct fix (and only the correct ones).",
        })
      );
    }

    wrap.appendChild(
      el("label", { className: "checkbox-row" }, [
        el("input", {
          type: "checkbox",
          checked: !!a.saidIt,
          onChange: (e) => {
            a.saidIt = e.target.checked;
            refreshActions();
            render();
          },
        }),
        el("span", { text: step.sayItLabel }),
      ])
    );

    wrap.appendChild(
      el("div", { className: "field" }, [
        el("label", { text: step.typePrompt }),
        el("textarea", {
          value: a.typed || "",
          onInput: (e) => {
            a.typed = e.target.value;
            refreshActions();
          },
        }),
      ])
    );

    return wrap;
  }

  function renderStarter(step) {
    const a = getAnswer(step.id);
    return el("div", {}, [
      el("div", { className: "starter", text: `Starter: ${step.starter}` }),
      el("div", { className: "field" }, [
        el("label", { text: "Your evidence sentence" }),
        el("textarea", {
          value: a.text || "",
          onInput: (e) => {
            a.text = e.target.value;
            refreshActions();
          },
        }),
      ]),
    ]);
  }

  function renderHintLadder(step) {
    const a = getAnswer(step.id);
    const revealed = state.revealedHints[step.id] || 0;
    const wrap = el("div", {}, [
      el("div", { className: "box", text: `Student's Claim: ${step.claim}` }),
      passageBlock(step.passageKey),
      el("ul", { className: "hint-list" }, [
        ...step.hints.slice(0, revealed).map((h, i) => el("li", { text: `Hint ${i + 1}: ${h}` })),
        revealed < step.hints.length
          ? el("li", {}, [
              el("button", {
                type: "button",
                text: revealed === 0 ? "Show nudge" : revealed === 1 ? "Show example" : "Show mentor model",
                onClick: () => {
                  state.revealedHints[step.id] = revealed + 1;
                  render();
                },
              }),
            ])
          : null,
      ]),
      el("div", { className: "field" }, [
        el("label", { text: step.writePrompt }),
        el("textarea", {
          value: a.text || "",
          onInput: (e) => {
            a.text = e.target.value;
            refreshActions();
          },
        }),
      ]),
    ]);
    return wrap;
  }

  function renderApply(step) {
    const a = getAnswer(step.id);
    const passage = data.passages[step.passageKey];
    const ok = hasSpecificProof(a.text || "", passage);
    const wrap = el("div", {}, [
      el("div", { className: "box", text: `Claim: ${step.claim}` }),
      passageBlock(step.passageKey),
      el("p", { className: "subtitle", text: step.gateNote }),
      el("div", { className: "field" }, [
        el("label", { text: "Your short response" }),
        el("textarea", {
          value: a.text || "",
          rows: 8,
          onInput: (e) => {
            a.text = e.target.value;
            render();
          },
        }),
      ]),
      el("div", {
        className: `feedback ${ok ? "ok" : "warn"}`,
        text: ok
          ? "Gate open — specific proof from the text detected."
          : "Gate locked — add specific proof from the passage (paraphrase OK; quote not required).",
      }),
    ]);
    return wrap;
  }

  function renderPathBuilder(step) {
    const a = getAnswer(step.id);
    if (!Array.isArray(a.slots) || a.slots.length !== 3) a.slots = [null, null, null];
    if (!Array.isArray(a.tray)) {
      const used = new Set(a.slots.filter(Boolean));
      a.tray = step.chips.filter((c) => !used.has(c));
    }

    const lit = a.slots.every((v, i) => v === step.correctOrder[i]);

    const wrap = el("div", {}, [
      el("div", { className: "chip-tray", "aria-label": "Available chips" }, [
        ...a.tray.map((chip) =>
          el("button", {
            type: "button",
            className: "chip",
            text: chip,
            onClick: () => {
              const empty = a.slots.findIndex((x) => !x);
              if (empty < 0) return;
              a.slots[empty] = chip;
              a.tray = a.tray.filter((c) => c !== chip);
              render();
            },
          })
        ),
        a.tray.length === 0 ? el("span", { className: "subtitle", text: "(tray empty — tap a slot to remove)" }) : null,
      ]),
      el(
        "div",
        { className: "path-slots" },
        [0, 1, 2].map((i) => {
          const val = a.slots[i];
          return el("button", {
            type: "button",
            className: `path-slot ${val ? "filled" : ""} ${lit ? "lit" : ""}`,
            text: val ? `${i + 1}. ${val}` : `${i + 1}. (tap a chip)`,
            onClick: () => {
              if (!val) return;
              a.slots[i] = null;
              a.tray.push(val);
              render();
            },
          });
        })
      ),
      lit
        ? el("div", {
            className: "feedback ok",
            text: "Path lit — Answer → Proof → Explain.",
          })
        : el("div", {
            className: "feedback warn",
            text: "Order the chips: Answer, then Proof, then Explain.",
          }),
      el("button", {
        type: "button",
        className: "nav-btn",
        text: "Reset chips",
        onClick: () => {
          a.slots = [null, null, null];
          a.tray = step.chips.slice();
          render();
        },
      }),
    ]);
    return wrap;
  }

  function renderBody(step) {
    switch (step.type) {
      case "read":
      case "done":
        return renderRead(step);
      case "multi-input":
        return renderMultiInput(step);
      case "proof-fluff":
        return renderProofFluff(step);
      case "pick-one-sentence":
        return renderPickOne(step);
      case "pick-two-sentences":
        return renderPickTwo(step);
      case "mentor-fix":
        return renderMentor(step);
      case "starter-write":
        return renderStarter(step);
      case "hint-ladder":
        return renderHintLadder(step);
      case "apply-gate":
        return renderApply(step);
      case "path-builder":
        return renderPathBuilder(step);
      default:
        return el("p", { text: `Unknown step type: ${step.type}` });
    }
  }

  function refreshActions() {
    const btn = document.getElementById("continue-btn");
    if (!btn) return;
    const step = data.steps[state.index];
    btn.disabled = !canContinue(step);
  }

  function render() {
    const step = data.steps[state.index];
    root.innerHTML = "";

    root.appendChild(
      el("div", { className: "wire-banner", text: data.meta.note })
    );

    root.appendChild(
      el("header", { className: "topbar" }, [
        el("div", {}, [
          el("h1", { text: data.meta.title }),
          el("div", {
            className: "meta",
            text: `${data.meta.package} · ${data.meta.skill}`,
          }),
        ]),
        el("div", {
          className: "meta",
          text: `Step ${state.index + 1} / ${data.steps.length}`,
        }),
      ])
    );

    root.appendChild(renderProgress());

    const screen = el("section", { className: "screen", "aria-live": "polite" }, [
      el("div", { className: "slot-tag", text: step.slot }),
      el("h2", { text: step.title }),
      step.subtitle ? el("p", { className: "subtitle", text: step.subtitle }) : null,
      step.prompt ? el("p", { className: "prompt", text: step.prompt }) : null,
      renderBody(step),
    ]);
    root.appendChild(screen);

    const actions = el("div", { className: "actions" }, [
      el("button", {
        type: "button",
        className: "nav-btn",
        text: "Back",
        disabled: state.index === 0 ? true : false,
        onClick: () => {
          if (state.index > 0) {
            state.index -= 1;
            render();
          }
        },
      }),
    ]);

    if (step.type !== "done") {
      const cont = el("button", {
        type: "button",
        id: "continue-btn",
        className: "primary-btn",
        text: step.continueLabel || "Continue",
        disabled: !canContinue(step),
        onClick: () => {
          if (!canContinue(step)) return;
          if (state.index < data.steps.length - 1) {
            state.index += 1;
            render();
          }
        },
      });
      actions.appendChild(cont);
    } else {
      actions.appendChild(
        el("button", {
          type: "button",
          className: "primary-btn",
          text: "Restart walkthrough",
          onClick: () => {
            state.index = 0;
            state.answers = {};
            state.revealedHints = {};
            render();
          },
        })
      );
    }

    root.appendChild(actions);
  }

  render();
})();
