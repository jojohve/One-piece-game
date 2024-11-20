import { availableCards } from './card.js';

let player1Cards = [];
let player2Cards = [];

export const player1Deck = player1Cards;  // Aggiungi questa riga
export const player2Deck = player2Cards;  // Aggiungi questa riga

// Funzione per selezionare una carta
function selectCard(card, player) {
    // Se il giocatore ha meno di 6 carte e la carta non è già nel mazzo
    if (player === 1 && player1Cards.length < 6 && !player1Cards.includes(card)) {
        player1Cards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore 1`);
        displayCards(1);
    } else if (player === 2 && player2Cards.length < 6 && !player2Cards.includes(card)) {
        player2Cards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore 2`);
        displayCards(2);
    }

    // Se entrambi i giocatori hanno 6 carte, abilita il pulsante per iniziare la battaglia
    if (player1Cards.length === 6 && player2Cards.length === 6) {
        document.getElementById('start-battle').disabled = false;
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
            Isola Preferita: ${card.preferredIsland}<br>
            Frutto: ${card.fruitType}
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

    // Se un giocatore ha meno di 6 carte, disabilita il pulsante per iniziare la battaglia
    if (player1Cards.length < 6 || player2Cards.length < 6) {
        document.getElementById('start-battle').disabled = true;
    }
}

// Funzione per gestire il pulsante "Inizia la Battaglia"
document.getElementById('start-battle').addEventListener('click', () => {
    // Salva i mazzi dei giocatori in localStorage
    localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
    localStorage.setItem('player2Cards', JSON.stringify(player2Cards));

    // Reindirizza alla pagina della battaglia
    window.location.href = 'battaglia.html';
});

// Inizializza la visualizzazione
displayAvailableCards();  // Mostra le carte disponibili per la selezione