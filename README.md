# 💬 MERN Chatbot

A simple chatbot application built using the **MERN Stack (MongoDB, Express.js, React, Node.js)**.  
This chatbot allows users to send messages, receive responses, and stores conversation data in MongoDB.  

---

## 📌 Features
- ⚡ Real-time chat interface
- 🗄️ Stores chat history in MongoDB
- 🔄 REST API for backend communication
- 🎨 User-friendly UI built with React
- 🚀 Deployed-ready MERN stack architecture

---

## 🛠️ Tech Stack
- **Frontend:** React.js, Axios, TailwindCSS (or your styling choice)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Compass / Atlas)
- **Other Tools:** Postman (API testing), GitHub for version control

---

## 📂 Project Structure
```bash
MERN-Chatbot/
│
├── backend/        # Node.js + Express.js server
│   ├── models/     # MongoDB models
│   ├── routes/     # API routes
│   ├── server.js   # Entry point
│
├── frontend/       # React.js frontend
│   ├── src/
│   │   ├── components/   # Chat UI components
│   │   ├── App.js
│   │   ├── index.js
│
├── README.md       # Project Documentation

⚙️ Installation & Setup

1. Clone the Repository
git clone https://github.com/your-username/mern-chatbot.git
cd mern-chatbot

2. Setup Backend
cd backend
npm install


Create a .env file in the backend folder and add:

MONGO_URI=your-mongodb-uri
PORT=5000
API=your_api_key


Start backend:

npm start

3. Setup Frontend
cd ../frontend
npm install
npm start