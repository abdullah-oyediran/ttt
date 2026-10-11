

const statusBar = (() => {
    let statusBar = document.querySelector('#status-bar')

    function show(msg) {
        statusBar.textContent = msg
    }

    function reset() {
        statusBar.innerHTML =''
        show('Game Starts!')
    }

    function promptNewGame() {
        let button = document.createElement('button')
        button.classList.add('new-game-btn')
        button.textContent = 'New game'
        button.addEventListener('click', () => {
            reset()
            gameBoard.setBoard();
        })

        statusBar.appendChild(button)
    }
    
    return {
        show,
        promptNewGame,
    }
})()

function createSquare(num) {
    let marker = false

    function changeMarker(newMarker) {
        if (!marker) {
            marker = newMarker

            statusBar.show(`Square ${num+1} is claimed by ${newMarker}`)
        }
    }
    function getMarker() {
        return marker
    }

    function reset() {
        marker = false;
    }

    function createSquareElement() {
        let squareElement = document.createElement('div')
        squareElement.classList.add('square')

        if (marker) {
            //squareElement.classList.add(marker.toLowerCase())
            
            let text = createTextElement(squareElement, marker)
            squareElement.appendChild(text)

            const textNode = text.querySelector('text')
            const bbox = textNode.getBBox()

            const scaleX = 100 / bbox.width
            const scaleY = 100 / bbox.height

            const cx = bbox.x + bbox.width / 2
            const cy = bbox.y + bbox.height / 2

            textNode.setAttribute('transform', `translate(50, 50) scale(${scaleX}, ${scaleY}) translate(${-cx}, ${-cy})`)
        }

        squareElement.addEventListener('click', (e) => {
            gameController.playMove(num)
        })

        return squareElement
    }

    function createTextElement(parent, text) {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg', 'svg'
        )
        svg.setAttribute('viewBox', '0 0 100 100')
        svg.setAttribute('preserveAspectRatio', 'none')

        const textElement = document.createElementNS(
            'http://www.w3.org/2000/svg', 'text'
        )
        textElement.setAttribute('x', '0')
        textElement.setAttribute('y', '80')
        textElement.setAttribute('font-size', '100')
        textElement.setAttribute('fill', 'rgba(255,255,255,0.5)')
        textElement.classList.add('text-element')

        textElement.textContent = text
        
        svg.appendChild(textElement)

        return svg
    }

    return {
        id: num,
        changeMarker,
        getMarker,
        createSquareElement,
        reset,
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

        gameBoardElement.innerHTML = ''
        for (let square of squares) {
            gameBoardElement.appendChild(square.createSquareElement())
        }

        console.log('game board set board')
    }

    function getAllSquares() {
        return squares
    }
    
    function getMarkedSquares() {
        return squares.filter(square => square.getMarker())
    }

    function reset() {
        for (let square of squares) {
            square.reset()
        }
    }

    return {
        getAllSquares,
        getMarkedSquares,
        setBoard,
        reset
    }
})()


function createPlayer(char) {
    let claimedSquares = []

    function getClaimedSquares() {
        return claimedSquares
        .sort((a,b) => a-b)
        .join('')
    }

    function reset() {
        claimedSquares = []
    }

    function claimSquare(num) {
        claimedSquares.push(num)
    }

    return {
        char,
        getClaimedSquares,
        claimSquare,
        reset,
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

    function stopGame() {
        gameState.turn = false;
        gameBoard.reset()
        statusBar.promptNewGame()
        
        
    }

    function playMove(square) {
        let currentSquare = gameBoard.getAllSquares()[square]
        if (currentSquare.getMarker()) return

        let currentPlayer = players[Number(gameState.turn)]
        currentPlayer.claimSquare(square)

        currentSquare.changeMarker(currentPlayer.char.toUpperCase())

        gameBoard.setBoard()

        arbit(currentPlayer)


        gameState.turn = !gameState.turn
    }




    function arbit(player) {
        if ( winningCombos.some((winningCombo) => player.getClaimedSquares().includes(winningCombo)) ) {
            win(player)
        } else if (gameBoard.getMarkedSquares().length === 9) {
            draw()
        }

        return
    }


    function win(player) {
        statusBar.show(`${player.char.toUpperCase()} won`)
        stopGame()
    }
    function draw() {
        statusBar.show('This game is drawn')
        stopGame()
    }

    return {
        playMove,
        players,
    }
})()



gameBoard.setBoard()
statusBar.show('Game starts!')