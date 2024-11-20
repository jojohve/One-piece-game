// Funzione per visualizzare le carte in battaglia
function displayBattleCards(player, playerCards) {
    const playerArea = document.getElementById(`player${player}-cards`);
    playerArea.innerHTML = ''; // Svuota la zona prima di aggiungere nuove carte

    playerCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('id', `battle-card-${player}-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            Isola Preferita: ${card.preferredIsland}<br>
            Frutto: ${card.fruitType}
        `;
        
        // Aggiungi un evento per il click sulla carta, per spostarla o usare una mossa
        cardElement.addEventListener('click', () => {
            console.log(`Carta ${card.name} cliccata in battaglia`);
            // Implementa la logica per gestire il click sulla carta (mossa, spostamento, ecc.)
        });

        playerArea.appendChild(cardElement);
    });
}

// Recupera i mazzi dal localStorage e visualizzali quando la pagina di battaglia è caricata
window.onload = () => {
    const player1Cards = JSON.parse(localStorage.getItem('player1Cards')) || [];
    const player2Cards = JSON.parse(localStorage.getItem('player2Cards')) || [];

    // Mostra le carte dei giocatori
    displayBattleCards(1, player1Cards);
    displayBattleCards(2, player2Cards);
};