title: CMPS 369 Course Introduction 
---
class: center, middle, title_slide
# Course Introduction
## CMPS 369
---
# This recording:
- What to expect from this course
    - Topics
    - The online format
    - Workload
    - Rules and Regulations (the syllabus)

.callout[If you are new to web development, you are going to learn **A LOT**.]

.callout[If you've already done some web development, I think a lot of things are going to start to make **a lot more sense**!]

---
# First... Introduction
- A little about me:
    - I've been teaching Web Development since 2007... much has changed.
    - I've been building web applications for over 20 years, professionally, as a consultant.
        - Started in Java (J2EE)
        - Worked in C# / .NET / ASP.NET MVC
        - Transitioned to Node.js
        - A few contracts using Python...
        - ... and even C++ as a web environment (not fun).

.callout[**What I've learned**: Web Applications are just software applications, with networking.  No matter what language you use, the general design of the frameworks are pretty much the same.  The industry is **cyclical**, but very susceptable to buzzwords.]

- When you want to reach me, use email - [sfrees@ramapo.edu](mailto:sfrees@ramapo.edu)

---
# Course Goals
Web Development is extremely broad - there are too many languages, frameworks, and platforms for one semester (or even 4).

- **Breadth** - enough exposure to a variety of of these that you feel confident on an interview, and can relate things together.
- **Depth** - enough deep knowledge in a core set of verticals* so you have real world experience that can carry you through an application cycle.

.callout[To accomplish this, we are actually going to work at a lower level for a while - so you see what lies behind all of the fancy tools and languages.  This will allow us to go fast, later, and cover more ground.]

---
# Misconception:  The Web isn't real software engineering
This myth is dying, but slowly.  
- Yes, HTML and CSS are limited languages, only meant for presentation on the web.
- However, HTML and CSS do not make a **web application**.
- A web application has
  - Dynamic user interface
  - A backend server with tons of business logic
  - Probably a database (or dozens)
  - Probably supports browsers, iOS apps, Android apps, and other clients via an API
  - ... and has more users (simultaneous at that) than most non-web applications could even fathom.

.callout[The truth is that HTML and CSS are the very tip of a gigantic iceberg, and what's underneath is serious engineering.  **We are going to focus on the engineering**... a lot!]

---
# The landscape
A web application is not the same thing as a "web page".  It's a fully functioning software application, which runs on top of the internet's infrastructure.
- **Client Side** - the code that is sent from a web server and runs within a browser (or a native app)
- **Server Side** - the code that executes on a server (or hundreds) in response to client requests.  The response is the output to the the client (the response is code!).

.callout[The glue between these two is networking - which is done via TCP and HTTP.]

One of the harder parts of getting a feel for web programming is what happens on which side.  The industry can't fully decide this either - it's a moving target.  We will discuss the pros and cons of putting different parts of our applications on the client versus on the server **a lot**.

---
# Oh... and then there's security

.split-left[
Perhaps the biggest advantage of web applications are their ability to deliver applications to **everyone** with a web browser.

Perhaps the most frightening part of web application is the **same thing**. You can't build a web application without contemplating the hoards of barbarians at the gate... waiting to break your application.

.callout[We will learn about HTTPs, storing passwords, hashing, authentication, cookies, CORs, and much more.]
]

.split-right[
<img src='../images/hacker.jpg'>]

---
# Client side
.split-left[
    <h3>Languages</h3>
    <ul>
        <li>HTML</li>
        <li>CSS</li>
        <li>JavaScript</li>
    </ul>
    <h3>Concepts</h3>
    <ul>
        <li>Responsive Design</li>
        <li>Progressive Web Apps (PWA)</li>
        <li>AJAX, Web Sockets</li>
    </ul>
]

.split-right[
    <h3>Frameworks</h3>
    <ul>
        <li>Bootstrap, Tailwinds, Foundation</li>
        <li>React, Vue, Angular, Svelte</li>
    </ul>
    <h3>Old stuff</h3>
    <ul>
        <li>Flash</li>
        <li>jQuery</li>
    </ul>
]

---
# Server-Side
**The old frameworks**
- CGI Scripting (Perl, C, C++, and anything else)
- Java - J2EE, Java Beans, Spring (still going)
- C# - WebForms
- PHP (plain old PHP)

**The influential framework**
- Ruby on Rails - the framework that rewrote how web applications were written.

**The modern frameworks**
- **Python**:  Django, Flask
- **JavaScript**:  Express, Next, Nuxt
- **Rust**:  Hyper, Rocket
- **.NET**:  ASP.NET MVC
- **PHP**:  Laravel


---
# What we will focus on
.split-left[
- **Client side (front end)**
  - HTML / CSS / JavaScript fundamentals
  - Modern CSS Layout
  - Bootstrap
  - AJAX, SPA
  - Vue
- **Server side (back end)**
  - Node.js (JavaScript)
  - Express
]
.split-right[
**We will also focus on how these two ends are linked together**
- Sockets and TCP Programming
- DNS, and how the actual internet actually works
- HTTP, HTTPS, REST
**Along with supporting concepts**:  Databases, security, hosting, deployment
]

---
# Semester flow
- We will bounce between the front end and backend a lot.
- We will refined the same concepts, through abstraction.  This will mean we revisit topics several times.
- I will ask you to learn programming languages quickly, and to some extent, independently - while I focus on teaching you concepts.

.callout[
    You can't do web development without learning how to learn, fast.  Web Development changes fast - and part of my underlying goal is going to be to get you comfortable with this.  
    
    **It might be painful**.
]

---
class: center, middle, title_slide
# Online Format

---
# Asynchronous First
This class does not have **required** class meetings.  All of my lectures will be delivered through slides and video recordings.

The lecture slides and videos will be posted to Canvas continually, so you need to keep checking.

.callout[This format requires a lot of dedication and discipline on your part.  I have taught this format many times - it has a way of polarizing success/struggles]

**Recommendation:** Schedule two, 90-minute times per week to watch lecture videos, and keep the schedule.  Schedule our class like you would any other.

---
# I'm here.
Asynchronous does **NOT** mean you don't have access to me.  It really just means you have to reach out!

When you watch lecture videos, and you have questions, **email me**.  You can also attend out **recitations** (more in a moment).  

The worst thing you can do with this course is be confused and keep it a secret.  

Email me, **we will schedule time to meet over WebEx**.

---
# Resources
Canvas will have all of our lecture content, links to additional resources, and will be the place you submit all of your assignments.  **Please make sure you have access**.

You will need a computer that you can install software on.  Windows, MacOS, Linux - all good.

You should purchase the text books (see Canvas) - they are resources that have chapters that specifically relate to the concepts we will cover in class.  **You need a definitive source**.

---
class: center, middle, title_slide
# Workload and Policy

---
# Expectations
This course is **project-based**, meaning most of your grade will be from project work.  

On **some projects** I will allow you to work in teams of 2 or 3.  I will discuss this more as we approach the assignment of the first project.

**You will need to keep up with the work.  We will be moving fast.**

I do not expect that you have previous experience in Web Development, but I do expect that you have programmed before.

I do not expect you to know everything already... you should also not expect to be told everything.  Part of this course will be learning to learn some things on your own (with my guidance).

---
# Grading
You will have 5 (five) projects, worth 75% of your grade.
- Project 2 is a signficant project, around mid-semester.
- Project 5 is the most significant, due during Final Exams

You will also have weekly short quizzes, on Canvas.  These are designed not to be onerous, but to ensure you are keeping up.  They are worth 25% of your grade.

---
# Recitations
Each week we will have a 1 hour *recitation* on WebEx.  You will receive invitations soon.

Recitations are collaborative office hours.  They are optional, but they are worth your time.  **They will be recorded.**

Each week, I will lead the discussion at the beginning.  I will highlight important concepts we are learning, and ask you questions.  

Most of the session, however, will be your questions.  Typically these will be about projects, etc.  

Recitations alternate each week - Tuesdays and Thursdays at 4:30pm.

---
# Final comments
- Start reviewing Canvas in detail.
- Attend the recitation!
- Look out for my emails!


.callout[Understand that my main goal is to have you leave this course understanding that nothing in Web Development is **magical**.]