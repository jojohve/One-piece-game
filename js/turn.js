import { turnRules } from './rules.js';
import { switchTurn } from './rules.js';

export function resetActions() {
    // Resetta le azioni per entrambi i giocatori
    player1Actions.hasDropped = false;
    player1Actions.hasUsedSpecialMove = false;
    player2Actions.hasDropped = false;
    player2Actions.hasUsedSpecialMove = false;
}

// Disabilita le carte di un giocatore
function disableCards(player) {
    const cards = document.querySelectorAll(`.card-${player}`);
    cards.forEach(card => {
        card.classList.add('disabled');
    });
}

// Abilita le carte di un giocatore
function enableCards(player) {
    const cards = document.querySelectorAll(`.card-${player}`);
    cards.forEach(card => {
        card.classList.remove('disabled');
    });
}

export function updateTurn() {
    turnNumber++; // Incrementa il numero di turno

    // Resetta le azioni per il giocatore attuale
    resetPlayerActions();

    // Cambia il giocatore attuale
    turnRules.currentPlayer = turnRules.currentPlayer === 1 ? 2 : 1;

    // Disabilita le carte del giocatore non attivo
    const opponentPlayer = turnRules.currentPlayer === 1 ? 2 : 1;
    disableCards(opponentPlayer);

    // Abilita le carte del giocatore attivo
    enableCards(turnRules.currentPlayer);

    // Disabilita i bottoni di fine turno
    document.getElementById('end-turn-1').disabled = turnRules.currentPlayer !== 1;
    document.getElementById('end-turn-2').disabled = turnRules.currentPlayer !== 2;

    console.log(`Turno del Giocatore ${turnRules.currentPlayer}`);

    // Salva lo stato del gioco
    saveGameState();
}

export function checkForWinner() {
    // Verifica se un giocatore ha vinto
    if (player1Deck.length === 0) {
        console.log("Giocatore 2 vince!");
        showEndGameButton();
    } else if (player2Deck.length === 0) {
        console.log("Giocatore 1 vince!");
        showEndGameButton();
    }
}

function showEndGameButton() {
    // Crea il bottone
    const endButton = document.createElement("button");
    endButton.textContent = "Termina Battaglia";
    endButton.id = "endGameButton";

    // Aggiungi il bottone alla pagina (ad esempio dentro il body)
    document.body.appendChild(endButton);

    // Aggiungi l'evento per resettare il gioco e tornare alla home
    endButton.addEventListener("click", function () {
        alert("La battaglia è stata terminata e il gioco è stato resettato.");
        resetGame(); // Reset del gioco
        window.location.href = "index.html"; // Torna alla pagina principale
    });
}