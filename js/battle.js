// Funzione per usare la mossa speciale
function useSpecialMove(card, player) {
    if ((player === 1 && player1Actions.hasUsedSpecialMove) || (player === 2 && player2Actions.hasUsedSpecialMove)) {
        console.log("Hai già usato la mossa speciale in questo turno.");
        return;
    }

    console.log(`${card.name} ha usato la mossa speciale: ${card.specialMove.name}`);

    // Calcola correttamente l'indice della carta in base al giocatore
    const cardIndex = player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card);
    const cardElementId = `card-${player}-${cardIndex}`;
    const cardElement = document.getElementById(cardElementId);

    // Aggiungi un controllo per vedere se cardElement è null
    if (!cardElement) {
        console.error(`Elemento della carta con ID ${cardElementId} non trovato!`);
        return; // Esci se l'elemento non esiste
    }

    cardElement.classList.add('special-move-used');
    setTimeout(() => cardElement.classList.remove('special-move-used'), 1000);

    const opponentCards = player === 1 ? player2Cards : player1Cards;
    opponentCards.forEach((enemyCard) => {
        const enemyIslandName = getCardIsland(enemyCard, player === 1 ? 2 : 1);
        const attackerIslandName = getCardIsland(card, player);

        if (attackerIslandName === enemyIslandName) {
            enemyCard.hp -= card.specialMove.damage;
            updateCardDisplay(enemyCard, player === 1 ? 2 : 1, player === 1 ? player2Cards.indexOf(enemyCard) : player1Cards.indexOf(enemyCard));

            if (enemyCard.hp <= 0) {
                console.log(`${enemyCard.name} è stata eliminata!`);
                removeCardFromIsland(enemyCard, player === 1 ? 2 : 1);
                removeCardFromPlayerDeck(enemyCard, player === 1 ? player2Cards : player1Cards);
            }
        }
    });

    if (player === 1) {
        player1Actions.hasUsedSpecialMove = true;
    } else {
        player2Actions.hasUsedSpecialMove = true;
    }

    saveGameState();
    checkEndGame();
}

function useHaki(card, player) {
    if (card.usedHaki) {
        console.log(`${card.name} ha già usato l'Haki!`);
        return;
    }

    console.log(`${card.name} ha usato Haki: ${card.haki}`);

    switch (card.haki) {
        case "Armatura":
            card.hp += 20;
            break;
        case "Osservazione":
            card.nextAttackDamage = 0; // Questo sembra un effetto temporaneo
            break;
        case "Conquistatore":
            const playerCards = player === 1 ? player1Cards : player2Cards;
            playerCards.forEach(playerCard => {
                playerCard.hp += 20;
                updateCardDisplay(playerCard, player, playerCards.indexOf(playerCard));
            });
            break;
        default:
            console.log("Haki non riconosciuto.");
    }

    // Segna che l'Haki è stato usato
    card.usedHaki = true;
    updateCardDisplay(card, player, player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card));
}

function removeCardFromPlayerDeck(card, playerCards) {
    const cardIndex = playerCards.indexOf(card);
    if (cardIndex !== -1) {
        // Rimuove la carta dal mazzo
        playerCards.splice(cardIndex, 1);

        // Rimuove la carta dal DOM
        const cardElement = document.getElementById(`card-${playerCards === player1Cards ? 1 : 2}-${cardIndex}`);
        if (cardElement) {
            cardElement.remove();
        }

        console.log(`${card.name} è stata rimossa dal mazzo.`);
    }
}