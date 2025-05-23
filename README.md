# AI-Powered CRM Platform

An intelligent, AI-enhanced Customer Relationship Management (CRM) platform built to manage leads, track interactions, and boost productivity using smart suggestions and automation.

---

## Features

- Lead Management: Add, update, and view customer leads.
- Email Tab: Compose and track email communications.
- Notes & Activities: Log tasks, meetings, and notes.
- Follow-up Scheduler: Never miss a lead with timely reminders.
- Dashboard: Overview of performance and activity.

---

## Tech Stack

**Frontend:**
- React.js
- Vite
- Tailwind CSS (or your preferred styling library)

**Backend:**
- Node.js
- Express.js

**Database:**
- MongoDB (via Mongoose)

**Others:**
- SendGrid API for Emails
- dotenv for environment config


## How to Run 

- clone the repo : git clone https://github.com/Sandeepreddi/CRM.git
- open the root folder 

**Keys**

.env
MONGO_URI=your_mongodb_connection_string
SENDGRID_API_KEY=your_sendgrid_key
PORT=5000

**Frontend**
- cd frontend
- npm install 
- npm run dev

**Backend**
- cd backend
- npm install 
- npm start


---

## 📁 Project Structure

├── backend
│ ├── controllers
│ ├── models
│ ├── routes
│ ├── utils
│ └── server.js
├── frontend
│ ├── src
│ │ ├── components
│ │ ├── functions
│ │ └── main.jsx
├── .env (excluded from Git)
├── .gitignore
├── package.json
└── README.md
