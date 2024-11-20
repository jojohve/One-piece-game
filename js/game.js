import { assignIslandToDiv } from './islands.js';
import { player1Deck, player2Deck } from './selectionTeam.js';
import { switchTurn } from './rules.js';

// Funzione per avviare il gioco
export function startGame() {
    const savedPlayer1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
    const savedPlayer2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];

    // Ripristina i mazzi
    savedPlayer1Deck.forEach((cardName) => player1Deck.push(getCardByName(cardName)));
    savedPlayer2Deck.forEach((cardName) => player2Deck.push(getCardByName(cardName)));

    // Assegna le isole ai div
    assignIslandToDiv();
    console.log('Le isole sono state assegnate con successo!');

    console.log('Gioco avviato!');
    testaOcroce();
    switchTurn();
}

// Funzione di testa o croce
function testaOcroce() {
    // Lancio della moneta per determinare chi inizia
    const coinFlip = Math.random() < 0.5 ? 'testa' : 'croce';
    console.log(`Testa o Croce: ${coinFlip}`);

    // Se esce "testa", inizia il giocatore 1, altrimenti il giocatore 2
    if (coinFlip === 'testa') {
        currentPlayer = 1;
        console.log('Giocatore 1 inizia!');
        document.getElementById('current-player').innerText = currentPlayer;
    } else {
        currentPlayer = 2;
        console.log('Giocatore 2 inizia!');
        document.getElementById('current-player').innerText = currentPlayer;
    }
}