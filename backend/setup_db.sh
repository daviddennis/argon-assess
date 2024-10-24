#!/bin/bash
sqlite3 clinical_trials.db <<EOF
DROP TABLE IF EXISTS trials;
DROP TABLE IF EXISTS original_trials;
EOF

sqlite3 clinical_trials.db <<'EOF'
CREATE TABLE original_trials (
    `NCT Number`,
    `Study Title`,
    `Study URL`,
    `Acronym`,
    `Study Status`,
    `Brief Summary`,
    `Study Results`,
    `Conditions`,
    `Interventions`,
    `Primary Outcome Measures`,
    `Secondary Outcome Measures`,
    `Other Outcome Measures`,
    `Sponsor`,
    `Collaborators`,
    `Sex`,
    `Age`,
    `Phases`,
    `Enrollment`,
    `Funder Type`,
    `Study Type`,
    `Study Design`,
    `Other IDs`,
    `Start Date`,
    `Primary Completion Date`,
    `Completion Date`,
    `First Posted`,
    `Results First Posted`,
    `Last Update Posted`,
    `Locations`,
    `Study Documents`
);
.mode csv
.import ctg-studies.csv original_trials
EOF

sqlite3 clinical_trials.db <<'EOF'
CREATE VIRTUAL TABLE trials USING fts5(
    `NCT Number`,
    `Study Title`,
    `Brief Summary`,
    `Study Results`,
    `Conditions`,
    `Sponsor`,
    `Phases`,
    `Start Date`,
    `Completion Date`,
);
EOF

sqlite3 clinical_trials.db <<'EOF'
INSERT INTO trials (
    `NCT Number`,
    `Study Title`,
    `Brief Summary`,
    `Study Results`,
    `Conditions`,
    `Sponsor`,
    `Phases`,
    `Start Date`,
    `Completion Date`
) SELECT
    `NCT Number`,
    `Study Title`,
    `Brief Summary`,
    `Study Results`,
    `Conditions`,
    `Sponsor`,
    `Phases`,
    `Start Date`,
    `Completion Date`
FROM original_trials;
EOF