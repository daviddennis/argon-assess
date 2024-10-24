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

    # Fetch trials matching query and sponsor (if provided)
    sql_query = '''
    SELECT `NCT Number`, `Study Title`, `Sponsor`, `Phases`, `Start Date`, `Completion Date`, `Conditions`
    FROM trials
    WHERE trials MATCH ?
    '''
    params = [query]
    if sponsor:
        sql_query += " AND `Sponsor` = ?"
        params.append(sponsor)

    cursor.execute(sql_query, params)
    results = cursor.fetchall()
    sponsors = sorted(list(set([row["Sponsor"] for row in results])))
    conn.close()

    if not results:
        raise HTTPException(status_code=404, detail="No trials found.")

    # Prepare query variants for query expansion
    # (This is just an example, we would turn this into a separate DB table for query expansion)
    query_variants = [query]
    if query.lower() == 'nsclc':
        query_variants.extend(['Non-Small Cell Lung Cancer', 'non small cell lung carcinoma'])

    # Apply fuzzy matching
    scored_results = []
    for row in results:
        row_dict = dict(row)
        combined_text = ' '.join(filter(None, [
            row_dict.get("Study Title", ''),
            row_dict.get("Brief Summary", ''),
            row_dict.get("Study Results", ''),
            row_dict.get("Conditions", ''),
        ]))
        max_similarity = max(
            fuzz.token_set_ratio(variant, combined_text) for variant in query_variants
        )
        row_dict["similarity_score"] = max_similarity
        scored_results.append(row_dict)

    # Sort results based on similarity score
    sorted_results = sorted(
        scored_results,
        key=lambda row: row["similarity_score"],
        reverse=True
    )

    # Apply pagination
    paginated_results = sorted_results[offset:offset + limit]

    # Remove the 'similarity_score' before returning
    for row in paginated_results:
        row.pop("similarity_score", None)

    return {
        "trials": [dict(row) for row in paginated_results],
        "sponsors": sponsors
    }
