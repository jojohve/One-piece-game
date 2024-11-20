import { availableCards } from './card.js';

//funzione per creare le carte in index.html
function createCardElement(card, player, isInPlayerMazzo = false, index = -1) {
    if (!card) {
        console.error("La carta non è definita");
        return; // Uscita dalla funzione se la carta non è definita
    }

    // Assegna un ID univoco
    const cardId = generaIdCarta(player, index);

    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.setAttribute('id', `card-${cardId}`);  // Aggiungi l'ID alla carta
    cardElement.innerHTML = `
        <h3>${card.name}</h3>
        <p><strong>HP:</strong> ${card.hp}</p>
        <p><strong>Haki:</strong> ${card.haki}</p>
        <p><strong>Mossa:</strong> ${card.specialMove.name}</p>
        <p><strong>Danno:</strong> <span class="damage">${card.specialMove.damage}</span></p>
        <p><span class="preferredIsland">${card.preferredIsland}</span></p>
        <p><span class="fruitType">${card.fruitType}</span></p>
`;

    if (isInPlayerMazzo) {
        // Aggiungi solo il pulsante "Rimuovi" se la carta è già nel mazzo
        const removeButton = document.createElement('button');
        removeButton.textContent = "Rimuovi dal Mazzo";
        removeButton.classList.add('remove-button');
        removeButton.addEventListener('click', () => rimuoviDalMazzo(card, player));
        cardElement.appendChild(removeButton);
    } else {
        // Aggiungi pulsanti "Aggiungi al Mazzo 1" e "Aggiungi al Mazzo 2"
        const addButtonPlayer1 = document.createElement('button');
        addButtonPlayer1.textContent = "Aggiungi al Mazzo 1";
        addButtonPlayer1.classList.add('add-button');
        addButtonPlayer1.addEventListener('click', () => aggiungiAlMazzo(card, 1)); // Passa il giocatore 1
        cardElement.appendChild(addButtonPlayer1);

        const addButtonPlayer2 = document.createElement('button');
        addButtonPlayer2.textContent = "Aggiungi al Mazzo 2";
        addButtonPlayer2.classList.add('add-button');
        addButtonPlayer2.addEventListener('click', () => aggiungiAlMazzo(card, 2)); // Passa il giocatore 2
        cardElement.appendChild(addButtonPlayer2);
    }

    return cardElement;
}

// Funzione per visualizzare le carte disponibili nel DOM
function displayAvailableCards() {
    const availableCardsContainer = document.getElementById('available-cards');
    availableCardsContainer.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le carte

    availableCards.forEach((card, index) => {
        if (card) { // Verifica che la carta sia definita
            // Passa null come player, false per `isInPlayerMazzo` e l'indice della carta
            const cardElement = createCardElement(card, null, false, index);
            availableCardsContainer.appendChild(cardElement);
        } else {
            console.error("Carta non definita nel mazzo disponibile");
        }
    });
}

// Visualizza le carte disponibili all'inizio
displayAvailableCards();

function displayPlayerCards() {
    // Mostra il mazzo del giocatore 1
    const player1CardsList = document.getElementById('player1-cards');
    player1CardsList.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le carte
    player1Cards.forEach((card, index) => {
        player1CardsList.appendChild(createCardElement(card, 1, true, index)); // Passa l'indice
    });

    // Mostra il mazzo del giocatore 2
    const player2CardsList = document.getElementById('player2-cards');
    player2CardsList.innerHTML = ''; // Pulisce il contenitore prima di aggiungere le carte
    player2Cards.forEach((card, index) => {
        player2CardsList.appendChild(createCardElement(card, 2, true, index)); // Passa l'indice
    });
}

//Funzione per mostrare le carte in battaglia.html
function displayCards() {
    const cardsContainer = document.getElementById(`player${player}-cards`);
    const cards = player === 1 ? player1Cards : player2Cards;
    cardsContainer.innerHTML = ''; // Pulisce l'area

    cards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('id', `card-${player}-${index}`); // Usa l'indice
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: <span class="card-hp">${card.hp}</span><br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: <span class="card-damage">${card.specialMove.damage}</span><br>
            ${card.preferredIsland}<br>
            Tipo: ${card.fruitType}<br>
            <div class="card-actions">
                <button class="haki-button">Usa Haki</button>
                <button class="special-move-button">Usa Mossa Speciale</button>
            </div>
        `;
        // Eventi per drag and drop
        cardElement.addEventListener('dragstart', dragStart);
        cardElement.addEventListener('dragend', dragEnd);

        // Aggiungi la carta alla lista
        cardsContainer.appendChild(cardElement);

        // Aggiungi gli eventi per i bottoni
        const hakiButton = cardElement.querySelector('.haki-button');
        const specialMoveButton = cardElement.querySelector('.special-move-button');

        // Aggiungi il listener per il bottone Haki
        hakiButton.addEventListener('click', () => useHaki(card, player));

        // Aggiungi il listener per il bottone Mossa Speciale
        specialMoveButton.addEventListener('click', () => useSpecialMove(card, player));
    });
}

function updateDisplayCards() {
    //codice
}

function showEndGameButton() {
    // Crea il bottone
    const endButton = document.createElement("button");
    endButton.textContent = "Termina Battaglia";
    endButton.id = "endGameButton";

    // Aggiungi il bottone alla pagina (ad esempio dentro il body)
    document.body.appendChild(endButton);

    // Aggiungi l'evento per resettare il gioco e tornare alla home
    endButton.addEventListener("click", function () {
        alert("La battaglia è stata terminata e il gioco è stato resettato.");
        resetGame(); // Reset del gioco
        window.location.href = "index.html"; // Torna alla pagina principale
    });
}