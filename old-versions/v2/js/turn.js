// Recupera i mazzi dal localStorage
const player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
const player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

let currentPlayer = 0; // 0 non è un giocatore, usato per il lancio della moneta

// Variabili di stato per il controllo delle azioni per turno
let player1Actions = {
    hasDropped: false, // Controlla se il giocatore 1 ha già effettuato un drop
    hasUsedSpecialMove: false, // Controlla se il giocatore 1 ha già usato la mossa speciale
};

let player2Actions = {
    hasDropped: false, // Controlla se il giocatore 2 ha già effettuato un drop
    hasUsedSpecialMove: false, // Controlla se il giocatore 2 ha già usato la mossa speciale
};

let turnNumber = 0;
let player1HakiUsed = false;
let player2HakiUsed = false;
let gameStarted = false;

function startGame() {
    // Lancio della moneta per determinare chi inizia
    const coinFlip = Math.random() < 0.5 ? 'testa' : 'croce';
    console.log(`Testa o Croce: ${coinFlip}`);

    // Se esce "testa", inizia il giocatore 1, altrimenti il giocatore 2
    if (coinFlip === 'testa') {
        currentPlayer = 1;
        console.log('Giocatore 1 inizia!');
        document.getElementById('current-player').innerText = currentPlayer;
    } else {
        currentPlayer = 2;
        console.log('Giocatore 2 inizia!');
        document.getElementById('current-player').innerText = currentPlayer;
    }

    // Impostiamo tutte le carte disabilitate all'inizio
    disableCards();

    // Disabilitiamo i bottoni di fine turno inizialmente
    document.getElementById('end-turn-1').disabled = true;
    document.getElementById('end-turn-2').disabled = true;

    // Mostriamo il bottone di fine turno per il giocatore che inizia
    if (currentPlayer === 1) {
        document.getElementById('end-turn-1').disabled = false;
    } else {
        document.getElementById('end-turn-2').disabled = false;
    }
}

function resetGame() {
    // Reset dei turni e azioni
    turnNumber = 0;
    currentPlayer = Math.random() < 0.5 ? 1 : 2;
    document.getElementById('current-player').innerText = currentPlayer;
    document.getElementById('turn-number').innerText = turnNumber;

    player1Actions.hasDropped = false;
    player2Actions.hasDropped = false;
    player1Actions.hasUsedSpecialMove = false;
    player2Actions.hasUsedSpecialMove = false;
    player1HakiUsed = false;
    player2HakiUsed = false;

    // Disabilita le carte all'inizio
    disableCards(1);
    disableCards(2);

    // Imposta il bottone di fine turno
    document.getElementById('end-turn-1').disabled = currentPlayer !== 1;
    document.getElementById('end-turn-2').disabled = currentPlayer !== 2;

    // Rendi visibile il bottone per il giocatore che deve iniziare
    if (currentPlayer === 1) {
        document.getElementById('end-turn-1').disabled = false;
    } else {
        document.getElementById('end-turn-2').disabled = false;
    }

    // Pulisce le isole e il team
    resetIslands();
    displayTeam(1);
    displayTeam(2);
}

function resetIslands() {
    // Pulisce tutte le isole
    const islandElements = document.querySelectorAll('.island');
    islandElements.forEach(island => {
        island.innerHTML = `<span class="island-name">${island.innerText}</span>`;
    });
}

function disableCards(player) {
    const cards = document.querySelectorAll(`.card-${player}`); // Seleziona solo le carte del giocatore
    cards.forEach(card => {
        card.classList.add('disabled'); // Aggiungi la classe "disabled" per disabilitare la carta
    });
}

function enableCards(player) {
    const cards = document.querySelectorAll(`.card-${player}`); // Seleziona solo le carte del giocatore
    cards.forEach(card => {
        card.classList.remove('disabled'); // Rimuovi la classe "disabled" per abilitare la carta
    });
}

