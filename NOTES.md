**Bonus Questions**

1. NSCLC has many different representations in the dataset. For example, it could be “non small cell lung cancer”, “non small cell lung carcinoma”, “NSCLC”, “carcinoma of the lungs, non small cell”, etc. How do we capture all the relevant clinical trials for searches on any disease?

Answer:
- Add specialized disease search endpoint + search textbox
- Synonym Expansion: Use medical ontologies like UMLS or SNOMED CT to add disease synonyms, then expand search query accordingly
    - Can also use an LLM during preprocessing to find more synonyms

2. How do we allow her to search for NSCLC trials -AND- immunotherapy related drugs?

Answer:
- Preprocess to identify all drug names in the data, store in separate mapping table, then provide specialized search endpoint for filtering. Add drug filter/dropdown to FE.
- Add boolean operators to trial search

3. How would you deploy your software?

Answer: 
- Add a test suite + logging
- Move to managed postgres, integrate elasticsearch
- I'd probably dockerize backend and frontend, then deploy containers with Kubernetes

4. What are the alternatives to loading the dataset into memory, and why would you want to use those alternatives?

Answer:
- The app I built uses an SQLite DB to avoid reading the entire CSV into memory. Loading everything into memory is not a scalable solution as the entire CSV would have to be read every time the server starts up.

5. How do we evaluate completeness of results?