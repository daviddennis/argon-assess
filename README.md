# Clinical Trials Search Application

## Overview
This application allows users to search through clinical trials data. One example is searching for topics related to Non Small Cell Lung Cancer (NSCLC) and immunotherapy treatments. The user can further filter by Sponsor, providing a view into the competitive landscape among trial companies.

## Setup Instructions

### Prerequisites
- Python 3.7+
- SQLite w/ FTS installed on your system
- `ctg-studies.csv` file placed in the project directory

### Backend Setup

1. **Install requirements**:
```
Optional: Create a virtualenv
pip install -r backend/requirements.txt
```

2. **Load Data**:
```./backend/setup_db.sh```

3. **Run the Backend**:
```
cd backend
uvicorn main:app --reload
```

4. **Run the Frontend**:
```
cd frontend
npm install -D tailwindcss postcss autoprefixer
npm run dev
```

5. **Search**
```
Navigate to http://localhost:3000 and search for NSCLC
```