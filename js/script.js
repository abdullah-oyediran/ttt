const statusBar = (() => {
    let statusBarElement = document.querySelector('#status-bar')

    function show(msg) {
        statusBarElement.innerHTML = ''
        statusBarElement.textContent = msg
    }

    function promptNewGame() {
        let button = document.createElement('button')
        button.id = 'new-game-btn'
        button.textContent = 'New Game'

        button.addEventListener('click', gameController.startNewGame)

        statusBarElement.appendChild(button)
    }

    return {
        show,
        promptNewGame,
    }
})()

function createSquare(num) {
    let marker = false
    let squareElement
    let handleClick

    function changeMarker(newMarker) {
        if (!marker) {
            marker = newMarker

            statusBar.show(`Square ${num+1} is claimed by ${newMarker.toUpperCase()}`)
        }
    }
    function getMarker() {
        return marker
    }
    function reset() {
        marker = false
    }
    function disable() {
        squareElement.removeEventListener('click', handleClick)
    }

    function createSquareElement() {
        squareElement = document.createElement('div')
        handleClick = () => {
            gameController.playMove(num)
        }
        squareElement.classList.add('square')

        if (marker) {
            let text = createTextElement(marker)
            squareElement.appendChild(text)

            /*
            const textNode = text.querySelector('text')
            const bbox = textNode.getBBox()

            console.log({
                marker,
                bboxWidth: bbox.width,
                bboxHeight: bbox.height,
            })

            const scaleX = 100 / bbox.width
            const scaleY = 100 / bbox.height

            const cx = bbox.x + bbox.width / 2
            const cy = bbox.y + bbox.height / 2

            textNode.setAttribute('transform', `translate(50, 50) scale(${scaleX}, ${scaleY}) translate(${-cx}, ${-cy})`)
            */
        }

        

        squareElement.addEventListener('click', handleClick)

        return squareElement
    }


    function createTextElement(text) {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg', 'svg'
        )
        svg.setAttribute('viewBox', '0 0 100 100')
        svg.setAttribute('preserveAspectRatio', 'xMidYMidmeet')

        const textElement = document.createElementNS(
            'http://www.w3.org/2000/svg', 'text'
        )
        textElement.setAttribute('x', '20')
        textElement.setAttribute('y', '75')
        //textElement.setAttribute('text-anchor', 'left')
        textElement.setAttribute('font-size', '80')
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
        disable,
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
    function disable() {
        for (let square of squares) {
            square.disable()
        }

    }

    return {
        getAllSquares,
        getMarkedSquares,
        setBoard,
        reset,
        disable,
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

    function reset() {
        claimedSquares = []
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

    function stopGame() {
        gameBoard.disable()
        statusBar.promptNewGame()
    }
    function startNewGame() {
        gameBoard.reset()
        for (let player of players) {
            player.reset()
        }
        gameBoard.setBoard()
        statusBarElement.show('Game Starts!')
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
        statusBar.show(`Player ${player.char.toUpperCase()} won!`)
        stopGame()
    }
    function draw() {
        statusBar.show('This game is drawn')
        stopGame()
    }

    return {
        playMove,
        startNewGame,
    }
})()



gameBoard.setBoard()
statusBar.show('Game Starts!')