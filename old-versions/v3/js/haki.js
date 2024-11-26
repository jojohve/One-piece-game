import { getCardById } from './ui.js'; // Assicurati che questa funzione sia disponibile
import { hakiPerPartita } from './rules.js';

export function useHaki(cardId) {
    console.log(`Chiamata funzione useHaki con ID ${cardId}`);
    hakiPerPartita(cardId);

    const card = getCardById(cardId); // Recupera la carta usando il suo ID
    if (!card) {
        console.error(`Carta non trovata con ID ${cardId}`);
        return;
    }

    if (card.hasUsedHaki) {
        console.log(`${card.name} ha già usato l'Haki in questa partita!`);
        return false; // Impedisce ulteriori usi
    }

    card.hasUsedHaki = true; // Registra l'uso dell'Haki
    console.log(`${card.name} ha usato l'Haki con successo!`);

    // Aggiorna la visualizzazione della carta
    updateCardDisplay(cardId);

    return true; // Conferma l'uso
}