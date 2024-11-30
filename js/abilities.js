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
                alert(`Haki dell'Armatura usato da: ${cardData.name}`);
                // Aggiorna la visualizzazione della carta corrente
                const currentCardId = `battle-card-${cardData.player}-${cardData.id}`;
                updateCardDisplay(currentCardId);
                break;
            case 'Osservazione':
                alert(`Haki dell'Osservazione usato da: ${cardData.name}`);
                break;
            case 'Conquistatore':
                alert(`Haki del Re Conquistatore usato da: ${cardData.name}`);

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
                            <span class="name">${allyCard.name}</span><br>
                            <span class="hp">HP: ${allyCard.hp}</span><br>
                            <span class="damage">Danno: ${allyCard.specialMove.damage}</span><br>
                            <span class="preferredIsland">Isola Preferita: ${allyCard.preferredIsland}</span><br>
                            <span class="fruitType">Tipo Frutto: ${allyCard.fruitType}</span>
                            <div class="card-actions">
                                <button class="haki-button" ${allyCard.hasUsedHaki ? 'disabled' : ''}>Haki ${allyCard.haki}</button>
                                <button class="special-move-button">${allyCard.specialMove.name}</button>
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

        // Controllo per evitare attacchi dalla posizione "inizio"
        if (currentPosition === "inizio") {
            console.log(`La carta ${cardData.name} è nella posizione di inizio e non può attaccare.`);
            return;
        }

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
                alert(`Danno inflitto a ${enemyCard.name}: ${damage}. Vita rimanente: ${enemyCard.hp}`);

                // Costruisci l'ID della carta nemica utilizzando l'opposto del currentPlayer
                const enemyCardId = `battle-card-${oppositePlayer}-${enemyCard.id}`;
                const enemyCardElement = document.getElementById(enemyCardId);

                if (enemyCardElement) {
                    // Aggiorna i dati della carta nemica
                    enemyCardElement.cardData = enemyCard;

                    // Aggiorna i campi specifici della carta nemica
                    enemyCardElement.innerHTML = `
                        <span class="name">${enemyCard.name}</span><br>
                        <span class="hp">HP: ${enemyCard.hp}</span><br>
                        <span class="damage">Danno: ${enemyCard.specialMove.damage}</span><br>
                        <span class="preferredIsland">Isola Preferita: ${enemyCard.preferredIsland}</span><br>
                        <span class="fruitType">Tipo Frutto: ${enemyCard.fruitType}</span>
                        <div class="card-actions">
                            <button class="haki-button" ${enemyCard.hasUsedHaki ? 'disabled' : ''}>Haki ${enemyCard.haki}</button>
                            <button class="special-move-button">${enemyCard.specialMove.name}</button>
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