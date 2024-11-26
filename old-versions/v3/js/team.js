// team.js
export let player1Cards = [];
export let player2Cards = [];

// Funzione per resettare i mazzi (se necessario)
export function resetTeams() {
    player1Cards = [];
    player2Cards = [];
}

export function saveGameState() {
    // Qui potresti voler salvare lo stato del gioco, come il turno corrente, le carte spostate, ecc.
    localStorage.setItem('gameState', JSON.stringify({
        player1Actions,
        player2Actions,
        turnNumber,
        turnRules
    }));
}
