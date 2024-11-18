// Carica le carte dei giocatori
let player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
let player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

// Mappa per tracciare le carte sulle isole
const islands = {
    'isola-mare': [],
    'isola-fuoco': [],
    'isola-vento': []
};

let currentPlayer = 1;
let turnNumber = 1;

function toggleTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    turnNumber++;
    document.getElementById('turn-number').innerText = turnNumber;
    document.getElementById('current-player').innerText = currentPlayer;

    // Abilita/Disabilita i bottoni dei giocatori
    document.getElementById('end-turn-1').disabled = currentPlayer !== 1;
    document.getElementById('end-turn-2').disabled = currentPlayer !== 2;
}

// Aggiungi evento ai bottoni di fine turno
document.getElementById('end-turn-1').addEventListener('click', toggleTurn);
document.getElementById('end-turn-2').addEventListener('click', toggleTurn);

// Funzione per visualizzare le carte dei giocatori
function displayTeam(player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const cardList = document.getElementById(`player${player}-cards`);
    cardList.innerHTML = ''; // Pulisce l'area

    playerCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-${player}-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: <span class="card-hp">${card.hp}</span><br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno Mossa: <span class="card-damage">${card.specialMove.damage}</span><br>
            Isola Preferita: ${card.preferredIsland}<br>
            <div class="card-actions">
                <button class="haki-button">Usa Haki</button>
                <button class="special-move-button">Usa Mossa Speciale</button>
            </div>
        `;
        // Eventi per drag and drop
        cardElement.addEventListener('dragstart', dragStart);
        cardElement.addEventListener('dragend', dragEnd);

        // Aggiungi la carta alla lista
        cardList.appendChild(cardElement);

        // Aggiungi gli eventi per i bottoni
        const hakiButton = cardElement.querySelector('.haki-button');
        const specialMoveButton = cardElement.querySelector('.special-move-button');

        // Aggiungi il listener per il bottone Haki
        hakiButton.addEventListener('click', () => useHaki(card, player));

        // Aggiungi il listener per il bottone Mossa Speciale
        specialMoveButton.addEventListener('click', () => useSpecialMove(card, player));
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    event.target.classList.add('dragging');
}

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('island')) {
        event.target.classList.add('highlight');
    }
}

function removeHighlight(event) {
    if (event.target.classList.contains('island')) {
        event.target.classList.remove('highlight');
    }
}

function useSpecialMove(card, player) {
    console.log(`${card.name} ha usato la mossa speciale: ${card.specialMove.name}`);

    // Aggiungi effetto visivo per l'uso della mossa speciale
    const cardElement = document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`);
    cardElement.classList.add('special-move-used');
    setTimeout(() => cardElement.classList.remove('special-move-used'), 1000);

    // Ottieni l'isola dell'attaccante
    const attackerIslandName = getCardIsland(card, player);

    // Infliggi danno alle carte nemiche che sono sulla stessa isola
    const opponentCards = player === 1 ? player2Cards : player1Cards;
    opponentCards.forEach((enemyCard, index) => {
        const enemyIslandName = getCardIsland(enemyCard, player === 1 ? 2 : 1);

        // Se l'attaccante e la carta nemica sono sulla stessa isola, infliggi danno
        if (attackerIslandName === enemyIslandName) {
            enemyCard.hp -= card.specialMove.damage;
            updateCardDisplay(enemyCard, player === 1 ? 2 : 1, index);
            console.log(`${enemyCard.name} ha ricevuto ${card.specialMove.damage} danni dalla mossa speciale di ${card.name} su isola ${attackerIslandName}`);

            // Verifica se la carta è stata eliminata (HP <= 0)
            // Se la carta è stata eliminata (HP <= 0)
            if (enemyCard.hp <= 0) {
                console.log(`${enemyCard.name} è stata eliminata!`);
                removeCardFromIsland(enemyCard, player === 1 ? 2 : 1);

                // Passa il mazzo corretto
                removeCardFromPlayerDeck(enemyCard, player === 1 ? player2Cards : player1Cards);
            }
        }
    });
}

function getCardIsland(card, player) {
    const cardElement = document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`);

    // Trova l'isola associata alla carta
    const cardIsland = cardElement ? cardElement.closest('.island') : null;
    return cardIsland ? cardIsland.id : null; // Restituisce il nome dell'isola o null se non trovata
}

function removeCardFromIsland(card, player) {
    const cardElement = document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`);

    // Trova l'isola e rimuovi la carta
    const island = getCardIsland(card, player);
    if (island) {
        const islandElement = document.getElementById(island);
        islandElement.removeChild(cardElement);
    }
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

