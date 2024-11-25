import { updateCardPosition, updateCardDisplay } from './ui.js';
import { getHasMoved, setHasMoved } from './game.js';
import { useHaki, useSpecialMove } from './abilities.js';

let lastSelectedCard = null;

// Inizializziamo le carte con la proprietà hasUsedHaki
document.querySelectorAll('.card').forEach(card => {
    card.cardData = card.cardData || {};
    card.cardData.hasUsedHaki = false; // Imposta hasUsedHaki a false per ogni carta
});

export function dragStart(event) {
    if (getHasMoved()) {
        event.preventDefault();
        console.log("Hai già effettuato un movimento in questo turno.");
        return;
    }

    const cardId = event.target.id; 
    event.dataTransfer.setData('text', event.target.id);

    console.log('Carta in drag:', cardId);
    event.dataTransfer.setData("text", cardId);
    event.target.classList.add('dragging'); 
}

function removeHighlight(event) {
    if (event.target.classList.contains('island')) {
        event.target.classList.remove('highlight');
    }
}

export function dragEnd(event) {
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault();
    if (event.target.classList.contains('island')) {
        event.target.classList.add('highlight'); 
    }
}

function drop(event) {
    event.preventDefault();
    if (getHasMoved()) {
        console.log("Hai già effettuato un movimento in questo turno.");
        return;
    }

    const cardId = event.dataTransfer.getData("text");
    console.log(`ID carta ottenuto dal drop: ${cardId}`);

    const island = event.target;
    if (!island.classList.contains('island')) {
        console.warn("Target non valido per il drop.");
        return;
    }

    const islandId = island.id; 
    console.log(`Isola target per il drop: ${islandId}`);

    updateCardPosition(cardId, islandId);
    const cardElement = document.getElementById(cardId);
    island.appendChild(cardElement);

    const finalDamage = checkPreferredIslandAndBoostDamage(cardId, islandId);
    const cardName = cardElement.cardData?.name || "Carta sconosciuta";
    console.log(`Danno finale della mossa speciale per ${cardName}: ${finalDamage}`);
    
    setHasMoved(true); // Solo il movimento viene tracciato qui
    removeHighlight(event);
}

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('dragstart', dragStart);
    card.addEventListener('dragend', dragEnd);
});

document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('dragover', allowDrop);
    island.addEventListener('dragleave', removeHighlight);
    island.addEventListener('drop', drop);
});

export function checkPreferredIslandAndBoostDamage(cardId, islandId) {
    const cardElement = document.getElementById(cardId);
    if (!cardElement || !cardElement.cardData) {
        console.warn(`Carta con ID ${cardId} non trovata o dati mancanti.`);
        return 0;
    }

    const card = cardElement.cardData; 

    if (card.preferredIsland === islandId) {
        if (!card.boosted) {
            card.specialMove.damage += 20;
            card.boosted = true;
            console.log(`Boost applicato: ${card.name} ora ha ${card.specialMove.damage} danni.`);
        } else {
            console.log(`Boost già applicato a ${card.name}.`);
        }
    } else if (card.boosted) {
        card.specialMove.damage -= 20;
        card.boosted = false;
        console.log(`Boost rimosso: ${card.name} torna a ${card.specialMove.damage} danni.`);
    }

    updateCardDisplay(cardId);
    return card.specialMove.damage;
}

export function selectedCard(cardId, cardData) {
    const cardElement = document.getElementById(cardId);

    if (event.target.classList.contains('haki-button') || event.target.classList.contains('special-move-button')) {
        console.log("Cliccato su un bottone, non selezionare la carta.");
        return;
    }

    if (lastSelectedCard && lastSelectedCard !== cardElement) {
        deselectCard(lastSelectedCard);
    }

    cardElement.classList.add('selected');
    lastSelectedCard = cardElement;

    const hakiButton = cardElement.querySelector('.haki-button');
    const specialMoveButton = cardElement.querySelector('.special-move-button');
    if (hakiButton) hakiButton.style.pointerEvents = 'auto';
    if (specialMoveButton) specialMoveButton.style.pointerEvents = 'auto';

    hakiButton.addEventListener('click', () => {
        useHaki(cardId);
    });

    specialMoveButton.addEventListener('click', () => {
        useSpecialMove(cardId);
    });

    console.log("Carta selezionata:", cardElement);
    console.log("Dati della carta:", cardData);
}

export function deselectCard(cardElement) {
    cardElement.classList.remove('selected');
    const hakiButton = cardElement.querySelector('.haki-button');
    const specialMoveButton = cardElement.querySelector('.special-move-button');
    if (hakiButton) hakiButton.style.pointerEvents = 'none';
    if (specialMoveButton) specialMoveButton.style.pointerEvents = 'none';
}

document.addEventListener('click', (event) => {
    if (lastSelectedCard && !lastSelectedCard.contains(event.target)) {
        deselectCard(lastSelectedCard);
        lastSelectedCard = null;
    }
});

document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('click', (event) => {
        selectedCard(event.target.id, event.target.dataset.cardData);
    });
});

export function getLastSelectedCard() {
    return lastSelectedCard;
}