function createSquare(num) {
    let marker = false

    function changeMarker(newMarker) {
        marker = newMarker
    }
    function getMarker() {
        return marker
    }
    return {
        id: num,
        changeMarker,
        getMarker,
    }
}



const gameBoard = (() => {
    let squares = []

    let gameBoardElement = document.querySelector('div#gameboard')

    for (let i = 0; i < 9; i++) {
        let square = createSquare(i)
        squares.push(square)
    }

    function setBoard() {
        for (let square in squares) {
            let squareElement = document.createElement('div')
            squareElement.classList.add('square')
            gameBoardElement.appendChild(squareElement)
        }
    }

    function getAllSquares() {
        return squares
    }
    
    function getMarkedSquares() {
        return squares.filter(square => square.getMarker())
    }

    return {
        getAllSquares,
        getMarkedSquares,
        setBoard,
    }
})()


function createPlayer(char) {
    let claimedSquares = []

    function getClaimedSquares() {
        return claimedSquares
        .sort((a,b) => a-b)
        .join('')
    }

    function claimSquare(num) {
        claimedSquares.push(num)
    }

    return {
        char,
        getClaimedSquares,
        claimSquare,
    }
}

const gameController = (() => {
    let playerX = createPlayer('x')
    let playerO = createPlayer('o')

    const players = [playerX, playerO]
    const winningCombos = [
        '012', '345', '678', '036', '147', '258', '048', '246'
    ]


    let gameState = {
        turn: false,

    }

    function playMove(square) {
        let currentPlayer = players[Number(gameState.turn)]
        currentPlayer.claimSquare(square)

        let currentSquare = gameBoard.getAllSquares()[square]
        currentSquare.changeMarker(currentPlayer.char.toUpperCase())

        arbit(currentPlayer)


        gameState.turn = !gameState.turn
    }

    function arbit(player) {
        if ( winningCombos.some((winningCombo) => winningCombo.includes(player.getClaimedSquares())) ) {
            win(player)
        } else if (gameBoard.getAllSquares().length === 9) {
            draw()
        }

        return
    }


    function win(player) {
        console.log(`${player.char} won`)
    }
    function draw() {
        console.log('This game is drawn')
    }

    return {
        playMove,
        players,
    }
})()



gameBoard.setBoard()