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
Fish Party is FunRug Studio's second game, slated to release in March. It's a large capacity, single button, local multiplayer game, with plans of online play as well. Our first game, MAGE, had a long development and learning process, and in comparison, Fish Party is a much more focused, better executed project. I've done all the gameplay programming, and most of the systems. 

SECTION 1: Twelve separate inputs
Each player gets one button. That button is how you swap rotation direction, dash, ready up, and change your name. An input system was required that could work for up to 12 players, be efficient, and allow for the addition of bots, and eventual online players. I decided to decouple the player input from the overall list of all fish, allowing bots and online players to own the same type of slot, and not mess with local input management.

    OPTION 1: Setting up players
    In the playerHandler, each local player creates a dictionary key on creation, comprised of their device ID and control path. This allows lookup times for all local inputs to be O(1), making sure that even with the maximum 12 players, efficiency is guaranteed.

    OPTION 2: Reading input
    This function creates a string in the exact same way the setup does, accessing the dictionary and instantly calling the correct player through the event bus. 

    OPTION 3: Reaching the fish
    This code is on the fish. When "local button pressed" is called on the event bus, each fish quickly checks if they can move, if they're local, and if the index matches them. If it does, they flip their rotation. The overloaded function is used for bots to manually flip themselves.     

    CAPTION
    Look at all the different buttons used!

SECTION 2: The bots
The bots in Fish Party have an array of 18 floats in a circle around them. They analyze the area around them, depending on their goals and fears, and score those directions, figuring out where to go and when to dash. The bots have varying intelligence which can be set by the player.  

    OPTION 1: The scoring loop
    The scoring loop is what gives these bots a brain. It goes through, finds all the relevant info it can, be it prey, walls, positions, etc, and directs the fish on where to go. It also debugs the thought process, which is super helpful in making specific fish act how I want them to.   

    OPTION 2: Scoring a target
    Update by prey is an example of a scoring function. If it finds prey in a direction it will, based on distance, grant points to that direction. When points are granted in one direction, they diminishingly spread out throughout the entire circle, to give the fish a map of the area around them.   

    OPTION 3: Avoiding walls
    When a fish spots a wall close enough to them, that direction is immediately set to -5. Since this function is called after all scoring functions, that direction is effectively set inert. Due to the way points affect the whole circle, if a best direction is blocked, the areas right next to that direction will still be the highest score, naturally leading the fish around the wall.        
 
    OPTION 4: Picking a course
    When picking a direction, fish at their best will always choose the top scoring direction. To create difficulty levels, each one below mastermind will deviate more and more, randomly choosing from everything between 1st and 3rd, or at the worst from everything between 1st and 9th.    

    OPTION 5: Dash decisions
    To decide when to dash, every time a fish does a score function, they check that score's relevant dash function. For a goal dash, they have to be close, and facing towards the goal. For a danger dash, they need to be facing away. Danger dashes are more lenient on distance, as accuracy isn't needed to flee.     

    CAPTION
    The brains of the bots visualized. Green lines are positive scores. Red lines are negative. Directions with no lines either mean nothing is in that direction, or a wall has invalidated that direction. 

SECTION 3: Game feel
The controls in this game are super simple, and at first, because of that, the game was super boring. It was like being a robot, just looking at the game state and picking a direction. Along with that, reading the game state was a pain in itself, due to the usually huge amount of fish in an area. The following changes are to remedy those problems.      

    OPTION 1: The dash
    The biggest change in gameplay, the dash directly made the game more fun by introducing a skill based action that could be taken, adding timing and cooldown management into the gameplay experience. 

    OPTION 2: Wall collision
    In a game where you are constantly moving, hitting a wall felt jarring. By adding dust that gets kicked up, as well as sprite squish (based on fish size), hitting walls felt cooler, more intentional, and shorter lasting, while also adding more immersion to the world.        

    OPTION 3: Particles
    Particles are everywhere in Fish Party. On respawn, on dash, on speed boost, on turn, on eating. By making all of these small moments emphasized, player enjoyment and game clarity are both improved.    

    OPTION 4: Point visuals 
    Points are the most important part of the game, and making sure they are clear and cool was paramount. First was to make an animated pop-up for gaining points, to show how many you got, and to really emphasize the main goal of the game. Second was to increase the clarity for fish that gain points abstractly, through time and distance. To do that, point tracers were added. They look great, and clarify a ton.     

    OPTION 5: Hit stop
    Point tracers were added to fish that got points abstractly, but that left out fish that gain points from direct contact. To fix that, hit-stop was added, to give contact fish more juice. 

    OPTION 6: Background fish
    Even with all the other changes to the players, the overall map still felt empty. For a game that takes place in oceans, rivers, and lakes, that doesn't work. To fill out the empty space, small fish shadows were placed in the background, to act as far away fish, making the environments more lived in.    

    CAPTION
    4 fry showing how to gain points in the tutorial.  


