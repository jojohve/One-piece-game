import { assignIslandIDs } from "./islands.js";
import { displayBattleCards, updateCardPosition, updateCardDisplay } from "./ui.js";
import { useHaki, useSpecialMove } from './abilities.js'
import { checkPreferredIslandAndBoostDamage } from './drag.js';

let turnNumber = 0;
export let currentPlayer = 1;
let hasMoved = false;
let hasUsedSpecialMove = false;
let hasUsedHaki = false;
let gameMode; // Variabile per la modalità di gioco

document.addEventListener('DOMContentLoaded', () => {
    // Recupera i mazzi dal localStorage
    const { player1Deck, player2Deck } = getDeckFromStorage();

    // Recupera la modalità di gioco dal localStorage
    gameMode = localStorage.getItem('gameMode');
    console.log(`Modalità di gioco: ${gameMode}`);

    // Verifica che i mazzi siano recuperati correttamente
    console.log('Mazzo del Giocatore 1:', player1Deck);
    console.log('Mazzo del Giocatore 2:', player2Deck);

    // Verifica se i mazzi esistono prima di avviare il gioco
    if (!player1Deck || !player2Deck) {
        console.error('I mazzi non sono stati trovati!');
        return;
    }

    // Inizializza il gioco solo dopo aver recuperato i mazzi
    startGame(player1Deck, player2Deck, gameMode);
    checkForWinner();
});

// Funzione per recuperare i mazzi dal localStorage
function getDeckFromStorage() {
    const player1Deck = JSON.parse(localStorage.getItem('player1Deck')) || [];
    const player2Deck = JSON.parse(localStorage.getItem('player2Deck')) || [];
    return { player1Deck, player2Deck }; // Restituisce entrambe le mani con tutte le carte
}

