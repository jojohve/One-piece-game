import { assignIslandIDs } from "./islands.js";
import { player1Deck, player2Deck } from "./selection.js";
import {displayBattleCards} from "./ui.js";

let turnNumber = 0;
let currentPlayer = 1;

document.addEventListener('DOMContentLoaded', () => {
    // Recupera i mazzi dal localStorage
    const { player1Deck, player2Deck } = getDeckFromStorage();

    // Verifica che i mazzi siano recuperati correttamente
    console.log('Mazzo del Giocatore 1:', player1Deck);
    console.log('Mazzo del Giocatore 2:', player2Deck);

    // Verifica se i mazzi esistono prima di avviare il gioco
    if (!player1Deck || !player2Deck) {
        console.error('I mazzi non sono stati trovati!');
        return;
    }
    // Inizializza il gioco solo dopo aver recuperato i mazzi
    startGame(player1Deck, player2Deck);
});

// Funzione per avviare il gioco
export function startGame(player1Deck, player2Deck) {
    // Imposta i mazzi globali
    window.player1Deck = player1Deck;
    window.player2Deck = player2Deck;

    // Log dei mazzi ora che sono definiti
    console.log('Mazzo del Giocatore 1:', window.player1Deck);
    console.log('Mazzo del Giocatore 2:', window.player2Deck);

    // Disabilitiamo i bottoni di fine turno inizialmente
    document.getElementById('end-turn-1').disabled = true;
    document.getElementById('end-turn-2').disabled = true;

    if (!player1Deck || !player2Deck) {
        console.error('I mazzi non sono stati caricati correttamente!');
        return;
    }

    console.log('Gioco avviato!');

    assignIslandIDs();
    console.log('Le isole sono state assegnate con successo!');

    testaOcroce();
    Turn();
}

function getDeckFromStorage() {
    const player1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
    const player2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];
    return { player1Deck, player2Deck }; // Restituisce entrambe le mani con tutte le carte
}

// Funzione per testa o croce
function testaOcroce() {
    const coinFlip = Math.random() < 0.5 ? 'testa' : 'croce';
    console.log(`Testa o Croce: ${coinFlip}`);

    // Imposta il giocatore corrente
    currentPlayer = coinFlip === 'testa' ? 1 : 2;

    console.log(`Giocatore ${currentPlayer} inizia!`);

    // Recupera l'elemento DOM dove deve essere mostrato il giocatore corrente
    const currentPlayerElement = document.getElementById('current-player');

    // Aggiorna il testo dell'elemento con "Giocatore 1" o "Giocatore 2"
    if (currentPlayerElement) {
        currentPlayerElement.innerText = `Giocatore ${currentPlayer}`;
    }
}

function Turn() {
    turnNumber++;
    console.log("Turno numero: " + turnNumber);
    document.getElementById('turn-number').innerText = turnNumber;

    document.getElementById('current-player').innerText = 'Giocatore ' + currentPlayer;
    console.log(`Turno del Giocatore ${currentPlayer}`);

    toggleButtons();
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    console.log(`Turno cambiato: Giocatore ${currentPlayer}`);
    document.getElementById('current-player').innerText = `Giocatore ${currentPlayer}`;
}

function toggleButtons() {
    // Abilita/disabilita i bottoni in base al giocatore corrente
    const button1 = document.getElementById('end-turn-1');
    const button2 = document.getElementById('end-turn-2');

    if (currentPlayer === 1) {
        button1.classList.remove('disabled');
        button1.disabled = false;

        button2.classList.add('disabled');
        button2.disabled = true;

        // Oscura le carte del giocatore 2
        player2Deck.forEach(card => {
            card.classList.add('hidden');
        });
        
        // Rimuove la classe 'hidden' dalle carte del giocatore 1
        player1Deck.forEach(card => {
            card.classList.remove('hidden');
        });
    } else {
        button1.classList.add('disabled');
        button1.disabled = true;

        button2.classList.remove('disabled');
        button2.disabled = false;

        // Oscura le carte del giocatore 1
        player1Deck.forEach(card => {
            card.classList.add('hidden');
        });

        // Rimuove la classe 'hidden' dalle carte del giocatore 2
        player2Deck.forEach(card => {
            card.classList.remove('hidden');
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inizializza i bottoni in base al giocatore corrente
    toggleButtons();

    // Aggiungi eventi ai bottoni
    document.getElementById('end-turn-1').addEventListener('click', () => {
        switchTurn();
        Turn();
    });

    document.getElementById('end-turn-2').addEventListener('click', () => {
        switchTurn();
        Turn();
    });
});

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