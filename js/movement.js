// Funzione per aggiornare la visualizzazione della carta
function updateCardDisplay(card, player) {
    const cardElement = document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`);
    const hpElement = cardElement.querySelector('.card-hp');
    const damageElement = cardElement.querySelector('.card-damage');

    if (hpElement) hpElement.innerText = `HP: ${card.hp}`;
    if (damageElement) damageElement.innerText = `${card.specialMove.damage}`;
}

function dragStart(event) {
    event.dataTransfer.setData('text', event.target.id);
    event.target.classList.add('dragging');
}

document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('dragover', allowDrop);
    island.addEventListener('dragleave', removeHighlight); // Rimuove l'evidenza quando si esce
});

function dragEnd(event) {
    event.target.classList.remove('dragging');
}

function allowDrop(event) {
    event.preventDefault(); // Impedisce il comportamento predefinito del browser (necessario per il drop)

    if (event.target.classList.contains('island')) {
        event.target.classList.add('highlight'); // Evidenzia la zona di drop
    }
}

function removeHighlight(event) {
    if (event.target.classList.contains('island')) {
        event.target.classList.remove('highlight');
    }
}

function saveCardIsland(card, player, islandName) {
    const cardId = `card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`;
    localStorage.setItem(cardId, islandName);  // Salva l'isola per quella carta nel localStorage
}

function getCardIsland(card, player) {
    // Recupera l'isola su cui si trova la carta
    const islandNames = ['isola-mare', 'isola-fuoco', 'isola-vento'];
    let cardIsland = null;

    islandNames.forEach(islandName => {
        const islandElement = document.getElementById(islandName);
        if (islandElement && islandElement.contains(document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`))) {
            cardIsland = islandName;
        }
    });

    return cardIsland;
}

// Funzione per rimuovere la carta dall'isola quando i punti vita sono 0
function removeCardFromIsland(card, player) {
    if (card.hp <= 0) {
        // Rimuovi la carta dall'isola
        Object.keys(islands).forEach(islandName => {
            const island = islands[islandName];
            const cardIndex = island.indexOf(card);
            if (cardIndex !== -1) {
                island.splice(cardIndex, 1); // Rimuove la carta dalla lista dell'isola
                // Rimuove anche la carta dalla UI
                const islandElement = document.getElementById(islandName);
                if (islandElement) {
                    const cardElement = document.getElementById(`card-${player}-${player === 1 ? player1Cards.indexOf(card) : player2Cards.indexOf(card)}`);
                    if (cardElement) {
                        islandElement.removeChild(cardElement);
                    }
                }
                console.log(`${card.name} è stata rimossa dall'isola per aver esaurito i punti vita.`);
            }
        });
    }
}

function drop(event) {
    event.preventDefault();

    if ((currentPlayer === 1 && player1Actions.hasDropped) || (currentPlayer === 2 && player2Actions.hasDropped)) {
        console.log("Hai già effettuato un drop in questo turno.");
        return;
    }

    const cardId = event.dataTransfer.getData("text");
    const cardElement = document.getElementById(cardId);

    if (!cardElement) {
        console.error(`Carta con ID ${cardId} non trovata.`);
        return;
    }

    const island = event.target;

    if (!island.classList.contains('island')) {
        console.warn("Target non valido per il drop.");
        return;
    }

    const cardIndex = parseInt(cardId.split('-')[2]);
    if (isNaN(cardIndex)) {
        console.error("Indice carta non valido.");
        return;
    }

    const card = currentPlayer === 1 ? player1Cards[cardIndex] : player2Cards[cardIndex];
    if (!card) {
        console.error("Carta non trovata nell'array del giocatore.");
        return;
    }

    const islandName = island.innerText.split("\n")[0].toLowerCase().trim();
    const preferredIslandNormalized = card.preferredIsland.toLowerCase().trim();

    if (preferredIslandNormalized === islandName && !card.boosted) {
        card.specialMove.damage += 20;
        card.boosted = true;
    } else if (card.boosted) {
        card.specialMove.damage -= 20;
        card.boosted = false;
    }

    island.appendChild(cardElement);

    const damageElement = cardElement.querySelector('.card-damage');
    if (damageElement) {
        damageElement.textContent = `Danno Mossa: ${card.specialMove.damage}`;
    }

    if (currentPlayer === 1) {
        player1Actions.hasDropped = true;
    } else {
        player2Actions.hasDropped = true;
    }

    removeHighlight(event);
}

document.querySelectorAll('.island').forEach(island => {
    island.addEventListener('drop', drop); // Gestisce l'evento di drop
});