import { resetGame } from './game.js';  // Importa la funzione
import { updateCardDisplay } from './ui.js';

export const turnRules = {
    currentPlayer: 1,
    turnNumber: 1,
    hasUsedSpecialMove: [false, false],
    hasUsedHaki: [false, false],
    cardPositions: {}
};

export function switchTurn() {
    // Cambia il giocatore
    turnRules.currentPlayer = turnRules.currentPlayer === 1 ? 2 : 1;

    // Incrementa il numero del turno
    turnRules.turnNumber++;

    // Aggiorna il DOM con il numero del turno e il giocatore corrente
    document.getElementById('turn-number').innerText = `Turno: ${turnRules.turnNumber}`;
    document.getElementById('current-player').innerText = `Giocatore ${turnRules.currentPlayer}`;

    console.log(`Il turno è passato a: Giocatore ${turnRules.currentPlayer}, numero turno: ${turnRules.turnNumber}`);
}

// Funzione per aumentare il danno se la carta è sulla sua isola preferita
export function checkPreferredIslandAndBoostDamage(cardId, islandId) {
    // Ottieni l'elemento DOM della carta
    const cardElement = document.getElementById(cardId);
    if (!cardElement || !cardElement.cardData) {
        console.warn(`Carta con ID ${cardId} non trovata o dati mancanti.`);
        return 0; // Valore di default
    }

    const card = cardElement.cardData; // Recupera i dati della carta

    if (card.preferredIsland === islandId) {
        if (!card.boosted) {
            card.specialMove.damage += 20; // Applica il boost
            card.boosted = true;
            console.log(`Boost applicato: ${card.name} ora ha ${card.specialMove.damage} danni.`);
        } else {
            console.log(`Boost già applicato a ${card.name}.`);
        }
    } else if (card.boosted) {
        card.specialMove.damage -= 20; // Rimuovi il boost
        card.boosted = false;
        console.log(`Boost rimosso: ${card.name} torna a ${card.specialMove.damage} danni.`);
    }

    // Ritorna sempre il danno attuale della mossa speciale
    updateCardDisplay(cardId); // Aggiorna la visualizzazione della carta
    return card.specialMove.damage;
}

// Funzione per verificare se ci sono carte avversarie nella stessa isola
export function checkForOpponentCardsOnSameIsland(cardId) {
    const currentPlayer = turnRules.currentPlayer;
    const opponentPlayer = currentPlayer === 1 ? 2 : 1;
    const currentPosition = turnRules.cardPositions[cardId]?.islandId;

    const opponentCardsOnIsland = Object.keys(turnRules.cardPositions).filter((otherCardId) => {
        const otherCardPosition = turnRules.cardPositions[otherCardId]?.islandId;
        return otherCardPosition === currentPosition && getCardById(otherCardId)?.player === opponentPlayer;
    });

    if (opponentCardsOnIsland.length > 0) {
        // Usa la mossa speciale sulla lista di carte avversarie
        useSpecialMove(cardId, opponentCardsOnIsland);
    } else {
        console.log(`Nessuna carta avversaria nella stessa isola di ${cardId}`);
    }
}

document.getElementById('end-turn-1').addEventListener('click', () => {
    switchTurn(); // Passa al Giocatore 2
});

document.getElementById('end-turn-2').addEventListener('click', () => {
    switchTurn(); // Passa al Giocatore 1
});

// Gestisci il click sul pulsante per resettare il gioco
document.getElementById('reset-button').addEventListener('click', resetGame);

/*
// Variabili di stato per il controllo delle azioni per turno
    let player1Actions = {
        hasDropped: false, // Controlla se il giocatore 1 ha già effettuato un drop
        hasUsedSpecialMove: false, // Controlla se il giocatore 1 ha già usato la mossa speciale
    };

    let player2Actions = {
        hasDropped: false, // Controlla se il giocatore 2 ha già effettuato un drop
        hasUsedSpecialMove: false, // Controlla se il giocatore 2 ha già usato la mossa speciale
    };

    function mossaPerTurno() {

    }

    function azionePerTurno() {

    }

    function hakiPerPartita() {

    }

    function effettoTipo() {

    }
*/