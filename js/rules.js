import { resetGame } from './game.js';  // Importa la funzione
import { getCardById } from './ui.js';  // Assicurati di importarla correttamente

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
export function checkPreferredIslandAndBoostDamage(card, islandId) {
    // Verifica se la carta è valida
    if (!card || !card.specialMove) {
        console.warn("Carta non valida o mossa speciale mancante.");
        return 0;  // Ritorna un valore di default se la carta è non valida
    }

    // Verifica se la carta è posizionata sull'isola preferita
    const position = turnRules.cardPositions[card.id];

    if (position && position.islandId === islandId) {
        console.log("Boost applicato a " + card.name);
        return card.specialMove.damage + 20;  // Aggiungi il boost
    }

    return card.specialMove.damage;  // Ritorna il danno originale
}

// Funzione per verificare se ci sono carte avversarie nella stessa isola
export function checkForOpponentCardsOnSameIsland(cardId) {
    const currentPlayer = turnRules.currentPlayer;
    const opponentPlayer = currentPlayer === 1 ? 2 : 1;
    const currentPosition = turnRules.cardPositions[cardId]?.islandId;  // Usa turnRules.cardPositions

    const opponentCardsOnIsland = Object.keys(turnRules.cardPositions).filter((otherCardId) => {
        const otherCardPosition = turnRules.cardPositions[otherCardId]?.islandId;  // Usa turnRules.cardPositions
        return otherCardPosition === currentPosition && getCardById(otherCardId)?.player === opponentPlayer;
    });

    if (opponentCardsOnIsland.length > 0) {
        // Attiva la mossa speciale
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