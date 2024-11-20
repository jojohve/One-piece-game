export const turnRules = {
    currentPlayer: 1,
    hasUsedSpecialMove: [false, false],
    hasUsedHaki: [false, false]
};

export function switchTurn() {
    turnRules.currentPlayer = turnRules.currentPlayer === 1 ? 2 : 1;
    console.log(`Il turno è passato a: Giocatore ${turnRules.currentPlayer}`);
}

/*
// Variabili di stato per il controllo delle azioni per turno
    let player1Actions = {
        hasDropped: false, // Controlla se il giocatore 1 ha già effettuato un drop
        hasUsedSpecialMove: false, // Controlla se il giocatore 1 ha già usato la mossa speciale
    };

    let player2Actions = {
        hasDropped: false, // Controlla se il giocatore 2 ha già effettuato un drop
        hasUsedSpecialMove: false, // Controlla se il giocatore 2 ha già usato la mossa speciale
    };

    function mossaPerTurno() {

    }

    function azionePerTurno() {

    }

    function hakiPerPartita() {

    }

    function effettoTipo() {

    }

    function isolaBoost() {

    }
*/