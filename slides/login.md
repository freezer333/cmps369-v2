title: CMPS 369 Login
---
# User Accounts
Let's continue to build the Guessing game to support the following:
- User signup
    - Database schema update
        - User table w/ password and salt
        - User ID for each game
        - Anonymous Games
    - Account creation
    - Password hashing
- User login
    - Authentication
    - Sessions
- Restricting Access
    - History listings not available unless you login
    - You can only see your own games
---
# What do we need?
- Updating Game DB package `gdbcmps369`
    - Specifying version number in `package.json`
- Hashing library - `bcryptjs`
    - Generating salt
    - Hashing a new password
    - How hash+salt is stored
    - Checking login credentials
- Cookies and Sessions
    - `'express-session'`
    - Choosing a session store
    - Session data available to `pug`
- Authentication and Authorization Middleware
    - Protect the history routes from anonymous users
    - Difference between serverside and frontend access control (hint, front end is only cosmetic)


.callout[Let's get started!]
