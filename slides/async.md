title: CMPS 369 - I/O
---
class: center, middle, title_slide
# Interacting with I/O in Node.js
## CMPS 369

---
# Motivation
Let's modify the guessing game to keep track of game history:
- Assign each new game a **game id**
- Record each guess, associating it with a **game id**, along with the guess, and a time stamp
- Build a `/history` page, and a `game` page to view

---
# Persistence
When we restart our server, all of this information is lost!  The obvious solution is a database!
.callout[SQLite is a basic, but extremly powerful database.  It can be used without any special installation.  It is the most widely deployed database technology on earth!]

# Creating our Tables
Create tables using DB browser

# Interacting with the database
Using callbacks

# Callbacks... and why they aren't so hot

# Async and Await

# Refactoring our code
Create a separate module with create functions, insert, search.

# Next Session
Generalized CRUD (pure code video)
