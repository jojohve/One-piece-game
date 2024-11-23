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

    // Applicazione della classe di mossa speciale per la carta
    cardElement.classList.add('special-move-used');
    setTimeout(() => cardElement.classList.remove('special-move-used'), 1000);

    const opponentCards = player === 1 ? player2Cards : player1Cards;
    opponentCards.forEach((enemyCard) => {
        const enemyIslandName = getCardIsland(enemyCard, player === 1 ? 2 : 1);
        const attackerIslandName = getCardIsland(card, player);

        // Confronta le isole e applica il danno se corrispondono
        if (attackerIslandName === enemyIslandName) {
            enemyCard.hp -= card.specialMove.damage;

            // Controlla che l'elemento della carta nemica esista nel DOM prima di aggiornare
            const enemyCardIndex = player === 1 ? player2Cards.indexOf(enemyCard) : player1Cards.indexOf(enemyCard);
            const enemyCardElement = document.getElementById(`card-${player === 1 ? 2 : 1}-${enemyCardIndex}`);
            if (enemyCardElement) {
                updateCardDisplay(enemyCard, player === 1 ? 2 : 1, enemyCardIndex);
            }

            if (enemyCard.hp <= 0) {
                console.log(`${enemyCard.name} è stata eliminata!`);
                removeCardFromIsland(enemyCard, player === 1 ? 2 : 1);
                removeCardFromPlayerDeck(enemyCard, player === 1 ? player2Cards : player1Cards);
            }
        }
    });

    // Segna che la mossa speciale è stata usata
    if (player === 1) {
        player1Actions.hasUsedSpecialMove = true;
    } else {
        player2Actions.hasUsedSpecialMove = true;
    }

    // Salva lo stato del gioco e controlla la fine
    saveGameState();
    checkEndGame();
}

// Funzione per usare l'Haki
function useHaki(card, player) {
    if (card.usedHaki) {
        console.log(`${card.name} ha già usato l'Haki!`);
        return;
    }

    console.log(`${card.name} ha usato Haki: ${card.haki}`);

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

    // Segna che l'Haki è stato usato
    card.usedHaki = true;
    updateCardDisplay(card, player, player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card));
}

// Funzione per rimuovere una carta dal mazzo
function removeCardFromPlayerDeck(card, playerCards) {
    const cardIndex = playerCards.findIndex(c => c.id === card.id); // Usa l'ID per trovare la carta
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
