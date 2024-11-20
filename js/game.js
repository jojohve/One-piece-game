// Recupera i mazzi dal localStorage
const player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
const player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

let currentPlayer = 0; // 0 non è un giocatore, usato per il lancio della moneta

function startGame() {
    testaOcroce();
}

function checkforwinner() {
    // Verifica se almeno una carta di ciascun giocatore è ancora viva
    const player1Alive = player1Cards.some(card => card.hp > 0);
    const player2Alive = player2Cards.some(card => card.hp > 0);

    // Verifica se tutte le carte di un giocatore sono morte
    if (!player1Alive) {
        alert("Giocatore 2 ha vinto! Tutte le carte del Giocatore 1 sono state eliminate.");
        showEndGameButton(); // Mostra il bottone per terminare la battaglia
    } else if (!player2Alive) {
        alert("Giocatore 1 ha vinto! Tutte le carte del Giocatore 2 sono state eliminate.");
        showEndGameButton(); // Mostra il bottone per terminare la battaglia
    }
}

function resetGame() {

}

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