import { availableCards } from './cards.js';

let player1Cards = [];
let player2Cards = [];

// Funzione per visualizzare tutte le carte disponibili
function createCardElement(card, player, isInPlayerMazzo = false) {
    if (!card) {
        console.error("La carta non è definita");
        return; // Uscita dalla funzione se la carta non è definita
    }

    const cardElement = document.createElement('div');
    cardElement.id = `card-${card.id}`; // Usa l'ID della carta
    cardElement.classList.add('card');
    cardElement.dataset.id = card.id; // Assegna l'ID al dataset
    cardElement.innerHTML = `
        <h3>${card.name}</h3>
        <p>HP: ${card.hp}</p>
        <p>Haki: ${card.haki}</p>
        <p>Mossa Speciale: ${card.specialMove.name} (${card.specialMove.damage} danni)</p>
        <p>Isola Preferita: ${card.preferredIsland}</p>
        <p>Frutto: ${card.fruitType}</p>
    `;

    if (isInPlayerMazzo) {
        // Aggiungi solo il pulsante "Rimuovi" se la carta è già in un mazzo
        const removeButton = document.createElement('button');
        removeButton.textContent = "Rimuovi dal Mazzo";
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => removeCardFromMazzo(card, player));
        cardElement.appendChild(removeButton);
    } else {
        // Aggiungi pulsanti "Aggiungi al Mazzo 1" e "Aggiungi al Mazzo 2"
        const addButtonPlayer1 = document.createElement('button');
        addButtonPlayer1.textContent = "Aggiungi al Mazzo 1";
        addButtonPlayer1.classList.add('add-button');
        addButtonPlayer1.addEventListener('click', () => addCardToMazzo(card, 1));
        cardElement.appendChild(addButtonPlayer1);

        const addButtonPlayer2 = document.createElement('button');
        addButtonPlayer2.textContent = "Aggiungi al Mazzo 2";
        addButtonPlayer2.classList.add('add-button');
        addButtonPlayer2.addEventListener('click', () => addCardToMazzo(card, 2));
        cardElement.appendChild(addButtonPlayer2);
    }

    return cardElement;
}

// Funzione per visualizzare le carte disponibili nel DOM
function displayAvailableCards() {
    const availableCardsContainer = document.getElementById('available-cards');
    availableCardsContainer.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le carte

    availableCards.forEach(card => {
        if (card) { // Verifica che la carta sia definita
            // Passa null come player e false per il parametro `isInPlayerMazzo`
            const cardElement = createCardElement(card, null, false);
            availableCardsContainer.appendChild(cardElement);
        } else {
            console.error("Carta non definita nel mazzo disponibile");
        }
    });
}

// Visualizza le carte disponibili all'inizio
displayAvailableCards();

// Funzione per aggiungere una carta al mazzo del giocatore
function addCardToMazzo(card, player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;

    if (playerCards.length < 6 && !playerCards.includes(card)) {
        playerCards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore ${player}`);
    } else if (playerCards.includes(card)) {
        console.log(`Carta ${card.name} è già nel mazzo del giocatore ${player}`);
    } else {
        console.log(`Il mazzo del giocatore ${player} è pieno.`);
    }

    displayPlayerCards(); // Aggiorna la visualizzazione dei mazzi
}

// Funzione per rimuovere una carta dal mazzo
function removeCardFromMazzo(card, player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;
    
    // Trova l'indice della carta nel mazzo del giocatore specificato
    const cardIndex = playerCards.findIndex(c => c.name === card.name);

    if (cardIndex !== -1) {
        playerCards.splice(cardIndex, 1);
        console.log(`Carta ${card.name} rimossa dal mazzo del giocatore ${player}`);
    }

    displayPlayerCards(); // Aggiorna la visualizzazione dei mazzi
}

// Funzione per visualizzare i mazzi dei giocatori
function displayPlayerCards() {
    // Mostra il mazzo del giocatore 1
    const player1CardsList = document.getElementById('player1-cards');
    player1CardsList.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le carte
    player1Cards.forEach(card => {
        player1CardsList.appendChild(createCardElement(card, 1, true)); // Mostra solo il pulsante "Rimuovi"
    });

    // Mostra il mazzo del giocatore 2
    const player2CardsList = document.getElementById('player2-cards');
    player2CardsList.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le carte
    player2Cards.forEach(card => {
        player2CardsList.appendChild(createCardElement(card, 2, true)); // Mostra solo il pulsante "Rimuovi"
    });
}

// Funzione per avviare la battaglia
document.getElementById('start-battle').addEventListener('click', () => {
    // Verifica che i mazzi siano pronti
    if (player1Cards.length === 6 && player2Cards.length === 6) {

        // Salva i mazzi in localStorage
        localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
        localStorage.setItem('player2Cards', JSON.stringify(player2Cards));

        // Reindirizza alla pagina della battaglia
        window.location.href = 'battaglia.html';
    } else {
        alert('Ogni giocatore deve avere 6 carte per iniziare la battaglia.');
    }
});