SECTION 4: Fish architecture
Due to the large number of fish in Fish Party, efficient architecture is needed to best allow for easy creation and modification. 

    OPTION 1: Putting a fish together
    Every fish has a central FishController, which holds their FishMovement script, and their specific FishBehavior, which differs based on fish type.

    OPTION 2: Fish Behavior
    Fish Behavior is used to denote a fish's goals, position on the food chain, and bot behavior. 

    OPTION 3: A fish built on it
    This is FryBehavior, a subclass of FishBehavior for the fry, which denotes its ability to gain points when close to other fry.

    OPTION 4: Its bot
    FryBehavior additionally creates its bot, initializing the bot controller with all the necessary goals and fears to run the bot brain correctly. 

    CAPTION
    On the left, Fry's Fish scriptable object. On the right, Fish Data, a collection of all the different Fish scriptable objects. 


==================== PAGE: mage ====================

PREFACE
MAGE is FunRug Studio's first work. It started as a side project we were making for fun, and after the addition of our fourth member, we started to work on it for an eventual commercial release. MAGE was clumsy, and full of spur of the moment decisions. I grew a huge amount throughout MAGE's 2 year journey and 2 reboots, learning how to code for stability, safety, and efficiency, how to work in a team, and how to utilize tools like GitHub. I learned a great deal about what works, by learning what doesn't.         

SECTION 1: Modular characters
MAGE is designed to have characters that can differ in movement style and attack, some sharing the same moves, but with different stats. Therefore, a modular, decoupled system is best.

    OPTION 1: The Ability base class
    The ability class was created to be a parent to every single move a mage could use in the game. As you can see by the various activate functions, and water cooldown, this centralized approach was not done correctly. There was inheritance, but that too was done poorly, as you can see on the connected image of magic missile.     

    OPTION 2: Loading a Mage's kit
    Later on in the project, a data scriptable object was placed in to attempt to remedy the organization problems of the mage character creation system, which helped a great deal with creating new mages.   

    CAPTION
    Classic Wizard's setup, alongside their attack, Magic Missile's setup. 

SECTION 2: Ghost projectiles
Every mage in MAGE has a counterspell ability. This lets them absorb an incoming attack, and fire out a more powerful one. Without ghost/Schrodinger projectiles, countering had to be done extremely early, which felt terrible to do as a player.  

    OPTION 1: Becoming a ghost
    When a projectile becomes a ghost projectile, it records its collision data, direction to the player, current velocity, and knockback. Therefore, if it actually collides after the small wait, it can accurately hit the enemy like a normal projectile would.

    OPTION 2: Following the player
    To make sure players can counterspell a ghost projectile, the projectile essentially becomes a child of the player, following them, staying exactly on the player where it hit them, still allowed to be counterspelled by that player. 

    CAPTION
    A demonstration of ghost projectiles, with an exaggerated lifetime length, to showcase what they do. 


==================== PAGE: lighthouse ====================

PREFACE
Lighthouse Time Machine is a game made in under 24 hours for the Wolfjam 2026. We were a team of 5, and came in 2nd place. I did all the gameplay programming and system programming.

SECTION 1: The pivot
With the theme of visibility, we decided to make a game with a lighthouse. Our first concept was that of a 2D side view, where there are multiple floors of the lighthouse, various lights to turn on and off on the different floors, a generator, and flying demons you have to destroy with light. Alongside that, you would also need to manage the big light, to guide ships in a top down environment. We discussed this idea for around 4 hours, and I even started immediately on a prototype. Around the 4 hour mark, we decided that the idea we had wouldn't work, and we pivoted to go all in on guiding ships. The end result was a better scoped, more focused design that the whole team could agree on.

    CAPTION
    An early drawing of our first idea. 

SECTION 2: Mouse-drag controls
To make sure the directing of ships felt fair and fun, a zone is created around the mouse to allow for more leniency for the player, while illustrating effectively where they affect.

    OPTION 1: Reading the drag
    Everything in this game is controlled with the mouse alone, so the player's brain can spend its time strategizing and remembering where their ships are in the fog. 

    OPTION 2: Directing ships
    The code for directing ships rotates the ships instantly. While this isn't realistic, it feels a lot more fair to the player, and puts all fault and success on their shoulders. 

    OPTION 3: The boost
    A boost takes place after the rotation finishes, pushing the ship in the direction you direct it. This makes the ships feel more reactive to the player, and means the player can quickly herd ships along with repeated dragging. 

    CAPTION
    A player about to direct a skeleton boat to go below the middle island.

SECTION 3: Spawning the boats
Boats spawn on the edges: the top left, bottom left, and middle right.   

    OPTION 1: Spawn zones
    Spawn zones have two empty gameObjects that represent the min and max angle and min and max position the boats can spawn in for that respective area. 

    OPTION 2: Finding a free spot
    To keep boats from spawning too close to each other and crashing due to that, a loop is done to check various positions until a viable one is found. To avoid an infinite loop, a for loop is used instead of a while loop, delaying the spawn a bit if the loop fails.

    OPTION 3: Speeding up
    Spawning speeds up the more points the player has, increasing difficulty, while granting the opportunity for even more points. A clamp is in place to prevent the game from spawning unplayably fast. 

    CAPTION
    A player attempting to navigate a cowboy boat to the top, around the two incoming skeleton ships that spawned from the right side. 


