<div align="center">

# 🕰️ Knowledge Time Machine

### *Explore how ideas evolved across time — powered by AI*

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-knowledge--time--machine.onrender.com-d4af37?style=for-the-badge)](https://knowledge-time-machine.onrender.com/)
[![Django](https://img.shields.io/badge/Django-6.0.3-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Python](https://img.shields.io/badge/Python-3.14-3776AB?style=for-the-badge&logo=python)](https://python.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

</div>

---

## ✨ What is this?

**Knowledge Time Machine** is an AI-powered interactive timeline app. Type in **any concept** — *Artificial Intelligence, Blockchain, Alchemy, Quantum Computing* — and watch its entire history unfold as a beautiful, scrollable chronological timeline.

Each event is AI-generated, categorized, and visualized as a **watch-like chronograph** with glowing metallic nodes, stardust backgrounds, and a modern-ancient steampunk aesthetic. ⚙️

---

## 🎯 Features

| Feature | Description |
|---|---|
| 🔍 **Smart Search** | Search any concept and get an AI-generated historical timeline |
| 📜 **Interactive Timeline** | D3.js-powered horizontal watch-style chronograph |
| ✨ **Reactive Sparkles** | Background sparkles that react to your mouse cursor |
| ⚙️ **Watch Wheel** | Animated clockwork wheel on the home page |
| 🗂️ **Category Badges** | Events tagged as Research / Industry / Open Source / Milestone |
| 🕰️ **Modern-Ancient UI** | Gold + obsidian steampunk theme with Cinzel & Lora fonts |
| 💾 **History** | Recently explored topics saved and shown on the home page |

---

## 🛠️ Tech Stack

- **Backend** — Django 6.0.3 (Python)
- **AI** — [Groq API](https://groq.com/) (ultra-fast LLM inference)
- **Visualization** — D3.js v7
- **Frontend** — TailwindCSS CDN + Vanilla CSS + JS
- **Database** — PostgreSQL (production) / SQLite (local)
- **Hosting** — [Render](https://render.com)
- **Static Files** — WhiteNoise

---

## 🚀 Live Demo

> **[https://knowledge-time-machine.onrender.com/](https://knowledge-time-machine.onrender.com/)**

Try searching: `Alchemy`, `Artificial Intelligence`, `Blockchain`, `Quantum Computing`

---

## 🖥️ Run Locally

### 1. Clone the repo

```bash
git clone https://github.com/HarshaPradaC/Knowledge-Time-Machine.git
cd Knowledge-Time-Machine
```

### 2. Create a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Set up environment variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_groq_api_key_here
SECRET_KEY=your_django_secret_key_here
DEBUG=True
```

> Get a free Groq API key at [console.groq.com](https://console.groq.com)

### 5. Run migrations and start the server

```bash
python manage.py migrate
python manage.py runserver
```

### 6. Open in browser

```
http://127.0.0.1:8000/
```

---

## 🔑 Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ Yes | Your Groq API key for AI generation |
| `SECRET_KEY` | ✅ Yes | Django secret key |
| `DEBUG` | ⚙️ Optional | `True` for local, `False` for production |
| `DATABASE_URL` | ⚙️ Production | Auto-set by Render when PostgreSQL is linked |

---

## 📁 Project Structure

```
Knowledge-Time-Machine/
├── knowledge_time_machine/   # Django project config
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── timeline/                 # Main app
│   ├── models.py             # Topic & KnowledgeEvent models
│   ├── views.py              # Home & timeline views
│   ├── services.py           # Groq AI integration
│   └── urls.py
├── templates/                # HTML templates
│   ├── base.html
│   ├── home.html
│   └── timeline.html
├── static/
│   ├── css/style.css         # Modern-ancient theme styles
│   └── js/
│       ├── timeline.js       # D3.js watch chronograph
│       └── search.js         # Search interaction
├── requirements.txt
├── build.sh                  # Render build script
└── manage.py
```

---

## 🌐 Deploying to Render

1. Fork/push this repo to GitHub
2. Create a new **Web Service** on [render.com](https://render.com)
3. Set:
   - **Build Command:** `./build.sh`
   - **Start Command:** `gunicorn knowledge_time_machine.wsgi`
4. Add **Environment Variables**: `SECRET_KEY`, `DEBUG=False`, `GROQ_API_KEY`
5. Create a **PostgreSQL** database on Render and link it (auto-adds `DATABASE_URL`)
6. Deploy! 🚀

---

## 📸 Screenshots

> *Search any concept and watch history tick by...*

---

<div align="center">

Made with ❤️ and ⚙️ by [HarshaPradaC](https://github.com/HarshaPradaC)

⭐ Star this repo if you found it interesting!

</div>
