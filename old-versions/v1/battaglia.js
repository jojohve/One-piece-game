const player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
const player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

// Mappa per tracciare le carte sulle isole
const islands = {
    'isola-mare': [],
    'isola-fuoco': [],
    'isola-vento': [],
    'isola-ghiaccio': [],
    'isola-terra': [],
    'isola-oscura': []
};

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

let turnNumber = 1;
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
    turnNumber = 1;
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

// Funzione per usare la mossa speciale
function useSpecialMove(card, player) {
    if ((player === 1 && player1Actions.hasUsedSpecialMove) || (player === 2 && player2Actions.hasUsedSpecialMove)) {
        console.log("Hai già usato la mossa speciale in questo turno.");
        return;
    }

    console.log(`${card.name} ha usato la mossa speciale: ${card.specialMove.name}`);

    // Calcola correttamente l'indice della carta in base al giocatore
    const cardIndex = player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card);
    const cardElementId = `card-${player}-${cardIndex}`;
    const cardElement = document.getElementById(cardElementId);

    if (!cardElement) {
        console.error(`Elemento della carta con ID ${cardElementId} non trovato!`);
        return; // Esci se l'elemento non esiste
    }

    cardElement.classList.add('special-move-used');
    setTimeout(() => cardElement.classList.remove('special-move-used'), 1000);

    const opponentCards = player === 1 ? player2Cards : player1Cards;
    opponentCards.forEach((enemyCard) => {
        const enemyIslandName = getCardIsland(enemyCard, player === 1 ? 2 : 1);
        const attackerIslandName = getCardIsland(card, player);

        if (attackerIslandName === enemyIslandName) {
            enemyCard.hp -= card.specialMove.damage;
            updateCardDisplay(enemyCard, player === 1 ? 2 : 1, player === 1 ? player2Cards.indexOf(enemyCard) : player1Cards.indexOf(enemyCard));

            if (enemyCard.hp <= 0) {
                console.log(`${enemyCard.name} è stata eliminata!`);
                removeCardFromIsland(enemyCard, player === 1 ? 2 : 1);
                removeCardFromPlayerDeck(enemyCard, player === 1 ? player2Cards : player1Cards);
            }
        }
    });

    if (player === 1) {
        player1Actions.hasUsedSpecialMove = true;
    } else {
        player2Actions.hasUsedSpecialMove = true;
    }

    saveGameState();
    checkEndGame();
}

// Funzione per usare l'Haki
function useHaki(card, player) {
    if (card.usedHaki) {
        console.log(`${card.name} ha già usato l'Haki!`);
        return;
    }

    console.log(`${card.name} ha usato Haki: ${card.haki}`);

    if (card.haki === "Armatura") {
        card.hp += 20;
    }

    if (card.haki === "Osservazione") {
        card.nextAttackDamage = 0;
    }

    if (card.haki === "Conquistatore") {
        const playerCards = player === 1 ? player1Cards : player2Cards;
        playerCards.forEach(playerCard => {
            playerCard.hp += 20;
            updateCardDisplay(playerCard, player, playerCards.indexOf(playerCard));
        });
    }

    card.usedHaki = true;
    updateCardDisplay(card, player, player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card));
}

function removeCardFromPlayerDeck(card, playerCards) {
    const cardIndex = playerCards.indexOf(card);
    if (cardIndex !== -1) {
        playerCards.splice(cardIndex, 1);
        // Rimuovi la carta dal display
        const cardElement = document.getElementById(`card-${playerCards === player1Cards ? 1 : 2}-${cardIndex}`);
        if (cardElement) {
            cardElement.remove();
        }
        console.log(`${card.name} è stata rimossa dal mazzo.`);
    }
}

// Funzione per aggiornare la visualizzazione della carta
function updateCardDisplay(card, player) {
    const cardElement = document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`);
    const hpElement = cardElement.querySelector('.card-hp');
    const damageElement = cardElement.querySelector('.card-damage');

    if (hpElement) hpElement.innerText = `HP: ${card.hp}`;
    if (damageElement) damageElement.innerText = `${card.specialMove.damage}`;
}

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    event.target.classList.add('dragging');
}

document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('dragover', allowDrop);
    island.addEventListener('dragleave', removeHighlight); // Rimuove l'evidenza quando si esce
});

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault(); // Impedisce il comportamento predefinito del browser (necessario per il drop)

    if (event.target.classList.contains('island')) {
        event.target.classList.add('highlight'); // Evidenzia la zona di drop
    }
}

function removeHighlight(event) {
    if (event.target.classList.contains('island')) {
        event.target.classList.remove('highlight');
    }
}

function getCardIsland(card, player) {
    // Recupera l'isola su cui si trova la carta
    const islandNames = ['isola-mare', 'isola-fuoco', 'isola-vento'];
    let cardIsland = null;

    islandNames.forEach(islandName => {
        const islandElement = document.getElementById(islandName);
        if (islandElement.contains(document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`))) {
            cardIsland = islandName;
        }
    });

    return cardIsland;
}

