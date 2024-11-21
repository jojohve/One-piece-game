import { turnRules } from './rules.js';
import { assignIslandIDs } from './islands.js';

// Funzione per avviare il gioco
export function startGame() {
    const player1Deck = getDeckFromStorage('player1');
    const player2Deck = getDeckFromStorage('player2');

    // Imposta i mazzi globali
    window.player1Deck = player1Deck;
    window.player2Deck = player2Deck;

    // Log dei mazzi ora che sono definiti
    console.log('Mazzo del Giocatore 1:', window.player1Deck);
    console.log('Mazzo del Giocatore 2:', window.player2Deck);
    
    if (!player1Deck || !player2Deck) {
        console.error('I mazzi non sono stati caricati correttamente!');
        return;
    }

    // Imposta le carte nei mazzi globali per essere accessibili in getCardById
    window.player1Deck = player1Deck;
    window.player2Deck = player2Deck;

    assignIslandIDs();
    console.log('Le isole sono state assegnate con successo!');

    console.log('Gioco avviato!');
    testaOcroce();
}

// Funzione per testa o croce
function testaOcroce() {
    const coinFlip = Math.random() < 0.5 ? 'testa' : 'croce';
    console.log(`Testa o Croce: ${coinFlip}`);

    // Imposta il giocatore corrente
    turnRules.currentPlayer = coinFlip === 'testa' ? 1 : 2;

    console.log(`Giocatore ${turnRules.currentPlayer} inizia!`);

    // Recupera l'elemento DOM dove deve essere mostrato il giocatore corrente
    const currentPlayerElement = document.getElementById('current-player');

    // Aggiorna il testo dell'elemento con "Giocatore 1" o "Giocatore 2"
    if (currentPlayerElement) {
        currentPlayerElement.innerText = `Giocatore ${turnRules.currentPlayer}`;
    }
}

// Funzione per ottenere il mazzo salvato nel localStorage
function getDeckFromStorage(player) {
    const savedDeck = JSON.parse(localStorage.getItem(`${player}Deck`)) || [];
    return savedDeck.map((cardName) => getCardByName(cardName));
}

export function resetGame() {
    localStorage.removeItem('player1Deck');
    localStorage.removeItem('player2Deck');
    window.location.href = 'index.html';
}

startGame();