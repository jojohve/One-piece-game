const availableCards = [
    { name: 'Luffy', hp: 100, haki: 'Conquistatore', specialMove: { name: 'Gomu Gomu no Pistol', damage: 50 }, preferredIsland: 'Isola del Mare', fruitType: 'Paramisha' },
    { name: 'Zoro', hp: 120, haki: 'Armatura', specialMove: { name: 'Santoryu', damage: 60 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Normale' },
    { name: 'Nami', hp: 80, haki: 'Osservazione', specialMove: { name: 'Clima-Tact', damage: 40 }, preferredIsland: 'Isola del Vento', fruitType: 'Normale' },
    { name: 'Sanji', hp: 90, haki: 'Armatura', specialMove: { name: 'Diable Jambe', damage: 45 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Normale' },
    { name: 'Usopp', hp: 70, haki: 'Osservazione', specialMove: { name: 'Kabuto', damage: 35 }, preferredIsland: 'Isola del Vento', fruitType: 'Normale' },
    { name: 'Chopper', hp: 85, haki: 'Conquistatore', specialMove: { name: 'Rumble Ball', damage: 55 }, preferredIsland: 'Isola del Mare', fruitType: 'Zoan' },
    { name: 'Robin', hp: 95, haki: 'Conquistatore', specialMove: { name: 'Cien Fleur', damage: 50 }, preferredIsland: 'Isola del Mare', fruitType: 'Paramisha' },
    { name: 'Franky', hp: 110, haki: 'Armatura', specialMove: { name: 'Franky Punch', damage: 65 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Normale' },
    { name: 'Brook', hp: 80, haki: 'Osservazione', specialMove: { name: 'Soul Solid', damage: 40 }, preferredIsland: 'Isola del Vento', fruitType: 'Paramisha' },
    { name: 'Jinbe', hp: 130, haki: 'Armatura', specialMove: { name: 'Fish-Man Karate', damage: 70 }, preferredIsland: 'Isola del Mare', fruitType: 'Normale' },
    { name: 'Ace', hp: 95, haki: 'Conquistatore', specialMove: { name: 'Hiken', damage: 55 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Rogia' },
    { name: 'Shanks', hp: 120, haki: 'Conquistatore', specialMove: { name: 'Conqueror’s Slash', damage: 60 }, preferredIsland: 'Isola del Mare', fruitType: 'Normale' },
    { name: 'Big Mom', hp: 150, haki: 'Armatura', specialMove: { name: 'Prometheus Fire', damage: 70 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Paramisha' },
    { name: 'Kaido', hp: 200, haki: 'Armatura', specialMove: { name: 'Boro Breath', damage: 100 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Zoan' },
    { name: 'Barbabianca', hp: 160, haki: 'Armatura', specialMove: { name: 'Quake Smash', damage: 80 }, preferredIsland: 'Isola del Mare', fruitType: 'Paramisha' },
    { name: 'Sabo', hp: 105, haki: 'Osservazione', specialMove: { name: 'Dragon Claw', damage: 50 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Rogia' },
    { name: 'Trafalgar Law', hp: 110, haki: 'Armatura', specialMove: { name: 'Shambles', damage: 60 }, preferredIsland: 'Isola del Vento', fruitType: 'Paramisha' },
    { name: 'Boa Hancock', hp: 85, haki: 'Conquistatore', specialMove: { name: 'Love Arrow', damage: 50 }, preferredIsland: 'Isola del Mare', fruitType: 'Paramisha' },
    { name: 'Mihawk', hp: 130, haki: 'Osservazione', specialMove: { name: 'Black Blade', damage: 75 }, preferredIsland: 'Isola del Vento', fruitType: 'Normale' },
    { name: 'Doflamingo', hp: 115, haki: 'Armatura', specialMove: { name: 'Parasite Strings', damage: 65 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Paramisha' },
    { name: 'Eneru', hp: 90, haki: 'Osservazione', specialMove: { name: 'Raigo', damage: 70 }, preferredIsland: 'Isola del Vento', fruitType: 'Rogia' },
    { name: 'Crocodile', hp: 100, haki: 'Conquistatore', specialMove: { name: 'Desert Spada', damage: 60 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Rogia' },
    { name: 'Marco', hp: 140, haki: 'Armatura', specialMove: { name: 'Phoenix Brand', damage: 75 }, preferredIsland: 'Isola del Mare', fruitType: 'Zoan' },
    { name: 'Katakuri', hp: 130, haki: 'Osservazione', specialMove: { name: 'Mochi Thrust', damage: 70 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Paramisha' },
    { name: 'Barbanera', hp: 180, haki: 'Conquistatore', specialMove: { name: 'Darkness Swirl', damage: 85 }, preferredIsland: 'Isola del Mare', fruitType: 'Rogia' },
    { name: 'Smoker', hp: 100, haki: 'Armatura', specialMove: { name: 'White Out', damage: 50 }, preferredIsland: 'Isola del Vento', fruitType: 'Rogia' },
    { name: 'Kizaru', hp: 120, haki: 'Osservazione', specialMove: { name: 'Light Speed Kick', damage: 65 }, preferredIsland: 'Isola del Fuoco', fruitType: 'Rogia' },
    { name: 'Aokiji', hp: 140, haki: 'Armatura', specialMove: { name: 'Ice Age', damage: 80 }, preferredIsland: 'Isola del Mare', fruitType: 'Rogia' },
    { name: 'Fujitora', hp: 130, haki: 'Conquistatore', specialMove: { name: 'Gravity Blade', damage: 70 }, preferredIsland: 'Isola del Vento', fruitType: 'Normale' }
];

let player1Cards = [];
let player2Cards = [];

// Funzione per visualizzare tutte le carte disponibili per la selezione
function displayAvailableCards() {
    const availableCardsList = document.getElementById('available-cards');
    availableCardsList.innerHTML = ''; // Pulisce la lista prima di aggiungere nuove carte

    availableCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-available-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            ${card.preferredIsland}<br>
            Tipo: ${card.fruitType}
        `;

        // Aggiungi un evento di selezione della carta
        cardElement.addEventListener('click', () => {
            console.log(`Carta cliccata: ${card.name}`);
            selectCard(card);
        });

        availableCardsList.appendChild(cardElement);
    });
}

// Funzione per selezionare una carta
function selectCard(card) {
    // Se il giocatore 1 ha meno di 6 carte e la carta non è già nel mazzo
    if (player1Cards.length < 6 && !player1Cards.includes(card)) {
        player1Cards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore 1`);
        displayCards(1);
    }
    // Se il giocatore 2 ha meno di 6 carte e la carta non è già nel mazzo
    else if (player2Cards.length < 6 && !player2Cards.includes(card)) {
        player2Cards.push(card);
        console.log(`Carta ${card.name} aggiunta al mazzo del giocatore 2`);
        displayCards(2);
    }

    // Se entrambi i giocatori hanno 6 carte, abilita il pulsante per iniziare la battaglia
    if (player1Cards.length === 6 && player2Cards.length === 6) {
        document.getElementById('start-battle').disabled = false;
    }
}

// Funzione per visualizzare le carte per ogni giocatore
function displayCards(player) {
    console.log(`Carte del giocatore ${player}:`, player === 1 ? player1Cards : player2Cards);
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const cardList = document.getElementById(`player${player}-cards`);
    cardList.innerHTML = ''; // Svuota la lista per ogni nuova visualizzazione

    playerCards.forEach((card, index) => {
        console.log(`Carta ${card.name} da visualizzare`);
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-${player}-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno: ${card.specialMove.damage}<br>
            Isola Preferita: ${card.preferredIsland}<br>
            Frutto: ${card.fruitType}
        `;

        cardElement.addEventListener('click', () => {
            console.log(`Carta cliccata: ${card.name}`);
            selectCard(card, player);
        });
        
        cardList.appendChild(cardElement);
    });
}

// Funzione per gestire il pulsante "Inizia la Battaglia"
document.getElementById('start-battle').addEventListener('click', () => {
    // Salva i mazzi dei giocatori in localStorage
    localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
    localStorage.setItem('player2Cards', JSON.stringify(player2Cards));

    // Reindirizza alla pagina della battaglia
    window.location.href = 'battaglia.html';
});

// Inizializza la visualizzazione
displayAvailableCards();  // Mostra le carte disponibili per la selezione
