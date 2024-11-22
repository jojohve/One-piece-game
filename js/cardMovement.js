import { checkPreferredIslandAndBoostDamage,azionePerTurno } from './rules.js';  // Assicurati di importare correttamente la funzione
import { updateCardPosition } from './ui.js';  // Aggiungi questa riga per importare la funzione

let lastSelectedCard = null; // Variabile globale per tenere traccia della carta selezionata

// Funzione per iniziare il drag della carta
export function dragStart(event) {
    const cardId = event.target.id;  // Ottieni l'ID della carta
    // Memorizza l'ID dell'elemento trascinato
    event.dataTransfer.setData('text', event.target.id);

    console.log('Carta in drag:', cardId);
    event.dataTransfer.setData("text", cardId);  // Trasferisci l'ID della carta
    event.target.classList.add('dragging');  // Aggiunge una classe per evidenziare la carta
}

// Funzione per terminare il drag della carta
export function dragEnd(event) {
    event.target.classList.remove('dragging'); // Rimuove la classe che evidenziava la carta
}

// Funzione per permettere il drop sulla zona di destinazione
function allowDrop(event) {
    event.preventDefault();  // Impedisce il comportamento predefinito del browser
    if (event.target.classList.contains('island')) {
        event.target.classList.add('highlight');  // Evidenzia la zona dove si può rilasciare la carta
    }
}

// Funzione per rimuovere l'evidenza quando la carta esce dalla zona di destinazione
function removeHighlight(event) {
    if (event.target.classList.contains('island')) {
        event.target.classList.remove('highlight');
    }
}

// Funzione per gestire il drop della carta nell'isola
function drop(event) {
    event.preventDefault();

    const cardId = event.dataTransfer.getData("text"); // Ottieni l'ID della carta
    console.log(`ID carta ottenuto dal drop: ${cardId}`);
    azionePerTurno(cardId);

    const island = event.target;  // L'elemento su cui stai "rilasciando" la carta
    if (!island.classList.contains('island')) {
        console.warn("Target non valido per il drop.");
        return;
    }

    const islandId = island.id;  // Assicurati di ottenere l'ID dell'isola correttamente
    console.log(`Isola target per il drop: ${islandId}`);

    // Ora puoi aggiornare la posizione della carta
    updateCardPosition(cardId, islandId);  // Usa l'islandId per aggiornare la posizione della carta

    // Trova l'elemento DOM della carta e spostalo nell'isola
    const cardElement = document.getElementById(cardId);
    island.appendChild(cardElement);

    // Applica il boost se necessario
    const finalDamage = checkPreferredIslandAndBoostDamage(cardId, islandId);
    const cardName = cardElement.cardData?.name || "Carta sconosciuta";
    console.log(`Danno finale della mossa speciale per ${cardName}: ${finalDamage}`);
    
    removeHighlight(event);  // Rimuovi evidenza di drop
}

// Aggiungi gli eventi ai membri delle carte
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
});

// Aggiungi gli eventi di drag sulle isole
document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('dragover', allowDrop); // Permette il drop
    island.addEventListener('dragleave', removeHighlight); // Rimuove l'evidenza quando esci
    island.addEventListener('drop', drop); // Gestisce il drop
});

// Funzione per selezionare una carta
export function selectedCard(cardId, cardData) {
    const cardElement = document.getElementById(cardId);

    // Verifica che l'evento di click non sia stato generato da un bottone
    if (event.target.classList.contains('haki-button') || event.target.classList.contains('special-move-button')) {
        console.log("Cliccato su un bottone, non selezionare la carta.");
        return;  // Esci dalla funzione se è stato cliccato un bottone
    }

    // Se una carta è già selezionata, deselezionala
    if (lastSelectedCard && lastSelectedCard !== cardElement) {
        deselectCard(lastSelectedCard);
    }

    // Aggiungi la classe 'selected' alla carta cliccata
    cardElement.classList.add('selected');
    lastSelectedCard = cardElement;  // Memorizza la carta selezionata

    // Abilita i bottoni della carta selezionata
    const hakiButton = cardElement.querySelector('.haki-button');
    const specialMoveButton = cardElement.querySelector('.special-move-button');
    if (hakiButton) hakiButton.style.pointerEvents = 'auto';
    if (specialMoveButton) specialMoveButton.style.pointerEvents = 'auto';

    console.log("Carta selezionata:", cardElement);

    // Qui puoi anche usare cardData (se ti serve per altre operazioni)
    console.log("Dati della carta:", cardData);
}

// Funzione per deselezionare una carta
export function deselectCard(cardElement) {
    cardElement.classList.remove('selected');
    const hakiButton = cardElement.querySelector('.haki-button');
    const specialMoveButton = cardElement.querySelector('.special-move-button');
    if (hakiButton) hakiButton.style.pointerEvents = 'none';
    if (specialMoveButton) specialMoveButton.style.pointerEvents = 'none';
}

// Aggiungi un event listener per deselezionare la carta quando si fa clic fuori
document.addEventListener('click', (event) => {
    if (lastSelectedCard && !lastSelectedCard.contains(event.target)) {
        deselectCard(lastSelectedCard);
        lastSelectedCard = null;
    }
});

// Aggiungi gli eventi di selezione per le carte (ad esempio, tramite un click)
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (event) => {
        selectedCard(event.target.id, event.target.dataset.cardData);
    });
});

// Getter per ottenere l'ultima carta selezionata
export function getLastSelectedCard() {
    return lastSelectedCard;
}