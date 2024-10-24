#!/bin/bash
sqlite3 clinical_trials.db <<EOF
CREATE VIRTUAL TABLE trials USING fts5(
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
.import ctg-studies.csv trials
EOF
