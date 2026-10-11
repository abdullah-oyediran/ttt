function createSquare(num) {
    let marker = false

    function changeMarker(newMarker) {
        if (!marker) {
            marker = newMarker

            console.log(`${num} is claimed by ${newMarker}`)
        }
    }
    function getMarker() {
        return marker
    }

    function createSquareElement() {
        let squareElement = document.createElement('div')
        squareElement.classList.add('square')

        if (marker) {
            let text = createTextElement(marker)
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


    function createTextElement(text) {
        const svg = document.createElementNS(
            'http://www.w3.org/2000/svg', 'svg'
        )
        svg.setAttribute('viewBox', '0 0 100 100')
        svg.setAttribute('preserveAspectRatio', 'none')

        const textElement = document.createElementNS(
            'http://www.w3.org/2000/svg', 'text'
        )
        textElement.setAttribute('x', '0')
        textElement.setAttribute('x', '0')
        textElement.setAttribute('x', '0')
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
        let currentSquare = gameBoard.getAllSquares()[square]
        if (currentSquare.getMarker()) return

        let currentPlayer = players[Number(gameState.turn)]
        currentPlayer.claimSquare(square)

        currentSquare.changeMarker(currentPlayer.char.toUpperCase())

        

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