// Funzione per passare al prossimo turno
function nextTurn() {
    turnNumber++;
    console.log("Turno numero: " + turnNumber);
    document.getElementById('turn-number').innerText = turnNumber;

    // Resetta le azioni per il giocatore attuale
    if (currentPlayer === 1) {
        player1Actions.hasDropped = false;
        player1Actions.hasUsedSpecialMove = false;
    } else {
        player2Actions.hasDropped = false;
        player2Actions.hasUsedSpecialMove = false;
    }

    // Passa al prossimo giocatore
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    document.getElementById('current-player').innerText = currentPlayer;
    console.log(`Turno del Giocatore ${currentPlayer}`);

    // Abilita le carte del giocatore attivo
    enableCards(currentPlayer);

    // Disabilita le carte del giocatore non attivo
    const opponentPlayer = currentPlayer === 1 ? 2 : 1;
    disableCards(opponentPlayer);

    // Disabilita i bottoni di fine turno
    document.getElementById('end-turn-1').disabled = currentPlayer !== 1;
    document.getElementById('end-turn-2').disabled = currentPlayer !== 2;
}

// Aggiungi evento ai bottoni di fine turno
document.getElementById('end-turn-1').addEventListener('click', () => {
    nextTurn();
});
document.getElementById('end-turn-2').addEventListener('click', () => {
    nextTurn();
});

// Funzione per visualizzare le carte dei giocatori
function displayTeam(player) {
    const cardsContainer = document.getElementById(`player${player}-cards`);
    const cards = player === 1 ? player1Cards : player2Cards;
    cardsContainer.innerHTML = ''; // Pulisce l'area

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.classList.add('card', `card-${player}`);
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-${player}-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: <span class="card-hp">${card.hp}</span><br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: <span class="card-damage">${card.specialMove.damage}</span><br>
            ${card.preferredIsland}<br>
            Tipo: ${card.fruitType}<br>
            <div class="card-actions">
                <button class="haki-button">Usa Haki</button>
                <button class="special-move-button">Usa Mossa Speciale</button>
            </div>
        `;
        // Eventi per drag and drop
        cardElement.addEventListener('dragstart', dragStart);
        cardElement.addEventListener('dragend', dragEnd);

        // Aggiungi la carta alla lista
        cardsContainer.appendChild(cardElement);

        // Aggiungi gli eventi per i bottoni
        const hakiButton = cardElement.querySelector('.haki-button');
        const specialMoveButton = cardElement.querySelector('.special-move-button');

        // Aggiungi il listener per il bottone Haki
        hakiButton.addEventListener('click', () => useHaki(card, player));

        // Aggiungi il listener per il bottone Mossa Speciale
        specialMoveButton.addEventListener('click', () => useSpecialMove(card, player));
    });
}

function showEndGameButton() {
    // Crea il bottone
    const endButton = document.createElement("button");
    endButton.textContent = "Termina Battaglia";
    endButton.id = "endGameButton";

    // Aggiungi il bottone alla pagina (ad esempio dentro il body)
    document.body.appendChild(endButton);

    // Aggiungi l'evento per resettare il gioco e tornare alla home
    endButton.addEventListener("click", function () {
        alert("La battaglia è stata terminata e il gioco è stato resettato.");
        resetGame(); // Reset del gioco
        window.location.href = "index.html"; // Torna alla pagina principale
    });
}

// Funzione per il controllo della fine del gioco
function checkEndGame() {
    // Verifica se almeno una carta di ciascun giocatore è ancora viva
    const player1Alive = player1Cards.some(card => card.hp > 0);
    const player2Alive = player2Cards.some(card => card.hp > 0);

    // Verifica se tutte le carte di un giocatore sono morte
    if (!player1Alive) {
        alert("Giocatore 2 ha vinto! Tutte le carte del Giocatore 1 sono state eliminate.");
        showEndGameButton(); // Mostra il bottone per terminare la battaglia
    } else if (!player2Alive) {
        alert("Giocatore 1 ha vinto! Tutte le carte del Giocatore 2 sono state eliminate.");
        showEndGameButton(); // Mostra il bottone per terminare la battaglia
    }
}

// Salva lo stato del gioco
function saveGameState() {
    localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
    localStorage.setItem('player2Cards', JSON.stringify(player2Cards));
    localStorage.setItem('turnNumber', turnNumber);
    localStorage.setItem('currentPlayer', currentPlayer);
    localStorage.setItem('player1Actions', JSON.stringify(player1Actions));
    localStorage.setItem('player2Actions', JSON.stringify(player2Actions));
}

displayTeam(1); // Visualizza le carte per il giocatore 1
displayTeam(2); // Visualizza le carte per il giocatore 2

startGame(); // Avvia il gioco