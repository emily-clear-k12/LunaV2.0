/**
 * Package A — Details and Evidence
 * Design-agnostic lesson data (Luna Mod3 Lv2 L3 wording).
 * Skin later by swapping CSS / rendering; keep step ids + data shape.
 */
window.PACKAGE_A = {
  meta: {
    id: "package-a-details-evidence",
    title: "Details and Evidence",
    package: "A — focused (~23 min)",
    skill: "Evidence (claims need proof)",
    note: "Wireframe only — structure for a later UI skin. Luna wording kept.",
  },

  passages: {
    armstrong: {
      title: "A Nation's Courage",
      author: "Samuel Ortiz",
      sentences: [
        { n: 1, text: "Neil Armstrong and his crew had been training at NASA for months." },
        { n: 2, text: "On July 20, 1969, he landed and walked on the moon." },
        { n: 3, text: "Millions of people watched on television as he stepped onto the lunar surface." },
        { n: 4, text: "The Apollo 11 mission proved that space exploration was possible and led to many more missions." },
        { n: 5, text: "It was a day that was very important." },
      ],
      claim: "Neil Armstrong's moon landing changed the space program in great ways.",
      bestSentence: 4,
    },
    goodall: {
      title: "Voices of Science",
      author: "Maria Lopez",
      sentences: [
        { n: 1, text: "Jane Goodall traveled to Africa in 1960 to study." },
        { n: 2, text: "She spent years carefully watching chimpanzees, their behavior, and how they learned to communicate." },
        { n: 3, text: "Goodall discovered that chimpanzees use tools, like sticks, to gather food." },
        { n: 4, text: "She also worked to protect the environment and spoke out about saving endangered animals." },
        { n: 5, text: "Many people admire her for her lifelong dedication to science and conservation." },
      ],
      focus: "Jane Goodall made important discoveries about chimpanzees.",
      correct: [2, 3],
    },
    carson: {
      title: "Dangerous Chemicals",
      author: "Robert Diaz",
      sentences: [
        { n: 1, text: "Rachel Carson was a scientist and writer in the 1960s." },
        { n: 2, text: "She warned people about the dangers of pesticides, which are chemicals used to kill insects." },
        { n: 3, text: "Her book Silent Spring showed how these chemicals were harming birds, fish, and other wildlife." },
        { n: 4, text: "Carson encouraged people to think about how humans affect nature." },
        { n: 5, text: "Her work led to new environmental laws to protect the Earth that are still making a difference." },
      ],
      claim: "Rachel Carson's work continues to make an impact today.",
      proofTokens: [
        "carson",
        "silent spring",
        "pesticide",
        "chemical",
        "bird",
        "fish",
        "wildlife",
        "law",
        "environmental",
        "1960",
        "insect",
        "nature",
        "protect",
        "earth",
        "difference",
      ],
    },
  },

  steps: [
    {
      id: "intro",
      slot: "Start",
      type: "read",
      title: "Package A · student walkthrough",
      body: [
        "This is a plain skeleton so you can click through every student screen.",
        "No forest art. Gray boxes on purpose — UI can skin later.",
        "Content = Luna Mod 3 Lesson 3 (Details and Evidence), Package A map.",
      ],
      continueLabel: "Start Warm-up",
    },

    {
      id: "warmup",
      slot: "Warm-up",
      type: "multi-input",
      title: "Sentence Type Fun",
      prompt:
        "Write a creative and entertaining sentence for each type using the word: OVERPOWERED.",
      fields: [
        { id: "declarative", label: "Declarative (statement)" },
        { id: "imperative", label: "Imperative (command)" },
        { id: "interrogative", label: "Interrogative (question)" },
        { id: "exclamatory", label: "Exclamatory (exclamation)" },
      ],
      requireAny: true,
      continueLabel: "Continue",
    },

    {
      id: "learn1",
      slot: "Learn₁",
      type: "read",
      title: "Choosing strong evidence",
      subtitle: "Short stand-in (read + continue)",
      body: [
        "Writers don't just make claims — they prove them with evidence. Cold, hard facts!",
        "Good evidence is clear, specific, and directly supports the main idea.",
        "Claim: \"Abraham Lincoln was a strong leader.\"",
        "Weak evidence: \"Lincoln was tall.\"",
        "Strong evidence: In \"America's Greatest History\" the author states, \"Lincoln guided the United States through the Civil War and issued the Emancipation Proclamation in 1863.\"",
        "Strong writers always choose evidence that really proves their point.",
      ],
      continueLabel: "Continue to Notice",
    },

    {
      id: "notice",
      slot: "Notice",
      type: "proof-fluff",
      title: "Proof or fluff?",
      prompt: "Tap each piece of evidence. Mark it Proof or Fluff for the claim shown.",
      items: [
        {
          id: "j1",
          claim: "Thomas Jefferson helped shape American democracy.",
          text: 'The author of Leaders writes, "Jefferson wanted a government that listened to the people."',
          rune: "Jefferson wanted a government that listened to the people.",
          answer: "proof",
        },
        {
          id: "j2",
          claim: "Thomas Jefferson helped shape American democracy.",
          text: 'In Building a Nation, Diaz says, "Jefferson believed schools were important so citizens could protect liberty."',
          rune: "Jefferson believed schools were important so citizens could protect liberty.",
          answer: "proof",
        },
        {
          id: "j3",
          claim: "Thomas Jefferson helped shape American democracy.",
          text: 'In Yummy Foods, Johnson says, "Thomas Jefferson loved ice cream and served it at the White House."',
          answer: "fluff",
        },
        {
          id: "m1",
          claim: "Martin Luther King Jr. was an important leader in the Civil Rights Movement.",
          text: 'Martin Luther King himself said, "Injustice anywhere is a threat to justice everywhere."',
          rune: "Injustice anywhere is a threat to justice everywhere.",
          answer: "proof",
        },
        {
          id: "m2",
          claim: "Martin Luther King Jr. was an important leader in the Civil Rights Movement.",
          text: 'The author of Change Leaders states, "King helped lead the Montgomery Bus Boycott to fight unfair laws."',
          rune: "King helped lead the Montgomery Bus Boycott to fight unfair laws.",
          answer: "proof",
        },
        {
          id: "m3",
          claim: "Martin Luther King Jr. was an important leader in the Civil Rights Movement.",
          text: 'In Fun Facts About Leaders it says, "Martin Luther King Jr. enjoyed playing pool with his friends."',
          answer: "fluff",
        },
      ],
      continueLabel: "Continue to Try",
    },

    {
      id: "try-armstrong",
      slot: "Try",
      type: "pick-one-sentence",
      title: "Outline the evidence",
      prompt:
        "Choose the evidence from the text that best supports the student's claim.",
      passageKey: "armstrong",
      continueLabel: "Next Try",
    },

    {
      id: "try-goodall",
      slot: "Try",
      type: "pick-two-sentences",
      title: "Choose the evidence",
      prompt:
        "Click on the two sentence numbers that can best be used as evidence that Jane Goodall made important discoveries about chimpanzees.",
      passageKey: "goodall",
      continueLabel: "Next Try",
    },

    {
      id: "try-mentor",
      slot: "Try",
      type: "mentor-fix",
      title: "Find the mistake · say it · type it",
      prompt:
        "The highlighted evidence sentence is written incorrectly. Choose ALL the ways to fix it. Then say the corrected sentence and type it.",
      context: [
        "The rainforest is one of the most important places on Earth, and people need to protect it. Rainforests provide oxygen, shelter animals, and give us resources that we use every day. Sadly, they are being cut down too quickly. If we want to keep our planet healthy, we must find ways to protect the rainforest.",
        "First, protecting the rainforest is important because it gives us clean air to breathe. Trees in the rainforest make oxygen, which people all over the world need.",
      ],
      brokenSentence:
        'In Rainforest Facts, the author says "rainforests produce about 20 percent of the world\'s oxygen supply".',
      after:
        "This shows that rainforests are not just important for the animals that live there, but also for people everywhere.",
      fixes: [
        { id: "comma-says", label: 'Place a comma after the word "says."', correct: true },
        {
          id: "move-quotes",
          label: 'Move the beginning quotation marks before the word "author."',
          correct: false,
        },
        { id: "cap-rainforests", label: 'Capitalize the word "Rainforests."', correct: true },
        {
          id: "comma-author",
          label: 'Place a comma after the word "author."',
          correct: false,
        },
        {
          id: "period-inside",
          label: "Move the period inside the quotation marks at the end of the quote.",
          correct: true,
        },
        { id: "no-change", label: "Make no changes.", correct: false },
      ],
      sayItLabel: "I said the corrected evidence sentence out loud",
      typePrompt: "Type the corrected evidence sentence:",
      continueLabel: "Continue to Learn tip",
    },

    {
      id: "learn2",
      slot: "Learn₂",
      type: "read",
      title: "Quoting evidence (desk tip)",
      subtitle: "Optional micro-tip — not a second Short",
      body: [
        "Strong writers don't just copy evidence — they quote it correctly. That means using quotation marks and crediting the source.",
        "Example claim: \"Martin Luther King Jr. inspired people with his words.\"",
        "In his \"I Have a Dream\" speech, King said, \"I have a dream that one day this nation will rise up and live out the true meaning of its creed.\"",
        "Rules to notice: credit the source · comma before the quote · quotation marks around exact words · quote starts with a capital · ending punctuation inside the marks.",
      ],
      continueLabel: "Continue to Build",
    },

    {
      id: "build-jackie",
      slot: "Build",
      type: "starter-write",
      title: "Practice writing a quote · Jackie",
      prompt: "Use the sentence starter. Quote this sentence: Jackie Robinson broke barriers in baseball.",
      starter: 'The author of All About Jackie states',
      continueLabel: "Next Build",
    },

    {
      id: "build-lunches",
      slot: "Build",
      type: "starter-write",
      title: "Practice writing a quote · Longer Lunches",
      prompt:
        "Use the sentence starter. Quote this sentence: Longer lunch periods have a proven correlation to higher grades.",
      starter: "In Longer Lunches, the author claims,",
      continueLabel: "Next Build",
    },

    {
      id: "build-carson",
      slot: "Build",
      type: "hint-ladder",
      title: "Write the evidence · one proof sentence",
      claim: "Rachel Carson's work continues to make an impact today.",
      passageKey: "carson",
      hints: [
        "Nudge: Which sentence best proves her work still matters today?",
        'Example frame: The author of Dangerous Chemicals states, "…"',
        "Mentor model: The author of Dangerous Chemicals states, \"Her work led to new environmental laws to protect the Earth that are still making a difference.\"",
      ],
      writePrompt: "Write one evidence sentence that supports the claim (starter optional).",
      continueLabel: "Continue to Apply",
    },

    {
      id: "apply",
      slot: "Apply",
      type: "apply-gate",
      title: "Full short response",
      prompt:
        "Write a short response that answers the claim with specific proof from the text. Paraphrase is OK — a direct quote is not required.",
      claim: "Rachel Carson's work continues to make an impact today.",
      passageKey: "carson",
      gateNote:
        "Done stays locked until your response includes specific proof from the passage (simple check).",
      continueLabel: "Continue to Path builder",
    },

    {
      id: "path-builder",
      slot: "Closer",
      type: "path-builder",
      title: "Path builder",
      prompt: "Put the short-response path in order. Lights when right. No timer.",
      chips: ["Answer", "Proof", "Explain"],
      correctOrder: ["Answer", "Proof", "Explain"],
      continueLabel: "Finish",
    },

    {
      id: "done",
      slot: "Done",
      type: "done",
      title: "Package A complete",
      body: [
        "You clicked through the full Package A student flow.",
        "Warm-up → Learn₁ → Notice → Try → Learn₂ tip → Build → Apply → Path builder.",
        "This shell is ready for a UI skin on top (same step ids + data).",
      ],
    },
  ],
};
