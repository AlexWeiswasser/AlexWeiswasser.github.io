/*
  ALL THE WRITING FOR THE GAME PAGES LIVES IN THIS FILE.

  How it works
  - Each game page has a block that starts with a line like
        ==================== PAGE: fish-party ====================
  - Inside a block, write your text UNDER each of these lines:
        PREFACE              the intro at the top of the page
        SECTION 1: ...       the description under that section's heading
        OPTION 1: ...        the description under that tab's code
        CAPTION              the caption under that section's image
  - The words after "SECTION 1:" are the heading shown on the page.
    The words after "OPTION 1:" are the label on the tab. Change them freely.
  - Leave an empty line between two paragraphs.
  - Delete an entry's text (keep its SECTION / OPTION / CAPTION line) to show nothing there.
  - Text still in [square brackets] is a prompt you haven't replaced yet.

  Rules
  - Keep the numbers as they are. They are how each page finds its text.
  - Don't use the backtick character anywhere in your writing. Quotes and
    apostrophes are fine.
  - Don't remove the first line (window.GAME_TEXT = ...) or the last line of this file.

  Tip: in VS Code, press Alt+Z to wrap long lines.
*/
window.GAME_TEXT = String.raw`

==================== PAGE: fish-party ====================

PREFACE
Fish Party is FunRug Studio's second game, slated to release in March. It's a large capacity, single button, local multiplayer game, with plans of online play as well. Our first game, MAGE, had a long development and learning process, and in comparison, Fish Party is a much more focused, better executed project.

SECTION 1: Twelve separate inputs, bots included
Each player gets one button. That button is how you move, how you dash, how you ready up, and change your name. An input system was required that could work for up to 12 players, be efficient, and allow for the addition of bots, and eventual online players. I decided to decouple the player input from the overall list of all fish, allowing bots and online players to own the same type of slot, and not mess with local input management.

    OPTION 1: Setting up players
    In the playerHandler, each local player creates a dictionary key on creation, comprised of their device ID and control path. This allows lookup times for all local inputs to be O(1), making sure that even with the maximum 12 players, efficiency is guaranteed.

    OPTION 2: Reading input
    [What this function does and why you built it this way.]

    OPTION 3: Reaching the fish
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: the character joining screen]

SECTION 2: The bots
The bots in Fish Party have an array of 18 floats in a circle around them. They analyze the surrounding area around them, depending on their goals and fears, and score those directions. Each score spreads to the entire circle, diminishing along the way. Any spotted walls close enough will set that direction to negative 5. This setup automatically lets fish navigate around walls, as the leaking high point values will point the correct path around the wall.

    OPTION 1: The scoring loop
    [What this function does and why you built it this way.]

    OPTION 2: Scoring a target
    [What this code does and why you built it this way.]

    OPTION 3: Avoiding walls
    [What this function does and why you built it this way.]

    OPTION 4: Picking a course
    [What this code does and why you built it this way.]

    OPTION 5: Dash decisions
    [What this function does and why you built it this way.]

    CAPTION
    [Caption: the bots' debug visuals]

SECTION 3: Game feel
[What you did to make a one-button fish feel good to control and to watch.]

    OPTION 1: The dash
    [What this code does and why you built it this way.]

    OPTION 2: Wall collision
    [What this code does and why you built it this way.]

    OPTION 3: Particles
    [What this code does and why you built it this way.]

    OPTION 4: Point tracers
    [What this code does and why you built it this way.]

    OPTION 5: Hit stop
    [What this code does and why you built it this way.]

    OPTION 6: Background fish
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: what this image shows]


==================== PAGE: mage ====================

PREFACE
[Preface. MAGE is older work. What it taught you, and what you would do differently now.]

SECTION 1: Modular characters
[How the scriptable-object character system works and what it let designers do.]

    OPTION 1: The Ability base class
    [What this code does and why you built it this way.]

    OPTION 2: Loading a Mage's kit
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: the modular characters]

SECTION 2: Ghost projectiles
[What felt wrong about counter timing, and how ghost projectiles fixed it.]

    OPTION 1: Becoming a ghost
    [What this code does and why you built it this way.]

    OPTION 2: Following the player
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: ghost projectiles in action]


==================== PAGE: lighthouse ====================

PREFACE
[Preface. What the game is and how the jam went, in a few sentences.]

SECTION 1: The pivot
[The big section. What the first idea was, why it was not working four hours in, how the team decided to drop it, and why the second idea was better scoped. Use as many paragraphs as you need.]

    CAPTION
    [Caption: what this image shows]

SECTION 2: Mouse-drag controls
[How a drag becomes ship movement, and the boost you added on each drag.]

    OPTION 1: Reading the drag
    [What this code does and why you built it this way.]

    OPTION 2: Directing ships
    [What this code does and why you built it this way.]

    OPTION 3: The boost
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: what this image shows]

SECTION 3: Spawning the boats
[How the spawning system works.]

    OPTION 1: Spawn zones
    [What this code does and why you built it this way.]

    OPTION 2: Finding a free spot
    [What this code does and why you built it this way.]

    OPTION 3: Speeding up
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: what this image shows]


==================== PAGE: little-cowboy ====================

PREFACE
[Preface. What the game is, and what working on it remotely was like.]

SECTION 1: Game feel
[What makes moving and shooting feel good: the camera, the screen shake, the hop.]

    OPTION 1: Camera
    [What this code does and why you built it this way.]

    OPTION 2: Movement
    [What this code does and why you built it this way.]

    OPTION 3: Shooting
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: what this image shows]

SECTION 2: The bullet system and its interactions
[How bullets and elemental effects share one system, and how interactions like fire with oil are resolved.]

    OPTION 1: Bullet hooks
    [What this code does and why you built it this way.]

    OPTION 2: Oil and fire
    [What this code does and why you built it this way.]

    OPTION 3: The character interface
    [What this code does and why you built it this way.]

    OPTION 4: Status effects
    [What this code does and why you built it this way.]

    OPTION 5: Chain lightning
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: what this image shows]

SECTION 3: Enemy AI
[How the AI for all 6 enemy types is structured.]

    OPTION 1: Shared behavior
    [What this code does and why you built it this way.]

    OPTION 2: Snake
    [What this code does and why you built it this way.]

    OPTION 3: Shooter
    [What this code does and why you built it this way.]

    OPTION 4: Dynaman
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: what this image shows]


==================== PAGE: perfect-princess-plan ====================

PREFACE
[Preface. What the game is and what you were responsible for.]

SECTION 1: Moving pieces with interfaces
[How interfaces let different pieces move around the board through the same code, and how masks act in the order they were placed.]

    OPTION 1: The two interfaces
    [What this code does and why you built it this way.]

    OPTION 2: The turn loop
    [What this code does and why you built it this way.]

    OPTION 3: A mask in action
    [What this code does and why you built it this way.]

    OPTION 4: Who moves first
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: the puzzle setup in the inspector]

SECTION 2: The puzzle setup system
[How designers build a puzzle in the inspector, and how that let the team make 33 levels.]

    OPTION 1: Inspector data
    [What this code does and why you built it this way.]

    OPTION 2: Building the level
    [What this code does and why you built it this way.]

    OPTION 3: The grid
    [What this code does and why you built it this way.]

    CAPTION
    [Caption: a puzzle fully set up and ready to go]

`;
