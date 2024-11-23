import { getCardById, updateCardDisplay } from './ui.js';
import { player1Actions, player2Actions,mossaPerTurno } from './rules.js';

export function useSpecialMove(cardId) {
    console.log(`Chiamata funzione useSpecialMove con ID ${cardId}`);

    const card = getCardById(cardId); // Recupera la carta usando il suo ID
    if (!card) {
        console.error(`Carta non trovata con ID ${cardId}`);
        return;
    }
    mossaPerTurno(cardId);

    // Applica la logica della mossa speciale qui
    console.log(`Mossa speciale ${card.specialMove.name} usata da ${card.name}, danno: ${card.specialMove.damage}`);

    // Segna che la mossa speciale è stata usata
    if (player === 1) {
        player1Actions.hasUsedSpecialMove = true;
    } else {
        player2Actions.hasUsedSpecialMove = true;
    }

    // Aggiorna la visualizzazione della carta
    updateCardDisplay(cardId);
}
