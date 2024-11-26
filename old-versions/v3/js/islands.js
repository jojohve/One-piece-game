const islands = [
    'Arlong Park',
    'Baratie',
    'Logue Town',
    'Regno dei Ciliegi',
    'Alabasta',
    'Water Seven',
    'Ohara',
    'Enies Lobby',
    'Skypea',
    'Thriller Bark',
    'Arcipelago Sabaody',
    'Amazon Lily',
    'Impel Down',
    'Marineford',
    'Isola degli Uomini-Pesce',
    'Punk Hazard',
    'Dressrosa',
    'Whole Cake Island',
    'Zou',
    'Wano',
    'Egg-Head'
];


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

    // Assegna gli ID e i nomi alle isole nell'HTML
    islandElements.forEach((islandElement, index) => {
        // Se ci sono più isole nel DOM rispetto all'array, usa solo quelle che puoi
        const islandID = islands[index] || `Isola Extra ${index + 1}`; // ID di riserva per isole extra

        islandElement.id = islandID; // Assegna l'ID all'elemento

        const islandNameElement = islandElement.querySelector('.island-name');
        if (islandNameElement) {
            islandNameElement.textContent = islandID.replace('-', ' ').toUpperCase(); // Aggiorna il nome dell'isola
        }
    });
}

// Chiamata per mescolare le isole e assegnare gli ID
assignIslandIDs();