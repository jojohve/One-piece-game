// Funzione per iniziare il drag della carta
export function dragStart(event) {
    // Memorizza l'ID dell'elemento trascinato
    event.dataTransfer.setData('text', event.target.id);
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
    
    const cardId = event.dataTransfer.getData("text");
    const cardElement = document.getElementById(cardId);

    if (!cardElement) {
        console.error(`Carta con ID ${cardId} non trovata.`);
        return;
    }

    // Aggiungi la carta all'isola
    const island = event.target;
    if (island.classList.contains('island')) {
        island.appendChild(cardElement); // Sposta la carta nell'isola
    }

    // Rimuove l'evidenza della zona di destinazione
    removeHighlight(event);
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