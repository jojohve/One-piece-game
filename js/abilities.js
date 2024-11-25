import { getHasUsedSpecialMove, setHasUsedSpecialMove, currentPlayer } from './game.js';

// Funzione per aggiornare le carte nemiche
function updateEnemyCard(enemyCard, index) {
    const cardId = `battle-card-${enemyCard.player}-${index}`; // Usa il formato corretto per l'ID della carta nemica

    // Trova l'elemento DOM della carta
    const cardElement = document.getElementById(cardId);
    if (!cardElement) {
        console.warn(`Elemento DOM della carta con ID ${cardId} non trovato.`);
        return;
    }

    // Recupera i dati della carta
    let cardData = cardElement.cardData || enemyCard;

    // Memorizza cardData nell'elemento DOM
    cardElement.cardData = cardData;

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

// Funzione per usare Haki
export function useHaki(cardId) {
    const cardElement = document.getElementById(cardId);
    const cardData = cardElement.cardData;
    if (!cardData.hasUsedHaki) {
        console.log("Haki usato per la carta:", cardElement);
        cardData.hasUsedHaki = true; 
        cardElement.querySelector('.haki-button').style.pointerEvents = 'none'; 
    } else {
        console.log("Haki già usato per questa carta.");
    }
}

// Funzione per usare la mossa speciale
export function useSpecialMove(cardId) {
    if (!getHasUsedSpecialMove()) {
        const cardElement = document.getElementById(cardId);
        const cardData = cardElement.cardData;
        const currentPosition = cardData.currentPosition;
        const damage = cardData.specialMove.damage;

        console.log(`Carta che usa la mossa speciale: ${cardData.name}, Posizione corrente: ${currentPosition}`);

        // Recupera i mazzi dei giocatori
        const player1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
        const player2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];

        // Trova le carte nemiche nel mazzo avversario
        const enemyDeck = currentPlayer === 1 ? player2Deck : player1Deck;
        const oppositePlayer = 3 - currentPlayer;
        console.log(`Carte nemiche trovate: ${enemyDeck.length}`);

        enemyDeck.forEach((enemyCard, index) => {
            console.log(`Controllando carta nemica: ${enemyCard.name}, Posizione corrente: ${enemyCard.currentPosition || 'undefined'}`);

            if (enemyCard.currentPosition === currentPosition) {
                enemyCard.hp -= damage; // Sottrai la vita del nemico
                console.log(`Danno inflitto a ${enemyCard.name}: ${damage}. Vita rimanente: ${enemyCard.hp}`);
                updateEnemyCard(enemyCard, index); // Aggiorna la visualizzazione della carta nemica
                if (enemyCard.hp <= 0) {
                    console.log(`${enemyCard.name} è stato sconfitto!`);
                    // Puoi aggiungere logica per rimuovere la carta se necessario
                }
            }
        });

        console.log("Mossa speciale usata per la carta:", cardElement);
        setHasUsedSpecialMove(true);
        cardElement.querySelector('.special-move-button').style.pointerEvents = 'none';
    } else {
        console.log("Mossa speciale già usata in questo turno.");
    }
}