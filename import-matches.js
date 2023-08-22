const admin = require('firebase-admin');
const fs = require('fs');
const Papa = require('papaparse');

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Read the CSV file
const csvString = fs.readFileSync('./matchimport.csv', 'utf8');

// Parse the CSV string using Papa.parse
const result = Papa.parse(csvString, {
  header: true,
  skipEmptyLines: true
});

// Process the records
result.data.forEach(record => {
  // You can set a default status here if you want
  const status = record.status || 'pending';

  // Create a match object
  const match = {
    home: record.home,
    away: record.away,
    match_name: record.match_name,
    odds: record.odds,
    status: status,
    date: record.date,
    time: record.time
  };

  // Add the match to Firestore
  db.collection('Matches').add(match)
    .then(docRef => {
      console.log(`Added match with ID: ${docRef.id}`);
    })
    .catch(error => {
      console.error(`Error adding match: ${error}`);
    });
});
