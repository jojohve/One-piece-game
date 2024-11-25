import { availableCards } from './cards.js';

let player1Cards = [];
let player2Cards = [];

export const player1Deck = player1Cards;
export const player2Deck = player2Cards;

// Funzione per selezionare una carta
function selectCard(card, player) {
    // Controlla se la carta è già presente nel mazzo del giocatore
    if ((player === 1 && player1Cards.includes(card)) || (player === 2 && player2Cards.includes(card))) {
        showErrorMessage(`La carta ${card.name} è già nel mazzo del giocatore ${player}`);
        return;
    }

    // Se il giocatore ha meno di 6 carte, aggiungi la carta al mazzo
    if (player === 1 && player1Cards.length < 6) {
        player1Cards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore 1`);
        displayCards(1);
    } else if (player === 2 && player2Cards.length < 6) {
        player2Cards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore 2`);
        displayCards(2);
    } else {
        // Se il giocatore ha già 6 carte, mostra un messaggio di errore
        showErrorMessage(`Il giocatore ${player} ha già 6 carte nel mazzo.`);
        return;
    }

    // Verifica se i mazzi sono pieni e aggiorna il pulsante
    const startBattleButton = document.getElementById('start-battle');
    if (player1Cards.length === 6 && player2Cards.length === 6) {
        startBattleButton.classList.remove('disabled');
        startBattleButton.disabled = false;  // Assicurati che il pulsante sia abilitato
    } else {
        startBattleButton.classList.add('disabled');
        startBattleButton.disabled = true;  // Disabilita il pulsante se uno dei mazzi ha meno di 6 carte
    }
}

// Funzione per visualizzare tutte le carte disponibili per la selezione
function displayAvailableCards() {
    const availableCardsList = document.getElementById('available-cards');
    availableCardsList.innerHTML = ''; // Pulisce la lista prima di aggiungere nuove carte

    availableCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-available-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            ${card.preferredIsland}<br>
            Tipo: ${card.fruitType}
            <button class="add-to-team" data-player="1">Aggiungi al team 1</button>
            <button class="add-to-team" data-player="2">Aggiungi al team 2</button>
        `;

        // Aggiungi evento per i pulsanti di aggiunta al mazzo
        const addToTeamButtons = cardElement.querySelectorAll('.add-to-team');
        addToTeamButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                const player = parseInt(event.target.getAttribute('data-player'));
                selectCard(card, player);  // Aggiungi la carta al mazzo del giocatore selezionato
            });
        });

        availableCardsList.appendChild(cardElement);
    });
}

// Funzione per visualizzare le carte per ogni giocatore
function displayCards(player) {
    console.log(`Carte del giocatore ${player}:`, player === 1 ? player1Cards : player2Cards);
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const cardList = document.getElementById(`player${player}-cards`);
    cardList.innerHTML = ''; // Svuota la lista per ogni nuova visualizzazione

    playerCards.forEach((card, index) => {
        console.log(`Carta ${card.name} da visualizzare`);
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-${player}-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            Isola: ${card.preferredIsland}<br>
            Tipo: ${card.fruitType}
            <button class="remove-card-btn">Rimuovi dal team</button>
        `;

        // Aggiungi l'evento per la rimozione della carta dal mazzo
        const removeBtn = cardElement.querySelector('.remove-card-btn');
        removeBtn.addEventListener('click', () => {
            removeCard(card, player, index);
        });

        cardList.appendChild(cardElement);
    });
}

// Funzione per rimuovere una carta dal team
function removeCard(card, player, index) {
    if (player === 1) {
        player1Cards.splice(index, 1); // Rimuovi la carta dal mazzo del giocatore 1
        console.log(`Carta ${card.name} rimossa dal mazzo del giocatore 1`);
        displayCards(1);  // Rendi aggiornato il mazzo del giocatore 1
    } else if (player === 2) {
        player2Cards.splice(index, 1); // Rimuovi la carta dal mazzo del giocatore 2
        console.log(`Carta ${card.name} rimossa dal mazzo del giocatore 2`);
        displayCards(2);  // Rendi aggiornato il mazzo del giocatore 2
    }
}

// Funzione per salvare i mazzi (con tutte le carte) nel localStorage
function saveDeckToStorage(player1Deck, player2Deck) {
    player1Deck.forEach((card, index) => {
        card.player = 1;
        card.currentPosition = card.currentPosition || 'inizio'; // Imposta una posizione iniziale se non presente
        card.id = `card-available-${index}`; // Assicurati che l'ID sia coerente
    });
    player2Deck.forEach((card, index) => {
        card.player = 2;
        card.currentPosition = card.currentPosition || 'inizio'; // Imposta una posizione iniziale se non presente
        card.id = `card-available-${index}`; // Assicurati che l'ID sia coerente
    });

    localStorage.setItem('player1Deck', JSON.stringify(player1Deck));
    localStorage.setItem('player2Deck', JSON.stringify(player2Deck));
}

// Funzione per gestire il pulsante "Inizia la Battaglia"
document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-battle');
    if (startButton) {
        startButton.addEventListener('click', () => {
            saveDeckToStorage(player1Deck, player2Deck);
            window.location.href = 'game.html';
        });
    }
});

// Funzione per mostrare il messaggio di errore
function showErrorMessage(message) {
    const errorMessage = document.createElement('div');
    errorMessage.classList.add('error-message');
    errorMessage.textContent = message;
    document.body.appendChild(errorMessage);

    // Nascondi il messaggio dopo 3 secondi
    setTimeout(() => {
        errorMessage.remove();
    }, 3000);
}

// Inizializza la visualizzazione
displayAvailableCards();  // Mostra le carte disponibili per la selezione