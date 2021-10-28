# battleship
The Odin Project Battleship Implementation. Allows you to play Battleship against a computer.

This project was implemented to practice/gain familiarity with test driven development using Jest. Testing was performed on core game module logic only, and not on DOM manipulation. The following Jest features were practiced:

1. Hooks (e.g. beforeEach, afterEach) for test setup and teardown
2. Jest mock functions to emulate module dependencies

# How to Play

1. Place ships by specifying individual coordinates in col/row format (e.g. A1, F7, I9, etc.) and ship orientation, or by clicking the "Randomize Ship Placement" button
2. Ships may not be placed directly adjacent or kitty-corner to eachother
3. Once all ships are placed hit the "Start" button
4. Click an empty space on the Enemy grid, after which the computer will automatically attack your grid after 1 second
5. The game may be reset from the beginning at any time
6. Have fun!