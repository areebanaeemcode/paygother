# Pay-Together 🌍💸
### Collaborative Expense Management, Spending Limit Alerting & Debt Settlement System for Group Travel

[![Django](https://img.shields.io/badge/Django-6.0+-092e20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![Django REST Framework](https://img.shields.io/badge/DRF-3.17+-a30000?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![Python](https://img.shields.io/badge/Python-3.10+-3776ab?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![JWT Auth](https://img.shields.io/badge/JWT-SimpleJWT-black?style=for-the-badge&logo=jsonwebtokens)](https://jwt.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Status](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)]()

---

## 📌 Executive Summary

**Pay-Together** is a full-featured collaborative travel financial platform built to eliminate friction in group travel expense management. During group tours, individuals repeatedly pay for collective utilities (e.g., fuel, accommodation, meals, activities) leading to messy spreadsheets, confusion over shared liabilities, and awkward reconciliation disputes.

Pay-Together addresses this by introducing:
1. **Real-time Shared Ledgers** with customizable splitting models (Equal, Unequal, Share-based).
2. **Optimal Debt Settlement Engine** minimizing complex $N$-party debts into the fewest direct transactions using a bipartite net-balance greedy algorithm.
3. **Automated Spending Limit Alerting** that dynamically warns organizers when budgets exceed safe thresholds (75%, 90%, 100%+).
4. **Dual-Interface Platform**: Responsive mobile-friendly Client Portal + Access-Pass Gated Administrative Management Dashboard.
5. **Automated PDF Documentation & Reports** generator for comprehensive audit and tour receipts.

---

## 🚀 Key Features

### 🧳 1. Tour & Member Lifecycle Management
* **Instant Group Formation:** Create tours with customized destination metadata, total budget cap, and currency.
* **Tokenized Join Links:** One-click onboarding via unique join tokens and shareable URLs without complex invites.
* **Role-Based Access Control (RBAC):** Distinct permissions for Tour Organizers, Active Members, and Auditors.

### 💳 2. Expense Logging & Multi-Split Modes
* **Categorized Expenses:** Pre-populated and custom categories (*Fuel, Dining, Hotels, Jeep Rentals, Tolls, Groceries*).
* **Flexible Cost Splitting:**
  * **Equal Split:** Distributed equally among selected members.
  * **Custom Amount Split:** Explicit per-member debt allocation.
  * **Proportional / Share-based:** Weight-based allocation.
* **Digital Receipt Attachment:** Upload bills and proof of payment directly to expenses.

### ⚡ 3. Optimal Settlement Engine (Debt Minimization)
* Computes each member’s **Net Balance**:  
  $$\text{Net Balance} = \sum \text{Paid} - \sum \text{Owed}$$
* Eliminates circular debts (e.g., A owes B, B owes C, C owes A) and condenses multi-person transfers into the mathematically optimal minimum transfer set.
* Generates step-by-step payment instructions with instant settlement status toggles.

### 🔔 4. Smart Budget Limits & Notification Pipeline
* Real-time budget consumption tracking.
* Warning alerts upon crossing custom budget thresholds.
* In-app notification center for pending settlements, new expenses, and tour status updates.

### 📊 5. Analytics & Audit Reporting
* Dynamic interactive category breakdown charts.
* Real-time calculation of highest spenders, largest categories, and average expense per person.
* One-click PDF export of final tour expense summaries and settlement receipts.

---

## 🏗️ Architecture & Technology Stack

```
Pay-Together (Full-Stack Architecture)
├── Presentation Layer: Modern Vanilla CSS + Tailwind, Modular JavaScript, FontAwesome 6, Charts
├── Application Layer:  Django 6.0 + Django REST Framework (DRF)
├── Auth & Security:    SimpleJWT (Bearer tokens) + Django Session Gate + PBKDF2 Hashing
├── Business Logic:     Debt Settlement Engine (Bipartite Minimization), Budget Watcher
└── Storage Layer:      SQLite (Dev) / MySQL (Prod ready), File System Media Storage
```

### Backend
* **Language:** Python 3.10+
* **Framework:** Django 6.0
* **API:** Django REST Framework (DRF) with SimpleJWT
* **Database:** SQLite3 / MySQL (compatible via `mysqlclient`)

### Frontend
* **UI/UX:** Responsive HTML5 templates, Tailwind CSS utilities, Custom Glassmorphism styling
* **Icons:** FontAwesome 6 Pro-compatible icon suite
* **Client Scripts:** Vanilla JS modules (offline storage fallback, dynamic modals, live settlements)

---

## 📁 Repository Structure

```text
pay-together/
├── FYP/                                # Core Django Application
│   ├── apps/
│   │   ├── accounts/                   # User authentication, OTP verification, profiles
│   │   ├── cores/                      # Gateways, middleware, shared context processors
│   │   ├── expenses/                   # Expense models, serializers, limit checkers
│   │   ├── notifications/              # Alerts, hooks, in-app notification pipeline
│   │   ├── reports/                    # Analytics calculation, summaries
│   │   └── tours/                      # Tour entities, memberships, settlement engine
│   ├── core/                           # Django project settings and routing
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── client_portal_urls.py
│   ├── static/                         # Static assets (CSS, JS, fonts, images)
│   ├── templates/                      # Modular HTML5 templates (Auth, Tours, Admin, Dashboard)
│   ├── manage.py                       # Django CLI utility
│   └── requirements.txt                # Python project dependencies
│
├── Pay_Together_FCIT_FYDP_Complete_Documentation.md # Complete Academic FYDP Specification
├── Pay_Together_FCIT_FYDP_Final_Report.pdf          # Formatted Final Report (PDF)
├── Pay_Together_FYP_Viva_Questions_and_Answers.pdf  # Comprehensive Viva Defense Guide
├── build_50page_fyp_documentation.js                # Documentation automation script
├── .gitignore                          # Git exclusions (venvs, secrets, cache)
└── README.md                           # Project documentation
```

---

## ⚙️ Installation & Local Setup

Follow these steps to run Pay-Together locally:

### 1. Clone the Repository
```bash
git clone https://github.com/MuzammalNazeer/pay-together.git
cd pay-together/FYP
```

### 2. Create and Activate Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux / macOS
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the `FYP/` directory:
```env
SECRET_KEY=your-secure-django-secret-key
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
```

### 5. Apply Database Migrations
```bash
python manage.py migrate
```

### 6. (Optional) Seed Demo Data & Superuser
```bash
# Create an admin user
python manage.py createsuperuser

# Or run the dev seed script (if available in scripts/)
python scripts/seed_dev.py
```

### 7. Start the Development Server
```bash
python manage.py runserver 127.0.0.1:8000
```

Open your browser and navigate to:
* **Landing Page:** [http://127.0.0.1:8000/](http://127.0.0.1:8000/)
* **Client Portal:** [http://127.0.0.1:8000/client/](http://127.0.0.1:8000/client/)
* **Django Admin:** [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/token/` | Obtain JWT Pair (Access + Refresh) | Public |
| `POST` | `/api/token/refresh/` | Refresh expired Access Token | Public |
| `GET/POST` | `/client/tours/` | List and Create Tours | Authenticated |
| `GET` | `/client/tours/<uuid>/` | Tour Detail, Ledger & Balances | Tour Member |
| `POST` | `/client/tours/<uuid>/join/`| Join a tour via Token | Authenticated |
| `POST` | `/client/expenses/create/` | Record new expense & trigger split | Tour Member |
| `GET` | `/client/tours/<uuid>/settlement/` | Compute minimal debt transfers | Tour Member |
| `GET` | `/client/notifications/` | Fetch user alerts & thresholds | Authenticated |

---

## 🎓 Academic Credit & Recognition

* **Project:** Final Year Design Project (FYDP)
* **Degree:** Bachelor of Science in Software Engineering / Computer Science (2021–2025)
* **Institution:** Faculty of Computing & Information Technology (FCIT), **University of the Punjab, Lahore**
* **Project Supervisor:** Prof. Dr. Engr. Shahzad Sarwar

---

## 📄 License

This project was developed for academic evaluation and demonstration. All rights reserved by the original authors and FCIT, University of the Punjab.
