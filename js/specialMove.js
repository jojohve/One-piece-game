import { getCardById, updateCardDisplay } from './ui.js';

export function useSpecialMove(cardId) {
    console.log(`Chiamata funzione useSpecialMove con ID ${cardId}`);

    const card = getCardById(cardId); // Recupera la carta usando il suo ID
    if (!card) {
        console.error(`Carta non trovata con ID ${cardId}`);
        return;
    }

    console.log(`Mossa speciale ${card.specialMove.name} usata da ${card.name}, danno: ${card.specialMove.damage}`);

    // Applica la logica della mossa speciale qui
    // (es. infliggere danno, modificare un valore, ecc.)

    // Aggiorna la visualizzazione della carta
    updateCardDisplay(cardId);
}
