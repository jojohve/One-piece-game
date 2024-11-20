function aggiungiAlMazzo(card, player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;

    if (playerCards.length < 6 && !playerCards.includes(card)) {
        playerCards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore ${player}`);
    } else if (playerCards.includes(card)) {
        console.log(`Carta ${card.name} è già nel mazzo del giocatore ${player}`);
    } else {
        console.log(`Il mazzo del giocatore ${player} è pieno.`);
    }

    displayPlayerCards(); // Aggiorna la visualizzazione dei mazzi
}

function rimuoviDalMazzo(card){
    const playerCards = player === 1 ? player1Cards : player2Cards;

    // Trova l'indice della carta nel mazzo del giocatore specificato
    const cardIndex = playerCards.findIndex(c => c.name === card.name);

    if (cardIndex !== -1) {
        playerCards.splice(cardIndex, 1);
        console.log(`Carta ${card.name} rimossa dal mazzo del giocatore ${player}`);
    }

    displayPlayerCards(); // Aggiorna la visualizzazione dei mazzi
}

// Funzione per avviare la battaglia
document.getElementById('start-battle').addEventListener('click', () => {
    // Verifica che i mazzi siano pronti
    if (player1Cards.length === 6 && player2Cards.length === 6) {

        // Salva i mazzi in localStorage
        localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
        localStorage.setItem('player2Cards', JSON.stringify(player2Cards));

        // Reindirizza alla pagina della battaglia
        window.location.href = 'battaglia.html';
        startGame();
    } else {
        alert('Ogni giocatore deve avere 6 carte per iniziare la battaglia.');
    }
});

function generaIdCarta(player, index) {
    return player === 1 ? index + 1 : index + 7;  // ID da 1 a 6 per il giocatore 1, da 7 a 12 per il giocatore 2
}

//generazione di una variabile per la posizione corrente della carta

//generazine di id isola alle isole assegnate