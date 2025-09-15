### Memory Cassette
Your memories deserve more than notes. Give them a retro twist as cassette tapes.


### 📖Overview
Memory Cassette is a nostalgic web app that lets you capture and preserve memories in the form of retro cassette tapes.
Instead of plain notes, each memory becomes an interactive cassette card you can play back, archive, or keep forever by 
blending digital journaling with old-school vibes.
Built as part of the Kiro Hackathon, Memory Cassette demonstrates how we used Kiro specs, hooks, and conversations to 
structure features, design UI, and generate key code components.


### ✨Features
📝 Add a memory (short text input).
📼 Auto-generate a cassette card styled with retro aesthetics.
▶️ Play, archive, or delete your cassette memories.
🎨 Minimal HTML/CSS/JS implementation (no frameworks).

### Tech Stack
>Frontend: HTML, CSS, JavaScript <br>
>Styling: Custom CSS with retro-inspired design<br>
>AI Assistance: Kiro (specs, hooks, vibe coding)<br>

### How Kiro Was Used
~Spec-to-Code

1.Wrote app requirements in /specs/memory_cassette.yaml
Example: cassette creation, playback, and archive functionality.
2.Kiro generated starter HTML structures and JS logic.

~Hooks
1.Used hooks to automate workflows like converting input → cassette card.
Defined in /hooks/createCassette.json.

~Conversations (Vibe Coding)
1.Asked Kiro to “design a retro cassette card with CSS”.
2.Received styled code snippets we refined into the final look.


### Repo structure
   /.kiro  <br>
   /specs         # Kiro specs for Memory Cassette  <br>
   /hooks         # Hooks for automating workflows   <br>
   /conversations # Chat prompts & outputs from Kiro  <br>
/index.html       # Main app page   <br>
/style.css        # Retro-inspired styling  <br>
/script.js        # App logic (cassette creation, playback, archive)  <br>