==================== PAGE: little-cowboy ====================

PREFACE
Little Cowboy is a game I made with 4 others for the GMTK game jam 2026. We were the 48th most played game out of the 10,500 entries. I did the gameplay programming, enemy programming, and most system programming.  

SECTION 1: Game feel
The main action in this game is aiming and shooting; the player does this almost constantly. Therefore, this was the action that needed to feel the best. 

    OPTION 1: Camera
    The camera doesn't statically follow the player, instead, it tweens slightly from the player to the reticle, meaning what you see is based on where you aim, which gives a much better feeling of control to the player. 

    OPTION 2: Movement
    The movement is intentionally simple, lending the majority of the gameplay to the gun, the bullets, and the interactions caused by those bullets. 

    OPTION 3: Shooting
    Shooting is the core of this game, and so even minor things like screenshake on firing and slight recoil can massively improve overall game feel. 

    CAPTION
    Check out this game feel!

SECTION 2: The bullet system and its interactions
The bullet interactions are the main mechanic of this game, affecting what's in the world, be it the player, enemies, or previous effects still in play.

    OPTION 1: Bullet hooks
    When a bullet collides, it checks whether it is hitting a character or an effect, and calls respective functions on itself as well as its target. 

    OPTION 2: Oil and fire
    Oil and fire was the first interaction made, design wise and programming wise. Oil bullets spread oil around, and fire bullets light that oil up. 

    OPTION 3: The character interface
    To make sure enemies and the player could be affected by effects and bullets in the same way, an interface was made to be used by all enemies and the player, centralizing all possible status effects. 

    OPTION 4: Status effects
    The various status effects were written to behave the same on the player and any enemies, with occasional exceptions, such as the player not getting slowed as much, or the Dynamen blowing up when set on fire.

    OPTION 5: Chain lightning
    Chain lightning goes through all nearby character interfaces, and has all gathered interfaces also check all their nearby interfaces as well, making an already hit list to prevent overlap. 

    CAPTION
    A player set their oil spill on fire with a fire bullet. 

SECTION 3: Enemy AI
The enemy AI all have a base class they share, for the sake of effects, and then their own class, for their unique movement and behaviors. 

    OPTION 1: Shared behavior
    This houses basic things, such as looking at the player, and general movement towards the player. 

    OPTION 2: Snake
    The snake has the unique behavior of doing repeated lunging attacks if the player stays too close for too long. 

    OPTION 3: Gunman
    The gunman walks around randomly, shooting at the player when they're close enough. This is used for both the easier Gunman variant, and the stronger variant, the Lost Cowboy.

    OPTION 4: Dynaman
    One of the most basic enemies, the Dynaman runs at the player, and when close enough, explodes. To interact with effects more, it can't explode when wet, and instantly explodes when set on fire by any means.

    CAPTION
    A Dynamite Thrower, a Dynaman, a Lost Cowboy, and two Snakes surround the player. 


==================== PAGE: perfect-princess-plan ====================

PREFACE
Perfect Princess Plan is a puzzle game made for the Global Game Jam in 2026, with 4 others. I was the lead programmer, and made all of the gameplay and puzzle systems. You place masquerade masks on dummies in an order of your choosing, changing their effects and turn order.

SECTION 1: Moving pieces with interfaces
Perfect Princess Plan consists of a large amount of moving pieces, varied by masks used, and placement order, and systems needed to be built around the variability.

    OPTION 1: The two interfaces
    The DummyFace interface is for enacting the actions of specific masks. The MoveableFace interface is for anything that can move: the various dummies, and the Princess. 

    OPTION 2: The turn loop
    The turn loop goes in order of mask placement, each dummy animating and doing their specific action in turn. 

    OPTION 3: A mask in action
    This is flipScript, the first mask put in the game. It first grabs any nearby mask, before checking whether or not it can act upon it, resetting if it can't.

    OPTION 4: Who moves first
    CheckCross is used by the flip type mask, checking all sides, before sending it off to WhosOnFirst to return the unit lowest in the turn order. 

    CAPTION
    A puzzle pre and post setup.

SECTION 2: The puzzle setup system
The puzzle setup had to be easy to do for the designers, to get as many high-quality levels as we could during the 48 hours we had.

    OPTION 1: Inspector data
    In the inspector, users can assign the position and dummy type of all dummies, as well as the allowed masks. Through this, they can choose the start and end through the Princess and Prince.

    OPTION 2: Building the level
    The GameplayManager sets up the level, spawning in the relevant dummies and masks for the player to use.

    OPTION 3: The grid
    The GridManager both sets up the grid, as well as having many utility functions for updating the grid, and gaining information about it.

    CAPTION
    A level set up in the inspector.

`;
