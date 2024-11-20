import { dragStart } from './cardMovement.js';
import { dragEnd } from './cardMovement.js';

document.addEventListener('DOMContentLoaded', function () {
    // Ora il DOM è pronto per essere manipolato

    // Esegui qui il codice che interagisce con gli elementi del DOM
    const playerArea1 = document.getElementById('player1-cards');
    const playerArea2 = document.getElementById('player2-cards');

    // Assicurati che questi elementi esistano prima di procedere
    if (playerArea1 && playerArea2) {
        displayBattleCards(playerArea1, playerArea2);
    } else {
        console.log('Elemento playerArea non trovato!');
    }
});

// Funzione per visualizzare le carte in battaglia
function displayBattleCards(player, playerCards) {
    const playerArea = document.getElementById(`player${player}-deck`);
    playerArea.innerHTML = ''; // Svuota la zona prima di aggiungere nuove carte

    playerCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('id', `battle-card-${player}-${index}`);
        cardElement.setAttribute('draggable', 'true'); // Aggiungi l'attributo draggable per abilitare il drag

        // Contenuto della carta
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            Isola: ${card.preferredIsland}<br>
            Frutto: ${card.fruitType}
            <div class="card-actions">
                <button class="haki-button">Usa Haki</button>
                <button class="special-move-button">Usa Mossa Speciale</button>
            </div>
        `;

        // Aggiungi gli eventi di drag-and-drop direttamente alla carta appena creata
        cardElement.addEventListener('dragstart', dragStart);  // Avvia il drag
        cardElement.addEventListener('dragend', dragEnd);  // Termina il drag

        // Aggiungi il listener per il bottone Haki
        const hakiButton = cardElement.querySelector('.haki-button');
        hakiButton.addEventListener('click', () => useHaki(card, player));

        // Aggiungi il listener per il bottone Mossa Speciale
        const specialMoveButton = cardElement.querySelector('.special-move-button');
        specialMoveButton.addEventListener('click', () => useSpecialMove(card, player));

        // Aggiungi la carta al DOM
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