// Funzione per avviare il gioco
export function startGame(player1Deck, player2Deck, gameMode) {
    // Imposta i mazzi globali
    window.player1Deck = player1Deck;
    window.player2Deck = player2Deck;

    displayBattleCards(1, player1Deck);  // Mostra le carte del giocatore 1
    displayBattleCards(2, player2Deck);  // Mostra le carte del giocatore 2

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

// Funzione per testa o croce
function testaOcroce() {
    const coinFlip = Math.random() < 0.5 ? 'testa' : 'croce';
    console.log(`Testa o Croce: ${coinFlip}`);

    // Imposta il giocatore corrente
    currentPlayer = coinFlip === 'testa' ? 1 : 2;

    alert(`Giocatore ${currentPlayer} inizia!`);

    // Recupera l'elemento DOM dove deve essere mostrato il giocatore corrente
    const currentPlayerElement = document.getElementById('current-player');

    // Aggiorna il testo dell'elemento con "Giocatore 1" o "Giocatore 2"
    if (currentPlayerElement) {
        currentPlayerElement.innerText = `Giocatore ${currentPlayer}`;
    }
}

export function getHasMoved() {
    return hasMoved;
}

export function setHasMoved(value) {
    hasMoved = value;
}

export function getHasUsedSpecialMove() {
    return hasUsedSpecialMove;
}

export function setHasUsedSpecialMove(value) {
    hasUsedSpecialMove = value;
}

export function getHasUsedHaki() {
    return hasUsedHaki;
}

export function setHasUsedHaki(value) {
    hasUsedHaki = value;
}

let islandIDs = []; // Variabile per contenere gli ID delle isole

// Funzione per gestire i turni della CPU
function cpuTurn() {
    console.log("Turno della CPU");

    // Inizializza gli ID delle isole se non è già stato fatto
    if (islandIDs.length === 0) {
        assignIslandIDs(); // Assicura che le isole siano assegnate
        islandIDs = Array.from(document.querySelectorAll('.island')).map(el => el.id);
    }

    // La CPU può muovere, attaccare e usare abilità una volta per turno
    makeRandomMove();
    performAttackAndUseAbilities();

    // Passa il turno al giocatore umano dopo le mosse della CPU
    switchTurn();
    Turn();
}

function makeRandomMove() {
    alert("La CPU sta facendo una mossa!");

    // Seleziona una carta casuale dal mazzo della CPU
    const cpuDeck = window.player2Deck;
    const randomCardIndex = Math.floor(Math.random() * cpuDeck.length);
    const randomCard = cpuDeck[randomCardIndex];

    // Seleziona un'isola casuale dall'elenco delle isole
    const randomIslandIndex = Math.floor(Math.random() * islandIDs.length);
    const randomIslandId = islandIDs[randomIslandIndex];
    console.log(`Tentativo di drop della carta ${randomCard.name} all'isola ${randomIslandId}`);

    // Aggiorna la posizione della carta 
    randomCard.islandId = randomIslandId;
    updateCardPosition(`battle-card-2-${randomCard.id}`, randomIslandId);

    // Aggiorna la visualizzazione della carta 
    const cardElement = document.getElementById(`battle-card-2-${randomCard.id}`);
    const islandElement = document.getElementById(randomIslandId);

    if (cardElement && islandElement) {
        islandElement.appendChild(cardElement);
        checkPreferredIslandAndBoostDamage(`battle-card-2-${randomCard.id}`, randomIslandId);
        setHasMoved(true);
        updateCardDisplay(`battle-card-2-${randomCard.id}`);
    }
}

function performAttackAndUseAbilities() {
    const cpuDeck = window.player2Deck;

    for (let i = 0; i < cpuDeck.length; i++) {
        const card = cpuDeck[i];

        // Verifica se ci sono nemici sulla stessa isola e l'isola non è una zona iniziale
        if (isEnemyOnSameIsland(card) && !isInitialZone(card.islandId)) {
            useSpecialMove(`battle-card-2-${card.id}`);
            break; // Attacca una volta per turno
        }

        // Decidi arbitrariamente se usare l'Haki
        if (!card.hasUsedHaki && shouldUseHaki()) {
            useHaki(`battle-card-2-${card.id}`);
            card.hasUsedHaki = true; // Segna che l'Haki è stato usato
            setHasUsedHaki(true);
            break; // Usa l'Haki una volta per turno
        }
    }

    setHasUsedSpecialMove(false); // Reset dello stato dopo l'attacco e l'uso delle abilità
}

function isEnemyOnSameIsland(card) {
    const islandId = card.islandId;
    const enemyCards = window.player1Deck.filter(c => c.islandId === islandId);
    return enemyCards.length > 0;
}

function isInitialZone(islandId) {
    const initialZones = ['inizio']; // Esempio di ID della zona iniziale
    return initialZones.includes(islandId);
}

function shouldUseHaki() {
    return Math.random() < 0.5; // 50% di probabilità di usare l'Haki
}

function Turn() {
    turnNumber++;
    console.log("Turno numero: " + turnNumber);
    document.getElementById('turn-number').innerText = turnNumber;

    document.getElementById('current-player').innerText = 'Giocatore ' + currentPlayer;
    alert(`Turno del Giocatore ${currentPlayer}`);

    hasMoved = false;
    hasUsedSpecialMove = false; // Resettiamo l'uso della mossa speciale a ogni turno
    toggleButtonsAndCards();

    // Se la modalità di gioco è contro la CPU e non è il turno del giocatore 1, esegui il turno della CPU
    if (gameMode === 'cpu' && currentPlayer === 2) {
        cpuTurn();
    }
}

function switchTurn() {
    currentPlayer = currentPlayer === 1 ? 2 : 1;
    console.log(`Turno cambiato: Giocatore ${currentPlayer}`);
    document.getElementById('current-player').innerText = `Giocatore ${currentPlayer}`;

    // Se la modalità di gioco è contro la CPU e non è il turno del giocatore 1, esegui il turno della CPU
    if (gameMode === 'cpu' && currentPlayer === 2) {
        cpuTurn();
    }
}

function toggleButtonsAndCards() {
    const button1 = document.getElementById('end-turn-1');
    const button2 = document.getElementById('end-turn-2');
    const player1Cards = document.querySelectorAll(`[id^="battle-card-1-"]`);
    const player2Cards = document.querySelectorAll(`[id^="battle-card-2-"]`);
    if (currentPlayer === 1) {
        button1.classList.remove('disabled'); button1.disabled = false;
        button2.classList.add('disabled'); button2.disabled = true;
        player1Cards.forEach(card => card.classList.remove('disabled'));
        player2Cards.forEach(card => card.classList.add('disabled'));
    } else {
        button1.classList.add('disabled'); button1.disabled = true;
        button2.classList.remove('disabled'); button2.disabled = false;
        player1Cards.forEach(card => card.classList.add('disabled'));
        player2Cards.forEach(card => card.classList.remove('disabled'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Inizializza i bottoni in base al giocatore corrente
    toggleButtonsAndCards();

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
        alert("Giocatore 2 vince!");
        showEndGameButton();
    } else if (player2Deck.length === 0) {
        alert("Giocatore 1 vince!");
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

// Funzione per resettare il gioco
function resetGame() {
    // Resetta variabili di stato del gioco
    turnNumber = 0;
    currentPlayer = 1;
    hasMoved = false;
    hasUsedSpecialMove = false;
    hasUsedHaki = false;

    // Rimuovi le carte dai deck
    window.player1Deck = [];
    window.player2Deck = [];
    localStorage.setItem('player1Deck', JSON.stringify([]));
    localStorage.setItem('player2Deck', JSON.stringify([]));

    // Rimuovi le carte dal DOM
    const player1Area = document.getElementById('player1-deck');
    const player2Area = document.getElementById('player2-deck');
    if (player1Area) player1Area.innerHTML = '';
    if (player2Area) player2Area.innerHTML = '';

    alert('Gioco resettato.');
}