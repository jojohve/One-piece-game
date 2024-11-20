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

export function assignIslandToDiv() {
    const islandDivs = document.querySelectorAll('.island');

    // Usa solo le prime 5 isole dall'array
    const selectedIslands = islands.slice(0, 5);

    if (islandDivs.length === selectedIslands.length) {
        islandDivs.forEach((islandDiv, index) => {
            const islandName = selectedIslands[index];
            
            // Assegna l'ID e il nome dell'isola
            islandDiv.setAttribute('id', `island-${index + 1}`);
            islandDiv.setAttribute('data-island', islandName);
            
            // Aggiorna il contenuto del div
            const islandNameSpan = islandDiv.querySelector('.island-name');
            if (islandNameSpan) {
                islandNameSpan.innerText = islandName;
            }
        });
    } else {
        console.log("Il numero di div con classe 'island' non corrisponde a 5.");
    }
}