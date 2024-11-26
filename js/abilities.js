import { updateCardDisplay } from './ui.js';
import { getHasUsedSpecialMove, setHasUsedSpecialMove, currentPlayer } from './game.js';
import { updateIslandLives } from './islands.js';

// Funzione per usare Haki
export function useHaki(cardId) {
    const cardElement = document.getElementById(cardId);
    const cardData = cardElement.cardData;

    if (!cardData.hasUsedHaki) {
        switch (cardData.haki) {
            case 'Armatura':
                cardData.hp += 30; // Aumenta gli HP della carta che utilizza Haki dell'Armatura
                console.log("Haki dell'Armatura usato da:", cardElement);
                // Aggiorna la visualizzazione della carta corrente
                const currentCardId = `battle-card-${cardData.player}-${cardData.id}`;
                updateCardDisplay(currentCardId);
                break;
            case 'Osservazione':
                console.log("Haki dell'Osservazione usato da:", cardElement);
                break;
            case 'Conquistatore':
                // Recupera i mazzi dei giocatori
                const playerDeckKey = `player${cardData.player}Deck`;
                const playerDeck = JSON.parse(localStorage.getItem(playerDeckKey)) || [];

                playerDeck.forEach((allyCard) => {
                    allyCard.hp += 5; // Aumenta gli HP di tutte le carte alleate
                    const allyCardId = `battle-card-${cardData.player}-${allyCard.id}`;
                    const allyCardElement = document.getElementById(allyCardId);
                    if (allyCardElement) {
                        allyCardElement.cardData = allyCard;

                        // Aggiorna i campi specifici della carta alleata
                        allyCardElement.innerHTML = `
                            <span>${allyCard.name}</span><br>
                            HP: ${allyCard.hp}<br>
                            Haki: ${allyCard.haki}<br>
                            Mossa: ${allyCard.specialMove.name}<br>
                            Danno: ${allyCard.specialMove.damage}<br>
                            Isola: ${allyCard.preferredIsland}<br>
                            Frutto: ${allyCard.fruitType}
                            <div class="card-actions">
                                <button class="haki-button" ${allyCard.hasUsedHaki ? 'disabled' : ''}>Usa Haki</button>
                                <button class="special-move-button">Usa Mossa Speciale</button>
                            </div>
                        `;
                        console.log(`Visualizzazione aggiornata per la carta ${allyCard.name} con ID ${allyCardId}`);
                    }
                });

                // Aggiorna il mazzo nel localStorage
                localStorage.setItem(playerDeckKey, JSON.stringify(playerDeck));

                // Aggiorna le vite dell'isola
                updateIslandLives(cardData.currentPosition, `conqueror-${cardData.player}`);
                break;
            default:
                console.warn(`Tipo di Haki non riconosciuto: ${cardData.haki}`);
        }

        cardData.hasUsedHaki = true;
        const hakiButton = cardElement.querySelector('.haki-button');
        hakiButton.style.pointerEvents = 'none';
        hakiButton.classList.add('disabled'); // Aggiungi una classe CSS per lo stile del pulsante disabilitato
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

                if (enemyCardElement) {
                    // Aggiorna i dati della carta nemica
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
                            <button class="haki-button" ${enemyCard.hasUsedHaki ? 'disabled' : ''}>Usa Haki</button>
                            <button class="special-move-button">Usa Mossa Speciale</button>
                        </div>
                    `;
                    console.log(`Visualizzazione aggiornata per la carta ${enemyCard.name} con ID ${enemyCardId}`);
                } else {
                    console.warn(`Elemento DOM della carta con ID ${enemyCardId} non trovato.`);
                }

                if (enemyCard.hp <= 0) {
                    // Aggiorna le vite dell'isola
                    updateIslandLives(currentPosition, `kill-${currentPlayer}`);
                    
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
        alert("Mossa speciale già usata in questo turno.");
    }
}