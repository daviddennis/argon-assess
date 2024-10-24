**Bonus Questions**

1. NSCLC has many different representations in the dataset. For example, it could be “non small cell lung cancer”, “non small cell lung carcinoma”, “NSCLC”, “carcinoma of the lungs, non small cell”, etc. How do we capture all the relevant clinical trials for searches on any disease?

Answer:
- Add specialized disease search endpoint + search textbox
- Synonym Expansion: Use medical ontologies like UMLS or SNOMED CT to add disease synonyms, then expand search query accordingly
    - Can also use an LLM during preprocessing to find more synonyms

2. How do we allow her to search for NSCLC trials -AND- immunotherapy related drugs?

Answer:
- Add boolean operators to trial search
- Preprocess to identify all drug names in the data, store in a separate table mapped to trials, then provide specialized search endpoint for filtering. Add drug filter/dropdown to FE.

3. How would you deploy your software?

Answer: 
- Add a test suite + logging
- Move to managed postgres, integrate elasticsearch and add long running process to index data
- I'd probably dockerize backend and frontend, then deploy containers with Kubernetes

4. What are the alternatives to loading the dataset into memory, and why would you want to use those alternatives?

Answer:
- The app I built uses an SQLite DB to avoid reading the entire CSV into memory. Loading everything into memory is not a scalable solution as the entire CSV would have to be read every time the server starts up.

5. How do we evaluate completeness of results?

Answer:
- We could compare search query results for this tool against a benchmark test set
- Provide precise metrics on recall & precision for a set of given queries, adjust accordingly to reach preferred performance goals