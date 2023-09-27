document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let gameStarted = false; 
  let nextRandom = 0
  let timerId
  let score = 0
  let gamePause = false

  const lTetromino = [
    [1, width+1, width*2+1, 2],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2+1, width*2],
    [width, width*2, width*2+1, width*2+2],
  ]

  const zTetromino = [
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1],
    [width+1, width+2, width*2, width*2+1]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
    [0, 1, width, width+1],
  ]

  const iTetromino = [
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
    [1, width+1, width*2+1, width*3+1],
    [width, width+1, width+2, width+3],
  ]

  const theTetrominoes = [lTetromino, zTetromino, tTetromino,oTetromino, iTetromino]
  let currentPosition = 4
  let currentRotation = 0

  let random = Math.floor(Math.random()*theTetrominoes.length)
  console.log(random)
  let current = theTetrominoes[random][currentRotation]

  console.log(theTetrominoes)

  //draw the tetromino
  function draw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
    })
  }

  //undraw the Tetromino

  function undraw(){
    current.forEach(index =>{
      squares[currentPosition + index].classList.remove('tetromino')
    })
  }

  //assign functions to keyCodes
  function control(e){
    if((e.keyCode === 37)&& (timerId)){
      moveLeft()
    } else if ((e.keyCode === 38)&& (timerId)){
      rotate()
    } else if ((e.keyCode === 39)&& (timerId)){
      moveRight()
    } else if ((e.keyCode === 40)&& (timerId)){
      moveDown()
    }
  }

  document.addEventListener('keyup', control)

  //move down function
  function moveDown() {
    
    if(!current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      undraw()
      currentPosition += width
      draw()
    } else {
      freeze();  
    }
  }

  //freeze function
 //freeze function
  function freeze() {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random() * theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
  }
  //move the tetromino left, unless it is at the edge or there is a blockage
  function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition + index) % width === 0)
    if(!isAtLeftEdge){
      currentPosition -=1
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition += 1
    }
    draw()
  }
  // move the tetromino right, unless is at the edge or there is a blockage
  function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition + index) % width === width - 1)
    if(!isAtRightEdge){
      currentPosition +=1
    }
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -= 1
    }
    draw()
  }

  function rotate(){
    undraw()
    currentRotation ++
    if(currentRotation === current.length){
      //if the current rotation gets to 4, go back to 0
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
  }

  //show up next tetromino in mini grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  let displayIndex = 0

  // the Tetrominos without rotations
  const upNextTetrominoes = [
    [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
    [0, displayWidth, displayWidth+1, displayWidth*2+1], //zTetromino
    [1, displayWidth, displayWidth+1, displayWidth+2], //tTetromino
    [0, 1, displayWidth, displayWidth+1], //oTetromino
    [1, displayWidth+1, displayWidth*2+1, displayWidth*3+1] //iTetromino
  ]

  function displayShape(){
    //remove any trace of a tetromino from the entire grid
    displaySquares.forEach(square =>{
      square.classList.remove('tetromino')
    })
    upNextTetrominoes[nextRandom].forEach(index => {
      displaySquares[displayIndex + index].classList.add('tetromino')
    })
  }

  //add functionality to the button
  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
      startBtn.innerHTML = 'Resume';
    } else {
      if (!gameStarted) {
        // Only change the "upNext" tetromino if the game hasn't started yet
        nextRandom = Math.floor(Math.random() * theTetrominoes.length);
        displayShape();
        gameStarted = true;
      }
      if (gamePause) {
        startBtn.innerHTML = 'Pause';
        gamePause = false;
      } else {
        draw();
        startBtn.innerHTML = 'Pause';
      }
      timerId = setInterval(moveDown, 1000);
    }
  });
  

  function addScore(){
    for(let i = 0; i< 199; i += width){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))){
        score +=10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
        })
        const squaresRemoved = squares.splice(i, width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell => grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver(){
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      scoreDisplay.innerHTML = 'Game Over';
      clearInterval(timerId);
    }
  }
})