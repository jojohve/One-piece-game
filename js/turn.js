import { turnRules } from './rules.js';
import { switchTurn } from './rules.js';

let turnNumber = 0;

export function updateTurn() {
    // Logica per disabilitare le carte nemiche
    // e altre azioni specifiche del turno
    turnNumber ++;

    if (turnRules.currentPlayer === 1) {
        // Disabilita le carte del giocatore 2
    } else {
        // Disabilita le carte del giocatore 1
    }

    console.log(`Turno del Giocatore ${turnRules.currentPlayer}`);
    switchTurn();
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