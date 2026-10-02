/**
 * Package B — Details and Evidence (dense)
 * Design-agnostic lesson data (Luna Mod3 Lv2 L3 1:1 wording).
 * Skin later by swapping CSS / rendering; keep step ids + data shape.
 */
window.PACKAGE_B = {
  meta: {
    id: "package-b-details-evidence",
    title: "Details and Evidence",
    package: "B — dense (~35–45 min)",
    skill: "Details + Evidence + Quoting (1:1 Luna)",
    note: "Wireframe only — structure for a later UI skin. Luna wording kept. Package B denser map.",
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
      outline: [
        "Body Paragraph 1: Chimpanzees are amazing creatures.",
        "Body Paragraph 2: Jane Goodall made important discoveries about chimpanzees.",
        "Body Paragraph 3: We can help these endangered animals today.",
      ],
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
      title: "Package B · student walkthrough",
      body: [
        "This is a plain skeleton so you can click through every Package B student screen.",
        "No forest art. Gray boxes on purpose — UI can skin later.",
        "Content = Luna Mod 3 Lesson 3 (Details and Evidence), Package B 1:1 denser map (Details + Evidence + Quoting).",
      ],
      continueLabel: "Start Warm-up",
    },

    {
      id: "warmup",
      slot: "Warm-up",
      type: "multi-input",
      title: "Sentence Type Fun",
      subtitle: "Luna slide 2",
      prompt:
        "Write a creative and entertaining sentence for each type using the word: OVERPOWERED.",
      fields: [
        { id: "declarative", label: "Declarative (statement)" },
        { id: "imperative", label: "Imperative (command)" },
        { id: "interrogative", label: "Interrogative (question)" },
        { id: "exclamatory", label: "Exclamatory (exclamation)" },
      ],
      requireAny: true,
      continueLabel: "Continue to Details teach",
    },

    {
      id: "details-teach",
      slot: "Details teach",
      type: "read",
      title: "Instruction 1 · Details and Evidence",
      subtitle: "Luna slide 3 — teach (stand-in for video)",
      body: [
        "Good writers use details and evidence to make their writing stronger. They give proof for the claims and the main ideas in your writing.",
        "Without them, your writing is just a list of ideas with no solid examples to back them up.",
        "Details and evidence help convince the reader that your ideas matter.",
        "But here's the difference: details are for narrative writing, and evidence is for informational or persuasive writing.",
        "For now, let's start with details.",
        "In narrative writing, details bring the story to life.",
        "If you write, \"The game was fun\" — that's okay.",
        "But if you add details — \"The game was fun because the crowd cheered so loudly, and I hit the ball right over the shortstop's head for the winning run.\" — your reader can picture it.",
        "That's what details do: they help the reader see, hear, and feel what is happening. They make your main idea more clear, believable, and exciting.",
        "Now, go try adding some details on your own!",
      ],
      continueLabel: "Continue to Details practice",
    },

    {
      id: "details-sort",
      slot: "Details practice",
      type: "sort-assign",
      title: "Sort the Evidence · details",
      subtitle: "Luna slide 4",
      prompt: "Read each detail and assign it to the correct category.",
      categories: [
        { id: "roller", label: "MAIN IDEA: The roller coaster ride was amazing." },
        { id: "middle", label: "MAIN IDEA: My first day of middle school was a rush of emotions." },
        { id: "weak", label: "WEAK DETAILS" },
      ],
      items: [
        {
          id: "d1",
          text: "My teacher smiled and told us about all the fun projects we would do.",
          answer: "middle",
        },
        {
          id: "d2",
          text: "My stomach dropped as we zoomed down the steep hill.",
          answer: "roller",
        },
        {
          id: "d3",
          text: "At lunch, I sat with new friends, and we traded snacks.",
          answer: "middle",
        },
        {
          id: "d4",
          text: "My sister always takes my clothes, and it drives me crazy.",
          answer: "weak",
        },
        {
          id: "d5",
          text: "I laughed so hard my cheeks hurt by the end of the ride.",
          answer: "roller",
        },
        {
          id: "d6",
          text: "I stayed home and played video games all day.",
          answer: "weak",
        },
        {
          id: "d7",
          text: "The wind whipped my hair back, and people screamed all around me.",
          answer: "roller",
        },
      ],
      continueLabel: "Next Details practice",
    },

    {
      id: "details-brainstorm",
      slot: "Details practice",
      type: "brainstorm-list",
      title: "Detail Brainstorm",
      subtitle: "Luna slide 5",
      prompt:
        "Using the essay outline, brainstorm a list of details that could be added to body paragraph 2.",
      outlineTitle: "My Favorite Hobby:",
      outline: [
        "Introduction: My favorite hobby is playing basketball.",
        "Body Paragraph 1: First, I like basketball because it keeps me active and healthy.",
        "Body Paragraph 2: In addition to this, basketball is my favorite hobby because I get to spend time with my friends.",
        "Body Paragraph 3: Furthermore, I like basketball because it helps me improve my skills.",
        "Conclusion: In conclusion, basketball is my favorite hobby because it keeps me active, lets me spend time with my friends, and helps me get better at the sport.",
      ],
      focusNote: "Possible detail sentences for Body Paragraph 2 (friends):",
      minLines: 2,
      placeholder: "Write possible detail sentences here (one per line)…",
      continueLabel: "Next Details practice",
    },

    {
      id: "details-write",
      slot: "Details practice",
      type: "write-n-details",
      title: "Write the Details",
      subtitle: "Luna slide 6",
      prompt:
        "A student is writing an essay about their favorite memory. The first body paragraph needs three detail sentences about swimming in the ocean. Be creative and add those three detail sentences.",
      before: [
        "The best memory I have is the day my family went to the beach last summer. It was a hot day, and the sand was warm under my feet as soon as we arrived. I could hear the waves crashing, and I was so excited to spend the whole day outside. We packed snacks, games, and even a kite to fly. That trip to the beach is my favorite memory because I had fun swimming, building sandcastles, and spending time with my family.",
      ],
      leadIn: "First, swimming in the ocean made the day unforgettable.",
      after: "But the fun didn't stop there.",
      fields: [
        { id: "detail1", label: "Detail sentence 1" },
        { id: "detail2", label: "Detail sentence 2" },
        { id: "detail3", label: "Detail sentence 3" },
      ],
      continueLabel: "Continue to Evidence teach",
    },

    {
      id: "evidence-teach",
      slot: "Evidence teach",
      type: "read",
      title: "Instruction 2 · Choosing strong evidence",
      subtitle: "Luna slide 7 — teach (stand-in for video)",
      body: [
        "We just practiced adding details to our narrative writing, but what about informational or persuasive writing?",
        "That's when we need evidence. Cold, hard facts!",
        "Writers don't just make claims or state facts — they prove them with evidence.",
        "Good evidence is clear, specific, and directly supports the main idea. Often times we quote a text in our evidence statements.",
        "Claim: \"Abraham Lincoln was a strong leader.\"",
        "Weak evidence: \"Lincoln was tall.\"",
        "Strong evidence: In \"America's Greatest History\" the author states, \"Lincoln guided the United States through the Civil War and issued the Emancipation Proclamation in 1863.\"",
        "Strong writers always choose evidence that really proves their point and quoting another source helps it pack that extra punch.",
        "Now it's your turn to find the best evidence to support a claim.",
      ],
      continueLabel: "Continue to Evidence practice",
    },

    {
      id: "evidence-sort",
      slot: "Evidence practice",
      type: "proof-fluff",
      title: "Sort the Evidence · quotes",
      subtitle: "Luna slide 8 — proof vs fluff (wireframe tap)",
      prompt: "Read each piece of evidence. Mark it Proof (strong) or Fluff (weak) for the claim shown.",
      items: [
        {
          id: "j1",
          claim: "Thomas Jefferson helped shape American democracy.",
          text: 'The author of Leaders writes, "Jefferson wanted a government that listened to the people."',
          answer: "proof",
        },
        {
          id: "j2",
          claim: "Thomas Jefferson helped shape American democracy.",
          text: 'In Building a Nation, Diaz says, "Jefferson believed schools were important so citizens could protect liberty."',
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
          answer: "proof",
        },
        {
          id: "m2",
          claim: "Martin Luther King Jr. was an important leader in the Civil Rights Movement.",
          text: 'The author of Change Leaders states, "King helped lead the Montgomery Bus Boycott to fight unfair laws."',
          answer: "proof",
        },
        {
          id: "m3",
          claim: "Martin Luther King Jr. was an important leader in the Civil Rights Movement.",
          text: 'In Fun Facts About Leaders it says, "Martin Luther King Jr. enjoyed playing pool with his friends."',
          answer: "fluff",
        },
      ],
      continueLabel: "Next Evidence practice",
    },

    {
      id: "evidence-armstrong",
      slot: "Evidence practice",
      type: "pick-one-sentence",
      title: "Outline the Evidence",
      subtitle: "Luna slide 9",
      prompt:
        "Choose the evidence from the text that best supports the student's claim.",
      passageKey: "armstrong",
      continueLabel: "Next Evidence practice",
    },

    {
      id: "evidence-goodall",
      slot: "Evidence practice",
      type: "pick-two-sentences",
      title: "Choose the Evidence",
      subtitle: "Luna slide 10",
      prompt:
        "Click on the two sentence numbers in the excerpt that can best be used as evidence to support body paragraph 2.",
      passageKey: "goodall",
      showOutline: true,
      continueLabel: "Continue to Quoting teach",
    },

    {
      id: "quoting-teach",
      slot: "Quoting teach",
      type: "read",
      title: "Instruction 3 · Quoting evidence",
      subtitle: "Luna slide 11 — teach (stand-in for video)",
      body: [
        "Strong writers don't just copy evidence — they quote it correctly. That means using quotation marks and crediting the source.",
        "Example claim: \"Martin Luther King Jr. inspired people with his words.\"",
        "In his \"I Have a Dream\" speech, King said, \"I have a dream that one day this nation will rise up and live out the true meaning of its creed.\"",
        "First, the sentence starts by explaining where the quote came from.",
        "Notice the quotation marks surround his exact words. There is a comma right before the quote begins, and the quote always starts with a capital letter.",
        "Notice too that the ending punctuation is inside the quotation marks.",
        "Rules to notice: credit the source · comma before the quote · quotation marks around exact words · quote starts with a capital · ending punctuation inside the marks.",
        "Now you are ready to quote those evidence sentences like a pro.",
      ],
      continueLabel: "Continue to Quoting practice",
    },

    {
      id: "quoting-correct",
      slot: "Quoting practice",
      type: "multi-correct",
      title: "Correct or Incorrect",
      subtitle: "Luna slide 12",
      prompt: "Choose all the evidence sentences that correctly use quotation marks.",
      items: [
        {
          id: "q1",
          text: 'The article, Voices of Freedom, explains, "Rosa Parks refused to give up her seat on the bus".',
          correct: false,
          why: "Period belongs inside the quotation marks.",
        },
        {
          id: "q2",
          text: 'In Protecting Nature, Maria Lopez writes "Everyone should do their part to recycle and help our Earth."',
          correct: false,
          why: "Needs a comma after writes before the quote.",
        },
        {
          id: "q3",
          text: "The book, The Homework Wars notes, Homework can be detrimental to teens.",
          correct: false,
          why: "Missing quotation marks around the quoted words.",
        },
        {
          id: "q4",
          text: 'The author of Natural Disasters states, "Hurricanes form over warm ocean waters."',
          correct: true,
          why: "Correct — credit, comma, marks, capital, ending punct inside.",
        },
        {
          id: "q5",
          text: 'The book Science Discoveries says, "Alexander Fleming discovered penicillin by accident."',
          correct: true,
          why: "Correct — quote marks and comma are used properly.",
        },
      ],
      continueLabel: "Next Quoting practice",
    },

    {
      id: "quoting-mentor",
      slot: "Quoting practice",
      type: "mentor-fix",
      title: "Find the Mistake · say it · type it",
      subtitle: "Luna slide 13",
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
      continueLabel: "Continue to Build",
    },

    {
      id: "build-jackie",
      slot: "Build",
      type: "starter-write",
      title: "Practice writing a quote · Jackie",
      subtitle: "Luna slide 14",
      prompt: "Use the sentence starter. Quote this sentence: Jackie Robinson broke barriers in baseball.",
      starter: "The author of All About Jackie states",
      continueLabel: "Next Build",
    },

    {
      id: "build-lunches",
      slot: "Build",
      type: "starter-write",
      title: "Practice writing a quote · Longer Lunches",
      subtitle: "Luna slide 14",
      prompt:
        "Use the sentence starter. Quote this sentence: Longer lunch periods have a proven correlation to higher grades.",
      starter: "In Longer Lunches, the author claims,",
      continueLabel: "Next Build",
    },

    {
      id: "build-carson",
      slot: "Build",
      type: "starter-write",
      title: "Write the Evidence",
      subtitle: "Luna slide 15",
      prompt:
        "Write an evidence sentence from the text that supports the student's claim. Use a sentence starter that references the text and make sure to use quotation marks correctly.",
      claim: "Rachel Carson's work continues to make an impact today.",
      passageKey: "carson",
      starter: 'The author of Dangerous Chemicals states,',
      continueLabel: "Continue to Apply",
    },

    {
      id: "apply",
      slot: "Apply",
      type: "apply-quote-gate",
      title: "Full short response",
      subtitle: "Astra package step — direct-quote gate",
      prompt:
        "Write a short response that answers the claim with specific proof from the text. You must include a DIRECT QUOTE (quotation marks) from the passage.",
      claim: "Rachel Carson's work continues to make an impact today.",
      passageKey: "carson",
      gateNote:
        "Done stays locked until your response includes a direct quote (quotation marks) with specific proof from the passage.",
      continueLabel: "Continue to Path builder",
    },

    {
      id: "path-builder",
      slot: "Closer",
      type: "path-builder",
      title: "Path builder",
      subtitle: "From Luna slide 16 review energy",
      prompt: "Put the short-response path in order. Lights when right. No timer.",
      chips: ["Answer", "Proof", "Explain"],
      correctOrder: ["Answer", "Proof", "Explain"],
      continueLabel: "Finish",
    },

    {
      id: "done",
      slot: "Done",
      type: "done",
      title: "Package B complete",
      body: [
        "You clicked through the full Package B student flow.",
        "Warm-up → Details teach + practice → Evidence teach + practice → Quoting teach + practice (+ say-it-then-write) → Build → Apply (direct-quote gate) → Path builder.",
        "This shell is ready for a UI skin on top (same step ids + data).",
      ],
    },
  ],
};
