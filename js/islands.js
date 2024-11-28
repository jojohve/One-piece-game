const islands = [
    'Orange Town', 'Arlong Park', 'Baratie', 'Logue Town', 'Drum Island',
    'Little Garden', 'Alabasta', 'Water Seven', 'Ohara', 'Enies Lobby', 'Long Ring Long Land',
    'Jaya', 'Skypea', 'Thriller Bark', 'Arcipelago Sabaody', 'Amazon Lily',
    'Impel Down', 'Marineford', 'Isola degli Uomini-Pesce', 'Punk Hazard', 'Dressrosa',
    'Whole Cake Island', 'Zou', 'Wano', 'Egg-Head', 'Elbaf', 'Raftel'
];

let islandStates = {}; // Stato delle vite per ogni isola

// Funzione per mescolare un array (Fisher-Yates shuffle)
function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];  // Scambia gli elementi
    }
}

// Funzione per assegnare gli ID delle isole all'HTML
export function assignIslandIDs() {
    // Mescola l'array delle isole
    shuffleArray(islands);

    // Seleziona tutte le isole nel DOM
    const islandElements = document.querySelectorAll('.island');

    // Verifica che ci siano abbastanza isole nel DOM
    if (islandElements.length !== islands.length) {
        console.warn('Il numero di isole nel DOM non corrisponde al numero di isole nell\'array.');
    }

    // Inizializza gli stati delle isole
    islandElements.forEach((islandElement, index) => {
        const islandID = islands[index] || `Isola Extra ${index + 1}`; // ID di riserva per isole extra
        islandElement.id = islandID; // Assegna l'ID all'elemento
        islandStates[islandID] = [null, null, null, null]; // Stato iniziale delle vite

        const islandNameElement = islandElement.querySelector('.island-name');
        if (islandNameElement) {
            islandNameElement.textContent = islandID.replace('-', ' ').toUpperCase(); // Aggiorna il nome dell'isola
        }

        // Aggiungi i pallini delle vite
        const livesContainer = document.createElement('div');
        livesContainer.classList.add('island-lives');
        for (let i = 0; i < 4; i++) {
            const lifeDot = document.createElement('span');
            lifeDot.classList.add('life-dot');
            livesContainer.appendChild(lifeDot);
        }
        islandElement.appendChild(livesContainer);
    });
}

// Funzione per aggiornare lo stato delle vite sull'isola
export function updateIslandLives(islandID, condition) {
    const lives = islandStates[islandID];
    for (let i = 0; i < lives.length; i++) {
        if (lives[i] === null) {
            lives[i] = condition;
            break;
        }
    }

    // Aggiorna il DOM
    const islandElement = document.getElementById(islandID);
    if (islandElement) {
        const lifeDots = islandElement.querySelectorAll('.life-dot');
        lives.forEach((life, index) => {
            if (life === 'conqueror-1') {
                lifeDots[index].style.backgroundColor = 'blue'; // Colore per il giocatore 1
            } else if (life === 'conqueror-2') {
                lifeDots[index].style.backgroundColor = 'red'; // Colore per il giocatore 2
            } else if (life === 'kill-1') {
                lifeDots[index].style.backgroundColor = 'blue'; // Colore per il giocatore 1
            } else if (life === 'kill-2') {
                lifeDots[index].style.backgroundColor = 'red'; // Colore per il giocatore 2
            }
        });

        // Verifica se un giocatore ha ottenuto almeno 3 delle 4 vite su un'isola
        const conqueror1Count = lives.filter(life => life && life.includes('conqueror-1')).length;
        const conqueror2Count = lives.filter(life => life && life.includes('conqueror-2')).length;

        if (conqueror1Count >= 3) {
            boostTeamDamage(1);
        } else if (conqueror2Count >= 3) {
            boostTeamDamage(2);
        }
    }
}

// Funzione per aumentare il danno di tutti i membri della squadra
function boostTeamDamage(player) {
    const playerDeckKey = `player${player}Deck`;
    const playerDeck = JSON.parse(localStorage.getItem(playerDeckKey)) || [];

    playerDeck.forEach(card => {
        card.specialMove.damage += 20; // Aumenta il danno di 20 punti
    });

    // Aggiorna il mazzo nel localStorage
    localStorage.setItem(playerDeckKey, JSON.stringify(playerDeck));

    // Aggiorna la visualizzazione delle carte nel DOM
    playerDeck.forEach((card, index) => {
        const allyCardId = `battle-card-${player}-${index}`;
        const allyCardElement = document.getElementById(allyCardId);
        if (allyCardElement) {
            allyCardElement.cardData = card;
            allyCardElement.innerHTML = `
                <span>${card.name}</span><br>
                HP: ${card.hp}<br>
                Haki: ${card.haki}<br>
                Mossa: ${card.specialMove.name}<br>
                Danno: ${card.specialMove.damage}<br>
                Isola: ${card.preferredIsland}<br>
                Frutto: ${card.fruitType}
                <div class="card-actions">
                    <button class="haki-button" ${card.hasUsedHaki ? 'disabled' : ''}>Usa Haki</button>
                    <button class="special-move-button">Usa Mossa Speciale</button>
                </div>
            `;
        }
    });

    alert(`Il giocatore ${player} ha ricevuto un boost di danno di 20 punti per l'intera squadra.`);
}