// Funzione per rimuovere la carta dall'isola quando i punti vita sono 0
function removeCardFromIsland(card, player) {
    // Verifica se la carta ha 0 punti vita
    if (card.hp <= 0) {
        // Rimuovi la carta dalla mappa delle isole
        Object.keys(islands).forEach(islandName => {
            const island = islands[islandName];
            const cardIndex = island.indexOf(card);
            if (cardIndex !== -1) {
                island.splice(cardIndex, 1); // Rimuove la carta dalla lista dell'isola
            }
        });

        // Ora rimuovi la carta dall'interfaccia utente (HTML)
        const islandElement = document.getElementById(`island-${card.id}`);
        if (islandElement) {
            islandElement.innerHTML = ""; // Rimuove l'elemento HTML dell'isola
        }
        console.log(`${card.name} è stata rimossa dall'isola per aver esaurito i punti vita.`);
    }
}

// Funzione per gestire il drop della carta
function drop(event) {
    event.preventDefault(); // Necessario per il drop

    // Verifica se è già stato fatto un drop in questo turno
    if ((currentPlayer === 1 && player1Actions.hasDropped) || (currentPlayer === 2 && player2Actions.hasDropped)) {
        console.log("Hai già effettuato un drop in questo turno.");
        return;
    }

    const cardId = event.dataTransfer.getData("text");
    const cardElement = document.getElementById(cardId);
    const island = event.target;

    // Verifica che l'elemento target sia un'isola
    if (island.classList.contains('island')) {
        const cardIndex = parseInt(cardId.split('-')[2]);

        // Verifica che cardIndex sia un numero valido
        if (isNaN(cardIndex)) {
            console.error("Indice carta non valido");
            return;
        }

        // Assicurati che l'indice sia valido nell'array delle carte
        const card = currentPlayer === 1 ? player1Cards[cardIndex] : player2Cards[cardIndex];

        // Verifica che la carta esista
        if (!card) {
            console.error("Carta non trovata");
            return;
        }

        const preferredIslandNormalized = card.preferredIsland.toLowerCase().trim();
        const islandName = island.innerText.split("\n")[0].toLowerCase().trim();

        // Se l'isola preferita è la stessa, aumenta il danno della mossa speciale
        if (preferredIslandNormalized === islandName && !card.boosted) {
            card.specialMove.damage += 20;
            card.boosted = true;
        } else if (card.boosted) {
            card.specialMove.damage -= 20;
            card.boosted = false;
        }

        island.appendChild(cardElement);

        const damageElement = Array.from(cardElement.childNodes).find(node =>
            node.textContent && node.textContent.includes("Danno Mossa")
        );
        if (damageElement) {
            damageElement.textContent = `Danno Mossa: ${card.specialMove.damage}`;
        }

        // Aggiorna lo stato delle azioni per il giocatore attuale
        if (currentPlayer === 1) {
            player1Actions.hasDropped = true;
        } else {
            player2Actions.hasDropped = true;
        }
    }

    removeHighlight(event); // Rimuove l'evidenza dell'isola
}

document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('drop', drop); // Gestisce l'evento di drop
});

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
    } else {
        // Verifica se un giocatore ha conquistato tutte le isole
        const player1IslandsConquered = checkIslandsConquered(player1Cards);
        const player2IslandsConquered = checkIslandsConquered(player2Cards);

        if (player1IslandsConquered && !player2IslandsConquered) {
            alert("Giocatore 1 ha vinto! Ha conquistato tutte le isole.");
            showEndGameButton(); // Mostra il bottone per terminare la battaglia
        } else if (!player1IslandsConquered && player2IslandsConquered) {
            alert("Giocatore 2 ha vinto! Ha conquistato tutte le isole.");
            showEndGameButton(); // Mostra il bottone per terminare la battaglia
        }
    }
}

function checkIslandsConquered(playerCards) {
    const islandsOccupied = {
        'isola-mare': false,
        'isola-fuoco': false,
        'isola-vento': false
    };

    // Controlla per ogni carta se è sulla sua isola preferita
    playerCards.forEach(card => {
        const cardIsland = getCardIsland(card, playerCards === player1Cards ? 1 : 2);
        if (cardIsland) {
            islandsOccupied[cardIsland] = true;
        }
    });

    // Restituisce true se tutte le isole sono occupate dal giocatore
    return Object.values(islandsOccupied).every(island => island);
}

function showEndGameButton() {
    // Crea il bottone
    const endButton = document.createElement("button");
    endButton.textContent = "Termina Battaglia";
    endButton.id = "endGameButton";

    // Aggiungi il bottone alla pagina (ad esempio dentro il body)
    document.body.appendChild(endButton);

    // Aggiungi l'evento per resettare il gioco e tornare alla home
    endButton.addEventListener("click", function() {
        alert("La battaglia è stata terminata e il gioco è stato resettato.");
        resetGame(); // Reset del gioco
        window.location.href = "index.html"; // Torna alla pagina principale
    });
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