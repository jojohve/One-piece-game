function useSpecialMove(card, player) {
    if ((player === 1 && player1Actions.hasUsedSpecialMove) || (player === 2 && player2Actions.hasUsedSpecialMove)) {
        console.log("Hai già usato la mossa speciale in questo turno.");
        return;
    }
    console.log(`${card.name} ha usato la mossa speciale: ${card.specialMove.name}`);
}