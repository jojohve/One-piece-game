import { getHasUsedSpecialMove, setHasUsedSpecialMove } from './game.js';

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

        // Trova tutte le carte nemiche nella stessa posizione
        const enemyCards = document.querySelectorAll(`.card[data-player="${3 - currentPlayer}"]`);

        enemyCards.forEach(enemyCard => {
            const enemyCardData = enemyCard.cardData;
            if (enemyCardData.currentPosition === currentPosition) {
                enemyCardData.health -= damage; // Sottrai la vita del nemico
                console.log(`Danno inflitto a ${enemyCardData.name}: ${damage}. Vita rimanente: ${enemyCardData.health}`);
                if (enemyCardData.health <= 0) {
                    console.log(`${enemyCardData.name} è stato sconfitto!`);
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