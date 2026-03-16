# 🛡️ Guardian-V2 — Self-Healing LLM Bot

Guardian-V2 is a **fully localized AI-powered code assistant** designed to detect, repair, optimize, and translate code using a **self-healing architecture**.

The system runs **entirely on your local machine** and does not require external AI APIs.
It uses **Ollama with the Qwen2.5-Coder model** for local reasoning and integrates a **three-tier architecture**:

* React Frontend (Developer Dashboard)
* FastAPI Backend (AI orchestration layer)
* Ollama Local AI Engine (LLM inference)

This architecture ensures **privacy, faster response times, and no API costs**.

---

# 🏗 System Architecture

Guardian-V2 follows a **three-tier architecture**:

```
Frontend (React + Vite)
        │
        ▼
Backend API (FastAPI)
        │
        ▼
Local AI Engine (Ollama + Qwen2.5-Coder)
```

The backend builds structured prompts, routes requests to the local AI engine, and returns processed code to the user interface.

---

# 🚀 Features

* 🔧 **Code Healer** – Automatically detects and fixes bugs in source code
* ⚡ **Code Optimizer** – Refactors code for performance improvements
* 🌐 **Code Translator** – Converts code between programming languages
* 🔒 **Local AI Processing** – No external API calls required
* 📊 **Interactive Dashboard** – Developer-friendly interface for code analysis

---

# ⚙️ Prerequisites

Ensure the following tools are installed before running the system:

* **Ollama** – for local AI inference
* **Python 3.10+** – required for the FastAPI backend
* **Node.js & npm** – required for the React frontend

---

# ▶️ How to Run Guardian-V2

Follow these steps to launch the full stack environment.

---

# 1️⃣ Start the Local AI Engine (Ollama)

The system requires the **Qwen2.5-Coder model** to run locally.

Open your **first terminal window** and run:

```bash
ollama run qwen2.5-coder:1.5b
```

This launches the **local AI engine** used for reasoning tasks.

The engine runs at:

```
http://localhost:11434
```

---

# 2️⃣ Start the Orchestration Middleware (FastAPI)

The backend handles **prompt construction, validation, and routing**.

Open a **second terminal window**.

Navigate to the backend directory:

```bash
cd C:\Users\shari\Documents\GitHub\Self-Healing-LLM-BOT\backend
```

Activate your **Python virtual environment** if you are using one.

Start the FastAPI server:

```bash
uvicorn app.main:app --reload
```

Wait until you see the message:

```
Application startup complete
```

The backend API will now be available at:

```
http://127.0.0.1:8000
```

Swagger API documentation:

```
http://127.0.0.1:8000/docs
```

---

# 3️⃣ Launch the User Interface (React)

The frontend provides the **dashboard interface** to interact with Guardian-V2.

Open a **third terminal window**.

Navigate to the frontend directory:

```bash
cd C:\Users\shari\Documents\GitHub\Self-Healing-LLM-BOT\frontend
```

Install dependencies (only required the first time):

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend dashboard will start at:

```
http://localhost:5173
```

---

# ✅ System Verification

Once all three services are running, you should be able to access:

| Component          | URL                        |
| ------------------ | -------------------------- |
| Frontend Dashboard | http://localhost:5173      |
| Backend API        | http://127.0.0.1:8000      |
| Backend API Docs   | http://127.0.0.1:8000/docs |
| Ollama Engine      | http://localhost:11434     |

---

# 🔄 Typical Workflow

1. User submits code in the **Guardian-V2 dashboard**
2. React frontend sends the request to **FastAPI backend**
3. Backend builds a structured prompt
4. Request is sent to **Ollama's Qwen model**
5. AI processes the request (fix / optimize / translate)
6. The response is returned and displayed in the UI

---

# 🧰 Tech Stack

| Layer         | Technology      |
| ------------- | --------------- |
| Frontend      | React, Vite     |
| Backend       | FastAPI, Python |
| AI Engine     | Ollama          |
| Model         | Qwen2.5-Coder   |
| Communication | REST API        |

---

# 👩‍💻 Author

**Haritha**
Artificial Intelligence & Data Science 

---

# 📜 License

This project is released under the **MIT License**.