// Funzione per usare l'Haki
function useHaki(card, player) {
    console.log(`${card.name} ha usato Haki: ${card.haki}`);

    // Haki "Armatura": aumenta i punti vita della carta
    if (card.haki === "Armatura") {
        card.hp += 20;
        console.log(`${card.name} ha ricevuto 20 HP grazie a Armatura. HP attuali: ${card.hp}`);
    }
    
    // Haki "Osservazione": riduce il danno del prossimo attacco a 0
    if (card.haki === "Osservazione") {
        // Imposta la variabile per ridurre a zero il danno al prossimo attacco
        card.nextAttackDamage = 0;  // Imposta a 0 il danno del prossimo attacco
        console.log(`${card.name} ha attivato Osservazione. Il prossimo attacco infliggerà 0 danni.`);
    }
    
    // Haki "Conquistatore": aumenta i punti vita a tutte le carte alleate
    if (card.haki === "Conquistatore") {
        const playerCards = player === 1 ? player1Cards : player2Cards;
        playerCards.forEach(playerCard => {
            playerCard.hp += 20;
            console.log(`${playerCard.name} ha ricevuto 20 HP grazie a Conquistatore. HP attuali: ${playerCard.hp}`);
            // Aggiorna la visualizzazione della carta
            updateCardDisplay(playerCard, player, playerCards.indexOf(playerCard));
        });
    }
    
    // Aggiorna la visualizzazione della carta
    updateCardDisplay(card, player, player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card));
}

// Funzione per aggiornare la visualizzazione della carta
function updateCardDisplay(card, player, index) {
    const cardElement = document.getElementById(`card-${player}-${index}`);
    const hpElement = cardElement.querySelector('.card-hp');
    const damageElement = cardElement.querySelector('.card-damage');

    // Aggiorna gli HP e il danno della mossa speciale
    if (hpElement) hpElement.innerText = `HP: ${card.hp}`;
    if (damageElement) damageElement.innerText = `${card.specialMove.damage}`;
}

// Funzione per il drag and drop (non modificata)
function drop(event) {
    event.preventDefault();

    const cardId = event.dataTransfer.getData("text");
    const cardElement = document.getElementById(cardId);
    const island = event.target; // Isola di destinazione

    if (island.classList.contains('island')) {
        // Trova il riferimento alla carta
        const cardIndex = parseInt(cardId.split('-')[2]);
        const card = player1Cards.concat(player2Cards)[cardIndex];

        // Normalizza i nomi per confronto
        const preferredIslandNormalized = card.preferredIsland.toLowerCase().trim();
        const islandName = island.innerText.split("\n")[0].toLowerCase().trim(); // Usa solo il nome dell'isola

        // Se la carta è posizionata sulla preferredIsland, applica il boost
        if (preferredIslandNormalized === islandName) {
            if (!card.boosted) {  // Se la carta non ha già il boost applicato
                card.specialMove.damage += 20;  // Applica il boost
                card.boosted = true;  // Segna la carta come "boostata"
            }
        } else {
            if (card.boosted) {  // Se la carta era boostata e viene spostata via dalla preferredIsland
                card.specialMove.damage -= 20;  // Rimuovi il boost
                card.boosted = false;  // Rimuovi lo stato di boost
            }
        }

        // Riposiziona la carta sull'isola
        island.appendChild(cardElement);
        cardElement.setAttribute('draggable', true); // Permetti di spostare di nuovo

        // Aggiorna il danno nella visualizzazione
        const damageElement = Array.from(cardElement.childNodes).find(node =>
            node.textContent && node.textContent.includes("Danno Mossa")
        );
        if (damageElement) {
            damageElement.textContent = `Danno Mossa: ${card.specialMove.damage}`;
        }

        console.log(`Carta ${card.name} posizionata su ${island.id} (${island.innerText})`);

        // Salva lo stato del gioco dopo il movimento
        saveGameState();
    }
    removeHighlight(event); // Rimuovi l'evidenziazione
}

function updateGameState(cardElement, island) {
    const cardId = cardElement.id;
    const cardIndex = cardId.split('-')[2];
    const playerCards = cardId.includes("1") ? player1Cards : player2Cards;
    const card = playerCards[cardIndex];

    console.log(`Carta ${card.name} posizionata su ${island.id} (${island.innerText})`);

    // Aggiorna lo stato del gioco
    saveGameState();
}

// Assegna eventi alle isole
document.querySelectorAll('.island').forEach((island) => {
    island.addEventListener('dragover', allowDrop);
    island.addEventListener('dragleave', removeHighlight);
    island.addEventListener('drop', drop);
});

// Inizializza le carte dei giocatori
displayTeam(1);
displayTeam(2);

function saveGameState() {
    localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
    localStorage.setItem('player2Cards', JSON.stringify(player2Cards));
    localStorage.setItem('turnNumber', turnNumber);
    localStorage.setItem('currentPlayer', currentPlayer);
}

function loadGameState() {
    player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
    player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];
    turnNumber = parseInt(localStorage.getItem('turnNumber')) || 1;
    currentPlayer = parseInt(localStorage.getItem('currentPlayer')) || 1;

    document.getElementById('turn-number').innerText = turnNumber;
    document.getElementById('current-player').innerText = currentPlayer;

    displayTeam(1);
    displayTeam(2);
}

// Carica lo stato del gioco al caricamento della pagina
loadGameState();
