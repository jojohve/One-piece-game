import { getHasUsedSpecialMove, setHasUsedSpecialMove, currentPlayer } from './game.js';
import { updateCardDisplay } from './ui.js';

// Funzione per usare Haki
export function useHaki(cardId) {
    const cardElement = document.getElementById(cardId);
    const cardData = cardElement.cardData;
    if (!cardData.hasUsedHaki) {
        switch (cardData.haki) {
            case 'Armatura':
                cardData.hp += 30; // Aggiunge 30 HP alla carta 
                console.log(`Haki dell'Armatura usato da ${cardData.name}: +30 HP, HP totali: ${cardData.hp}`);
                break;
            case 'Osservazione':
                console.log(`Haki dell'Osservazione usato da ${cardData.name}. Da approfondire.`);
                break;
            case 'Conquistatore':
                const playerDeckKey = `player${cardData.player}Deck`;
                const playerDeck = JSON.parse(localStorage.getItem(playerDeckKey)) || [];
                playerDeck.forEach(card => {
                    card.hp += 10; // Aggiunge 10 HP a tutte le carte alleate 
                    console.log(`Haki del Conquistatore usato: +10 HP a ${card.name}, HP totali: ${card.hp}`); // Aggiorna il DOM per ciascuna carta alleata 
                    const allyCardId = `battle-card-${cardData.player}-${card.id}`;
                    updateCardDisplay(allyCardId);
                });
                localStorage.setItem(playerDeckKey, JSON.stringify(playerDeck)); // Aggiorna il mazzo nel localStorage 
                break;
            default:
                console.warn(`Tipo di Haki sconosciuto: ${cardData.haki}`);
                break;
        }
        cardData.hasUsedHaki = true;
        localStorage.setItem(`player${cardData.player}Deck`, JSON.stringify(window[`player${cardData.player}Deck`]));
        updateCardDisplay(cardId); // Aggiorna il DOM della carta che ha usato Haki
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
        const oppositePlayer = 3 - currentPlayer; // Identifica il giocatore opposto
        console.log(`Carte nemiche trovate: ${enemyDeck.length}`);

        enemyDeck.forEach((enemyCard, index) => {
            if (enemyCard.currentPosition === currentPosition) {
                enemyCard.hp -= damage; // Sottrai la vita del nemico
                console.log(`Danno inflitto a ${enemyCard.name}: ${damage}. Vita rimanente: ${enemyCard.hp}`);

                // Costruisci l'ID della carta nemica utilizzando l'opposto del currentPlayer
                const enemyCardId = `battle-card-${oppositePlayer}-${enemyCard.id}`;
                const enemyCardElement = document.getElementById(enemyCardId);

                // Aggiorna i dati della carta nemica
                if (enemyCardElement) {
                    enemyCardElement.cardData = enemyCard;

                    // Aggiorna i campi specifici della carta nemica
                    enemyCardElement.innerHTML = `
                        <span>${enemyCard.name}</span><br>
                        HP: ${enemyCard.hp}<br>
                        Haki: ${enemyCard.haki}<br>
                        Mossa: ${enemyCard.specialMove.name}<br>
                        Danno: ${enemyCard.specialMove.damage}<br>
                        Isola: ${enemyCard.preferredIsland}<br>
                        Frutto: ${enemyCard.fruitType}
                        <div class="card-actions">
                            <button class="haki-button">Usa Haki</button>
                            <button class="special-move-button">Usa Mossa Speciale</button>
                        </div>
                    `;
                    console.log(`Visualizzazione aggiornata per la carta ${enemyCard.name} con ID ${enemyCardId}`);
                } else {
                    console.warn(`Elemento DOM della carta con ID ${enemyCardId} non trovato.`);
                }

                // Rimuovi la carta dal mazzo e dal DOM se gli HP sono pari a zero
                if (enemyCard.hp <= 0) {
                    alert(`${enemyCard.name} è stato sconfitto!`);
                    enemyDeck.splice(index, 1);
                    localStorage.setItem(`player${oppositePlayer}Deck`, JSON.stringify(enemyDeck));
                    if (enemyCardElement) {
                        enemyCardElement.remove();
                        console.log(`Carta ${enemyCard.name} rimossa dal DOM con ID ${enemyCardId}`);
                    }
                } else {
                    // Aggiorna il mazzo nel localStorage
                    const playerDeckKey = `player${enemyCard.player}Deck`;
                    const playerDeck = JSON.parse(localStorage.getItem(playerDeckKey)) || [];
                    const cardIndex = playerDeck.findIndex(c => c.id === enemyCard.id);
                    if (cardIndex !== -1) {
                        playerDeck[cardIndex] = enemyCard;
                        localStorage.setItem(playerDeckKey, JSON.stringify(playerDeck));
                    } else {
                        console.warn(`Carta con ID ${enemyCard.id} non trovata nel mazzo.`);
                    }
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