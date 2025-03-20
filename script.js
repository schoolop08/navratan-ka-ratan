let rounds = JSON.parse(localStorage.getItem("rounds")) || [
  [
    ["Ansh", "Daksh", "Rhythm"],
    ["Raghav", "Prince", "Gaurav"],
    ["Dev", "Manjeet", "Om"],
  ],
  [
    [], // Winners' battle (3 players from Round 1)
    [], // Comeback round (4 eliminated players)
  ],
  [
    [], // Semi-Final 1 (1 from Winners' battle + 1 from Comeback)
    [], // Semi-Final 2 (1 from Winners' battle + 1 from Comeback)
  ],
  [
    [], // Grand Final (2 winners from Semi-Finals)
  ],
];

function createBracket() {
  const roundsDiv = document.getElementById("rounds");
  roundsDiv.innerHTML = "";

  rounds.forEach((round, roundIndex) => {
    let table = document.createElement("table");
    table.innerHTML = `<tr><th>Match</th><th>Players</th><th>Winner</th></tr>`;
    let tbody = document.createElement("tbody");

    round.forEach((match, matchIndex) => {
      let row = document.createElement("tr");
      row.innerHTML = `<td>Round ${roundIndex + 1} - Match ${
        matchIndex + 1
      }</td>`;

      let playersCell = document.createElement("td");
      match.forEach((player) => {
        let div = document.createElement("div");
        div.className = "player active";
        div.textContent = player;
        div.draggable = true;
        div.ondragstart = (e) => dragStart(e, player, roundIndex, matchIndex);
        playersCell.appendChild(div);
      });
      row.appendChild(playersCell);

      let winnerCell = document.createElement("td");
      let dropZone = document.createElement("div");
      dropZone.className = "dropzone";
      dropZone.ondragover = (e) => e.preventDefault();
      dropZone.ondrop = (e) => dropWinner(e, roundIndex, matchIndex);
      dropZone.textContent = "Drag winner here";
      winnerCell.appendChild(dropZone);
      row.appendChild(winnerCell);
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
    roundsDiv.appendChild(table);
  });
}

function dragStart(event, player, roundIndex, matchIndex) {
  event.dataTransfer.setData("player", player);
  event.dataTransfer.setData("roundIndex", roundIndex);
  event.dataTransfer.setData("matchIndex", matchIndex);
}

function dropWinner(event, roundIndex, matchIndex) {
  event.preventDefault();
  let player = event.dataTransfer.getData("player");

  // Ensure the next round exists
  if (!rounds[roundIndex + 1]) rounds[roundIndex + 1] = [[], []];

  if (roundIndex === 0) {
    // Move 3 winners to Winners' Bracket, losers to Comeback
    let losers = rounds[roundIndex][matchIndex].filter((p) => p !== player);
    rounds[1][0].push(player); // Winner goes to Winners' Bracket
    rounds[1][1].push(...losers); // Losers go to Comeback Round
  } else if (roundIndex === 1) {
    // Move players to Semi-Finals
    if (rounds[2][0].length === 0) {
      rounds[2][0].push(player); // Semi-Final 1: Winner from Winners' Battle
    } else if (rounds[2][1].length === 0) {
      rounds[2][1].push(player); // Semi-Final 2: Another Winner from Winners' Battle
    } else if (rounds[2][0].length === 1) {
      rounds[2][0].push(player); // Semi-Final 1: 1 from Comeback
    } else {
      rounds[2][1].push(player); // Semi-Final 2: 1 from Comeback
    }
  } else if (roundIndex === 2) {
    // Semi-Finals winners → Grand Finals
    rounds[3][0].push(player);
  }

  // Update UI
  event.target.textContent = `Winner: ${player}`;
  event.target.classList.add("winner");
  event.target.draggable = true;
  event.target.ondragstart = (e) => dragStart(e, player, roundIndex + 1, 0);

  localStorage.setItem("rounds", JSON.stringify(rounds));
  createBracket();
}

function resetTournament() {
  rounds = [
    [
      ["Ansh", "Daksh", "Rhythm"],
      ["Raghav", "Prince", "Gaurav"],
      ["Dev", "Manjeet", "Om"],
    ],
    [[], []], // Winners and Comeback
    [[], []], // Two Semi-Finals
    [[]], // Grand Final
  ];
  localStorage.removeItem("rounds");
  createBracket();
}

createBracket();
