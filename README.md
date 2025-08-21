#  MinuteMate

![Python](https://img.shields.io/badge/Python-3.10-blue?logo=python)
![Django](https://img.shields.io/badge/Django-5.2-green?logo=django)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![License](https://img.shields.io/badge/license-MIT-lightgrey)

> **MinuteMate** is an AI-powered meeting assistant that transcribes, summarizes, and organizes meeting notes — saving you time and boosting productivity.

---

## Features

*  **Upload audio recordings** of meetings
*  **AI-based transcription & summarization** (OpenAI + Gemini)
*  **User-friendly frontend** built with React + Tailwind
*  **Scalable backend** using Django
*  **Secure storage** of API keys & credentials via `.env`

---

## Project Structure

```plaintext
MInuteMate - Ultimez Technology/
├── backend/                # Django backend
│   ├── api/                # Meeting-related APIs
│   ├── backend/            # Core Django project
│   ├── db.sqlite3          # Local DB (ignored in git)
│   ├── manage.py
│   └── requirements.txt
│
├── frontend/               # React + Vite frontend
│   ├── src/                # Components & Pages
│   ├── public/
│   └── package.json
│
├── .gitignore
├── README.md
└── requirements.txt        # Python dependencies
```

---

##  Setup Guide

###  Backend (Django)

```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

###  Frontend (React + Vite)

```bash
cd frontend
npm install
npm run dev
```

---

##  Environment Variables

Create a `.env` file inside `backend/` :

```ini
# Django
SECRET_KEY=replace_me
DEBUG=True

# AI APIs
OPENAI_API_KEY=your_openai_key
GEMINI_API_KEY=your_gemini_key

# Google Service Account
# GOOGLE_APPLICATION_CREDENTIALS=path/to/service_account.json
```

---

##  Tech Stack

* **Backend**: Django 5.2 (Python 3.10+)
* **Frontend**: React 19, Vite, TailwindCSS 4
* **AI APIs**: OpenAI, Google Gemini
* **Auth & Storage**: Google Service Account, Django ORM

---

##  Live Demo

 Coming soon...
