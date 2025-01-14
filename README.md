# AI Planet Full Stack Internship Assignment

This project is a React-based chat application that allows users to upload PDF files, ask AI-powered questions, and receive intelligent responses. The backend is built using FastAPI, ensuring a seamless and responsive experience.

---

## Contact Information
**E-mail: **vittalkatwe@gmail.com****

**Phone Number: **8431465059****

## Features

- PDF Upload for AI Processing
- AI-Powered Question and Answer System
- Scalable Frontend and Backend Architecture

---

## Prerequisites

Before setting up the project, ensure the following software is installed:

- **Node.js** (v16 or later)  
- **npm** (Node Package Manager)  
- **Python 3.9 or later**  
- **pip** (Python package manager)

---

## Getting Started

Follow these steps to set up the application:

### 1. Clone the Repository

```bash
git clone https://github.com/vittalkatwe/Personalized-Document-AI.git
cd Personalized-Document-AI
```

### 2. Setup Frontend
```bash
npm install
npm run dev
```

The frontend will run at http://localhost:5173.


### 3. Setup Backend ()
Open a new terminal
```bash
cd backend
pip install -r requirements.txt
```
If there are any issues installing the dependencies, try installing them without the versions (open requirements.txt, and remove the "==version" and then try installing them again), if the issue persists try some open source solutions.

```bash
python3 -m uvicorn server:app --reload
or
python -m uvicorn server:app --reload
```
The backend will be running at http://localhost:8000

### 4. Environment Configuration
Open the .env present in the root directory
```bash
COHERE_API_KEY=paste-your-api-key
```


## How to Get Your Cohere API Key

To obtain your Cohere API key, follow these steps:

1. Visit [Cohere.com](https://cohere.com/).
2. Log in and enter your details.
3. Navigate to **Dashboard** in the navbar.
4. Navigate to **API Keys** in the side navbar.
5. Copy the **Trial API Key** provided and use it in your project.

# Application Architecture
This application is designed with a full-stack architecture to ensure a seamless user experience and efficient performance:

### Frontend:
Built using **React.js**, the frontend is responsible for rendering the user interface and handling interactions. It communicates with the backend API to fetch AI-powered responses.

### Backend:
Developed with **FastAPI**, the backend processes user inputs, interacts with the **Cohere API** for natural language processing, and sends responses back to the frontend.

### AI Integration:
Leverages **Cohere API** for generating intelligent responses based on the uploaded PDF content and user queries.

### PDF Parsing:
Extracts content from uploaded PDFs to enable AI-powered query processing.

### Deployment:
Designed for deployment on cloud platforms like **AWS**, **Heroku**, or **Vercel**, enabling scalability and high availability.

# The contact information is provided above
