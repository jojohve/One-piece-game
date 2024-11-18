const availableCards = [
    { name: 'Luffy', hp: 100, haki: 'Conquistatore', specialMove: { name: 'Gomu Gomu no Pistol', damage: 50 }, preferredIsland: 'Isola del Mare' },
    { name: 'Zoro', hp: 120, haki: 'Armatura', specialMove: { name: 'Santoryu', damage: 60 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Nami', hp: 80, haki: 'Osservazione', specialMove: { name: 'Clima-Tact', damage: 40 }, preferredIsland: 'Isola del Vento' },
    { name: 'Sanji', hp: 90, haki: 'Armatura', specialMove: { name: 'Diable Jambe', damage: 45 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Usopp', hp: 70, haki: 'Osservazione', specialMove: { name: 'Kabuto', damage: 35 }, preferredIsland: 'Isola del Vento' },
    { name: 'Chopper', hp: 85, haki: 'Conquistatore', specialMove: { name: 'Rumble Ball', damage: 55 }, preferredIsland: 'Isola del Mare' },
    { name: 'Robin', hp: 95, haki: 'Conquistatore', specialMove: { name: 'Cien Fleur', damage: 50 }, preferredIsland: 'Isola del Mare' },
    { name: 'Franky', hp: 110, haki: 'Armatura', specialMove: { name: 'Franky Punch', damage: 65 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Brook', hp: 80, haki: 'Osservazione', specialMove: { name: 'Soul Solid', damage: 40 }, preferredIsland: 'Isola del Vento' },
    { name: 'Jinbe', hp: 130, haki: 'Armatura', specialMove: { name: 'Fish-Man Karate', damage: 70 }, preferredIsland: 'Isola del Mare' },

    { name: 'Ace', hp: 95, haki: 'Conquistatore', specialMove: { name: 'Mera Mera no Mi', damage: 55 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Shanks', hp: 120, haki: 'Conquistatore', specialMove: { name: 'Conqueror’s Haki', damage: 60 }, preferredIsland: 'Isola del Mare' },
    { name: 'Big Mom', hp: 150, haki: 'Armatura', specialMove: { name: 'Prometheus', damage: 70 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Kaido', hp: 200, haki: 'Armatura', specialMove: { name: 'Boro Breath', damage: 100 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Whitebeard', hp: 160, haki: 'Armatura', specialMove: { name: 'Quake-Quake', damage: 80 }, preferredIsland: 'Isola del Mare' },
    { name: 'Shirohige', hp: 180, haki: 'Conquistatore', specialMove: { name: 'Tsunami', damage: 90 }, preferredIsland: 'Isola del Mare' },
    { name: 'Sabo', hp: 105, haki: 'Osservazione', specialMove: { name: 'Mera Mera', damage: 50 }, preferredIsland: 'Isola del Fuoco' },
    { name: 'Trafalgar D. Water Law', hp: 110, haki: 'Armatura', specialMove: { name: 'Ope Ope no Mi', damage: 60 }, preferredIsland: 'Isola del Vento' },
    { name: 'Boa Hancock', hp: 85, haki: 'Conquistatore', specialMove: { name: 'Mero Mero no Mi', damage: 50 }, preferredIsland: 'Isola del Mare' },
    { name: 'Dracule Mihawk', hp: 130, haki: 'Osservazione', specialMove: { name: 'Kuneo', damage: 75 }, preferredIsland: 'Isola del Vento' },
    { name: 'Doflamingo', hp: 115, haki: 'Armatura', specialMove: { name: 'String String Fruit', damage: 65 }, preferredIsland: 'Isola del Fuoco' }
];

let player1Cards = [];
let player2Cards = [];

// Funzione per visualizzare le carte per ogni giocatore
function displayCards(player) {
    const playerCards = player === 1 ? player1Cards : player2Cards;
    const cardList = document.getElementById(`player${player}-cards`);
    cardList.innerHTML = ''; // Svuota la lista per ogni nuova visualizzazione

    availableCards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('card');
        cardElement.setAttribute('draggable', true);
        cardElement.setAttribute('id', `card-${player}-${index}`);
        cardElement.innerHTML = `
            <span>${card.name}</span><br>
            HP: ${card.hp}<br>
            Haki: ${card.haki}<br>
            Mossa: ${card.specialMove.name}<br>
            Danno Mossa: ${card.specialMove.damage}<br>
            Isola Preferita: ${card.preferredIsland}
        `;
        
        // Aggiungi classe se la carta è già selezionata
        if ((player === 1 && player1Cards.includes(card)) || (player === 2 && player2Cards.includes(card))) {
            cardElement.classList.add('selected');
        }

        cardElement.addEventListener('dragstart', (event) => dragStart(event));

        // Selezione della carta
        cardElement.addEventListener('click', () => selectCard(card, player));

        cardList.appendChild(cardElement);
    });
}

// Funzione per selezionare una carta
function selectCard(card, player) {
    if (player === 1 && player1Cards.length < 6 && !player1Cards.includes(card)) {
        player1Cards.push(card);
    } else if (player === 2 && player2Cards.length < 6 && !player2Cards.includes(card)) {
        player2Cards.push(card);
    }

    // Rende la carta selezionata visibile come "selezionata"
    displayCards(player);

    // Abilita il pulsante per iniziare la battaglia se entrambi i giocatori hanno selezionato 6 carte
    if (player1Cards.length === 6 && player2Cards.length === 6) {
        document.getElementById('start-battle').disabled = false;
    }
}

// Inizializza la visualizzazione delle carte per entrambi i giocatori
displayCards(1);
displayCards(2);

// Evento per il pulsante "Inizia la Battaglia"
document.getElementById('start-battle').addEventListener('click', () => {
    localStorage.setItem('player1Cards', JSON.stringify(player1Cards));
    localStorage.setItem('player2Cards', JSON.stringify(player2Cards));
    window.location.href = 'battaglia.html'; // Reindirizza alla pagina della battaglia
});