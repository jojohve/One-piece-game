import { dragStart } from './cardMovement.js';
import { dragEnd } from './cardMovement.js';
import { selectedCard } from './cardMovement.js';

document.addEventListener('DOMContentLoaded', function () {
    // Ora il DOM è pronto per essere manipolato

    // Esegui qui il codice che interagisce con gli elementi del DOM
    const playerArea1 = document.getElementById('player1-cards');
    const playerArea2 = document.getElementById('player2-cards');

    // Assicurati che questi elementi esistano prima di procedere
    if (playerArea1 && playerArea2) {
        displayBattleCards(playerArea1, playerArea2);
    } else {
        console.log('Elemento playerArea non trovato!');
    }
});

// Funzione per visualizzare le carte in battaglia
function displayBattleCards(player, playerCards) {
    const playerArea = document.getElementById(`player${player}-deck`);
    playerArea.innerHTML = ''; // Svuota la zona prima di aggiungere nuove carte

    playerCards.forEach((card, index) => {
        if (!card.currentPosition) {
            card.currentPosition = null; // Inizialmente nessuna posizione
        }
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        const cardId = `battle-card-${player}-${index}`;
        cardElement.setAttribute('id', cardId);
        cardElement.setAttribute('draggable', 'true'); // Aggiungi l'attributo draggable per abilitare il drag

        // Associa i dati della carta all'elemento DOM
        cardElement.cardData = card;

        // Contenuto della carta
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            Isola: ${card.preferredIsland}<br>
            Frutto: ${card.fruitType}
            <div class="card-actions">
                <button class="haki-button">Usa Haki</button>
                <button class="special-move-button">Usa Mossa Speciale</button>
            </div>
        `;

        // Aggiungi evento click per selezionare la carta
        cardElement.addEventListener('click', () => {
            selectedCard(cardId, card); // Passa l'ID e i dati della carta
        });

        // Aggiungi gli eventi di drag-and-drop direttamente alla carta appena creata
        cardElement.addEventListener('dragstart', dragStart);  // Avvia il drag
        cardElement.addEventListener('dragend', dragEnd);  // Termina il drag

        // Aggiungi il listener per il bottone Haki
        const hakiButton = cardElement.querySelector('.haki-button');
        hakiButton.addEventListener('click', () => useHaki(card, player));

        // Aggiungi il listener per il bottone Mossa Speciale
        const specialMoveButton = cardElement.querySelector('.special-move-button');
        specialMoveButton.addEventListener('click', () => useSpecialMove(card, player));

        // Aggiungi la carta al DOM
        playerArea.appendChild(cardElement);
    });
}

export function getCardById(cardId) {
    console.log(`Ricerca carta con ID: ${cardId}`);

    // Estrai il numero del giocatore e l'indice dalla carta ID
    const [_, player, index] = cardId.split('-');  // Esempio: 'battle-card-1-3' diventa ['battle', '1', '3']
    const cardIndex = parseInt(index, 10);  // Converte l'indice da stringa a numero

    // A seconda del numero del giocatore (1 o 2), scegli il mazzo giusto
    const currentDeck = player === '1' ? window.player1Deck : window.player2Deck;

    // Trova la carta nel mazzo usando l'indice
    const card = currentDeck.find(c => c.index === cardIndex);

    if (!card) {
        console.error(`Carta con ID ${cardId} non trovata nel mazzo del giocatore ${player}.`);
        return null;
    }

    console.log('Carta trovata:', card);
    return card;  // Restituisce l'oggetto della carta trovata
}

// Funzione per aggiornare la posizione della carta
export function updateCardPosition(cardId, islandId) {
    console.log(`Aggiorno la posizione della carta ${cardId} sull'isola ${islandId}`);

    // Recupera l'elemento DOM della carta per ottenere i dettagli
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
        console.error(`Elemento DOM per la carta con ID ${cardId} non trovato.`);
        return;
    }

    // Aggiorna la posizione corrente (currentPosition) usando direttamente il riferimento della carta droppata
    const cardData = cardElement.cardData; // cardData è un attributo associato all'elemento DOM
    if (!cardData) {
        console.error(`Nessun dato associato alla carta con ID ${cardId}.`);
        return;
    }

    cardData.currentPosition = islandId; // Aggiorniamo solo currentPosition
    console.log(`Posizione corrente della carta aggiornata a: ${islandId}`);
}

// Recupera i mazzi dal localStorage e visualizzali quando la pagina di battaglia è caricata
window.onload = () => {
    const player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
    const player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

    // Mostra le carte dei giocatori
    displayBattleCards(1, player1Cards);
    displayBattleCards(2, player2Cards);
};