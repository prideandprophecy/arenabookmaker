const db = firebase.firestore();
const matchesList = document.getElementById('matches-list');

// Retrieve matches and display them
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
