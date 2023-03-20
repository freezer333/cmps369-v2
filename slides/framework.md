title: CMPS 369 - Framework
---
class: center, middle, title_slide
# Web Framework - Part 0
## CMPS 369

---
# Motivation
If you think about our Project 1, and our various guessing game implementations so far... some patterns are emerging:

- We need a way to parse query and message body
- We need a way to define mappings between URLs and the code that generates the pages - **routing**.

.callout[
  **Frameworks** take common tasks, make them reusable, and put them in one place.  That's it!  
]

---
# Query and Message Body Parsing
We've already done this
- Used the `querystring` module to parse the actual string
- Converted strings into proper data types

We can create a module that encapsulates this, with a parameterized `schema` to define type conversions

- `Parser` - base class, applies schema to `querystring` parsed text (from query string or message body).
  - `QueryParser` - extracts the query string and applies schema
  - `BodyParser` - uses `async` to extract message body and parse and then apply schema.


---
# Routing
Routing consists of **matching** a **route** to a url. 

We've defined mapping with **method**, **path**, and whether or not there is a **query string**.

---
# Routing Parts
- `Matcher` - responsible for inspecting a request URL and determining if it matches
- `Route` - a `Matcher` and function handler to serve the logic and generate the response
- `Router` - a collection of routes and the logic to do pre-processing (parse query and body!) and call the correct route.

---
# Limitations
We've developed a framework that only serves the needs of our first few applications.  We have **much more to go** as projects include more scope!

We've left out page **generation** - all of our apps have a lot of HTML in them.  We could abstract details like:
- Sending 200 or 400 + content
- Defining headers and footers

.callout[Next up... we'll see how to do this, through code and **templates**!]