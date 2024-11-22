import { getCardById } from './ui.js'; // Assicurati che questa funzione sia disponibile

export function useHaki(cardId) {
    console.log(`Chiamata funzione useHaki con ID ${cardId}`);

    const card = getCardById(cardId); // Recupera la carta usando il suo ID
    if (!card) {
        console.error(`Carta non trovata con ID ${cardId}`);
        return;
    }

    if (card.haki > 0) {
        card.haki -= 1; // Riduce il valore di Haki
        console.log(`Haki usato per la carta ${card.name}. Haki rimanente: ${card.haki}`);
    } else {
        console.warn(`Haki esaurito per la carta ${card.name}`);
    }

    // Aggiorna la visualizzazione della carta
    updateCardDisplay(cardId);
}
