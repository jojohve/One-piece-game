function useHaki(card, player) {
    if (card.usedHaki) {
        console.log(`${card.name} ha già usato l'Haki!`);
        return;
    }
    
    switch (card.haki) {
        case "Armatura":
            card.hp += 20;  // Aumenta i punti vita
            break;
        case "Osservazione":
            card.nextAttackDamage = 0;  // Riduce danno successivo a 0 (effetto temporaneo)
            break;
        case "Conquistatore":
            const playerCards = player === 1 ? player1Cards : player2Cards;
            playerCards.forEach(playerCard => {
                playerCard.hp += 20;  // Aumenta i punti vita a tutte le carte del giocatore
                updateCardDisplay(playerCard, player, playerCards.indexOf(playerCard));
            });
            break;
        default:
            console.log("Haki non riconosciuto.");
    }
    console.log(`${card.name} ha usato Haki: ${card.haki}`);
}