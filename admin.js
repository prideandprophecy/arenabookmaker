const matchesList = document.getElementById('matches-list');

// Retrieve matches and display them
function loadMatches() {
  matchesList.innerHTML = ''; // Clear existing matches
  db.collection('Matches').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      const match = doc.data();
      matchesList.innerHTML += `
        <div>
          <h3>${match.match_name}</h3>
          <p>${match.home} vs ${match.away}</p>
          <p>Status: ${match.status}</p>
          <button onclick="updateOutcome('${doc.id}', 'win')">Mark as Win</button>
          <button onclick="updateOutcome('${doc.id}', 'lose')">Mark as Lose</button>
        </div>`;
    });
  });
}

// Function to update match outcome and handle bets
function updateOutcome(matchId, outcome) {
  // Update the match's status to "finished"
  db.collection('Matches').doc(matchId).update({ status: 'finished' })
    .then(() => {
      // Retrieve bets for this match
      db.collection('Bets').where('match_id', '==', matchId).get()
        .then((querySnapshot) => {
          querySnapshot.forEach((betDoc) => {
            const bet = betDoc.data();
            // Determine the outcome and update the user's credits
            // ...

            // Update the bet's outcome field
            betDoc.ref.update({ outcome: outcome });
          });
        });
    })
    .catch((error) => {
      alert('Error updating outcome: ' + error.message);
    });
}

// Function to add a new match
document.getElementById('add-match-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const home = document.getElementById('home').value;
  const away = document.getElementById('away').value;
  const matchName = document.getElementById('match_name').value;
  const odds = document.getElementById('odds').value;
  const status = document.getElementById('status').value;

  db.collection('Matches').add({
    home: home,
    away: away,
    match_name: matchName,
    odds: Number(odds),
    status: status
  })
  .then(() => {
    alert('Match added successfully!');
    loadMatches(); // Reload matches to display the new match
  })
  .catch((error) => {
    alert('Error adding match: ' + error.message);
  });
});

// Load matches when the page loads
loadMatches();
