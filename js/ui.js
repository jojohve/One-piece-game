import { dragStart, dragEnd, selectedCard } from './drag.js';

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
        const cardId = `battle-card-${player}-${index}`;
        cardElement.setAttribute('id', cardId);
        cardElement.setAttribute('draggable', 'true');

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

// Funzione per aggiornare la visualizzazione di una carta
export function updateCardDisplay(cardId) {
    // Trova l'elemento DOM della carta
    const cardElement = document.getElementById(cardId);
    if (!cardElement || !cardElement.cardData) {
        console.warn(`Elemento DOM o dati della carta con ID ${cardId} non trovati.`);
        return;
    }

    // Recupera i dati della carta
    const cardData = cardElement.cardData;

    // Aggiorna i campi specifici della carta
    cardElement.innerHTML = `
        <span>${cardData.name}</span><br>
        HP: ${cardData.hp}<br>
        Haki: ${cardData.haki}<br>
        Mossa: ${cardData.specialMove.name}<br>
        Danno: ${cardData.specialMove.damage}<br>
        Isola: ${cardData.preferredIsland}<br>
        Frutto: ${cardData.fruitType}
        <div class="card-actions">
            <button class="haki-button">Usa Haki</button>
            <button class="special-move-button">Usa Mossa Speciale</button>
        </div>
    `;

    console.log(`Visualizzazione aggiornata per la carta ${cardData.name} con ID ${cardId}`);
}

// Recupera i mazzi dal localStorage e visualizzali quando la pagina di battaglia è caricata
window.onload = () => {
    const player1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
    const player2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];
};