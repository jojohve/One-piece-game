import { dragStart, dragEnd, selectedCard } from './drag.js';
import { useHaki, useSpecialMove } from './abilities.js';

// Funzione per visualizzare le carte in battaglia
export function displayBattleCards(player, playerDeck) {
    const playerArea = document.getElementById(`player${player}-deck`);
    if (!playerArea) {
        console.error(`Elemento con id 'player${player}-deck' non trovato.`);
        return; // Se non trovato, esce dalla funzione
    }
    playerArea.innerHTML = ''; // Svuota la zona prima di aggiungere nuove carte

    playerDeck.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        const cardId = `battle-card-${player}-${card.id}`; // Usa l'ID univoco della carta
        cardElement.setAttribute('id', cardId);
        cardElement.setAttribute('draggable', 'true');

        // Associa i dati della carta all'elemento DOM
        cardElement.cardData = card;
        cardElement.style.background = card.background; 
        cardElement.style.backgroundSize = 'cover';
        cardElement.style.backgroundPosition = 'center';

        // Contenuto della carta
        cardElement.innerHTML = `
            <span class="name">${card.name}</span><br>
            <span class="hp">HP: ${card.hp}</span><br>
            <span class="damage">Danno: ${card.specialMove.damage}</span><br>
            <span class="preferredIsland">Isola Preferita: ${card.preferredIsland}</span><br>
            <span class="fruitType">Tipo Frutto: ${card.fruitType}</span>
            <div class="card-actions">
                <button class="haki-button">Haki ${card.haki}</button>
                <button class="special-move-button">${card.specialMove.name}</button>
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
        hakiButton.addEventListener('click', () => useHaki(cardId));

        // Aggiungi il listener per il bottone Mossa Speciale
        const specialMoveButton = cardElement.querySelector('.special-move-button');
        specialMoveButton.addEventListener('click', () => useSpecialMove(cardId));

        // Aggiungi la carta al DOM
        playerArea.appendChild(cardElement);
    });
}

// Funzione per aggiornare la posizione della carta
export function updateCardPosition(cardId, islandId) {
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
        const cardData = cardElement.cardData;
        cardData.currentPosition = islandId;
        console.log(`Posizione aggiornata per ${cardData.name}: ${islandId}`);

        // Aggiorna il mazzo nel localStorage
        const playerDeckKey = `player${cardData.player}Deck`;
        const playerDeck = JSON.parse(localStorage.getItem(playerDeckKey)) || [];
        const cardIndex = playerDeck.findIndex(c => `battle-card-${c.player}-${c.id}` === cardId); // Usa ID coerente
        if (cardIndex !== -1) {
            playerDeck[cardIndex].currentPosition = islandId;
            localStorage.setItem(playerDeckKey, JSON.stringify(playerDeck));
        } else {
            console.warn(`Carta con ID ${cardId} non trovata nel mazzo.`); // Usa cardId per il log
        }
    } else {
        console.warn(`Carta con ID ${cardId} non trovata.`);
    }
}

// Funzione per aggiornare la visualizzazione di una carta
export function updateCardDisplay(cardId) {
    // Trova l'elemento DOM della carta
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
        console.warn(`Elemento DOM della carta con ID ${cardId} non trovato.`);
        return;
    }

    // Recupera i dati della carta
    let cardData = cardElement.cardData;

    // Se cardData non è disponibile, proviamo a recuperarlo dal localStorage
    if (!cardData) {
        const player1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
        const player2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];
        const allDecks = player1Deck.concat(player2Deck);
        const card = allDecks.find(c => `battle-card-${c.player}-${c.id}` === cardId);

        if (card) {
            cardData = card;
            cardElement.cardData = cardData; // Memorizza cardData nell'elemento
        } else {
            console.warn(`Dati della carta con ID ${cardId} non trovati.`);
            return;
        }
    }

    // Aggiorna i campi specifici della carta
    cardElement.innerHTML = `
        <span class="name">${cardData.name}</span><br>
        <span class="hp">HP: ${cardData.hp}</span><br>
        <span class="damage">Danno: ${cardData.specialMove.damage}</span><br>
        <span class="preferredIsland">Isola Preferita: ${cardData.preferredIsland}</span><br>
        <span class="fruitType">Tipo Frutto: ${cardData.fruitType}</span>
        <div class="card-actions">
            <button class="haki-button">Haki ${cardData.haki}</button>
            <button class="special-move-button">${cardData.specialMove.name}</button>
        </div>
    `;

    console.log(`Visualizzazione aggiornata per la carta ${cardData.name} con ID ${cardId}`);
}

// Recupera i mazzi dal localStorage e visualizzali quando la pagina di battaglia è caricata
window.onload = () => {
    const player1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
    const player2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];
    displayBattleCards(1, player1Deck);
    displayBattleCards(2, player2Deck);
}