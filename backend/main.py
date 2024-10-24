from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
from typing import List, Optional
from rapidfuzz import fuzz

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db_connection():
    conn = sqlite3.connect('clinical_trials.db')
    conn.row_factory = sqlite3.Row
    return conn

@app.get("/search")
def search_trials(
    query: str,
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0),
    sponsor: Optional[str] = None
):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Fetch unique sponsors matching the query (for sponsors list)
    sql_query_sponsors = '''
    SELECT DISTINCT `Sponsor`
    FROM trials
    WHERE trials MATCH ?
    AND `Sponsor` IS NOT NULL
    '''
    cursor.execute(sql_query_sponsors, (query,))
    sponsors_results = cursor.fetchall()
    sponsors = sorted([row["Sponsor"] for row in sponsors_results])

    # Fetch trials matching query and sponsor (if provided)
    sql_query = '''
    SELECT `NCT Number`, `Study Title`, `Sponsor`, `Phases`, `Start Date`, `Completion Date`
    FROM trials
    WHERE trials MATCH ?
    '''
    params = [query]
    if sponsor:
        sql_query += " AND `Sponsor` = ?"
        params.append(sponsor)

    cursor.execute(sql_query, tuple(params))
    results = cursor.fetchall()
    conn.close()

    if not results:
        raise HTTPException(status_code=404, detail="No trials found.")

    # Use rapidfuzz for fuzzy querying and sort results based on fuzz ratio
    sorted_results = sorted(
        results,
        key=lambda row: fuzz.ratio(query, row["Study Title"]),
        reverse=True
    )

    # Apply pagination
    paginated_results = sorted_results[offset:offset + limit]

    return {
        "trials": [dict(row) for row in paginated_results],
        "sponsors": sponsors
    }
