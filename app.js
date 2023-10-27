const gridSize = 20
const canvasSize = 400
const snakeColor = "white"
const foodColor = "orange"
const canvas = document.getElementById("gameCanvas")
const ctx = canvas.getContext("2d")
// Explicar que aqui é o corpo da cobra e suas posições iniciais 
let snake = [
    {x: 14, y: 10}, // cabeça da cobra
    {x: 13, y: 10}, // segmento 1
    {x: 12, y: 10}, // segmento 2
    {x: 11, y: 10}, // segmento 3
    {x: 10, y: 10}, // segmento 4
]
let food = {x: 15, y: 10} //posicao inicial comida, mas é gerado de forma aleatoria embaixo
let dx = 0
let dy = 0
let score = 0
let gameloop

function handlekeyPress(e){
    if (gameloop === undefined){
        gameloop = setInterval(updateGame, 100) //Intervalo de movimentacao = velocidade da cobra
    }
    const key = e.key
    // Movimentacao de acordo com comandos -> Setas
    if (key === "ArrowUp" && dy !== 1){
        dx = 0
        dy = -1 
    } else if (key === "ArrowDown" && dy !== -1){
        dx = 0
        dy = 1
    } else if (key === "ArrowLeft" && dx !== 1){
        dx = -1
        dy = 0
    } else if (key === "ArrowRight" && dx !== -1){
        dx = 1
        dy = 0
    }
}
//Função Game Over que encerra o jogo quando a cobra bate em si mesma
function gameOver(){
    clearInterval(gameloop);
    ctx.clearRect(0, 0, canvasSize, canvasSize)
    ctx.fillStyle = "white"
    ctx.font = "30px Arial"
    ctx.fillText("Game Over", 120, 130)
    ctx.fillText(`Score: ${score}`, 135, 170)
}

function updateGame(){
    const head = {x: snake[0].x + dx, y: snake[0].y + dy}
    //Retorna a cobra para cima, baixo, esquerda ou direita quando sair do quadrado
    if (head.x < 0){
        head.x = canvasSize / gridSize - 1
    }else if (head.x >= canvasSize / gridSize){
        head.x = 0
    }else if (head.y < 0){
        head.y = canvasSize / gridSize - 1
    }else if (head.y >= canvasSize / gridSize){
        head.y = 0
    }
    // Se a cobra tocar no proprio corpo
    for (let i = 1; i < snake.length; i++){
        if (snake[i].x === head.x && snake[i].y === head.y){
            gameOver();
            return;
        }
    }

    snake.unshift(head)
    //Aumenta o tamanho da cobra quando come
    if (head.x === food.x && head.y === food.y){
        score += 10
        generateFood()
    }else {
        snake.pop()
    }
    
    // Apaga o corpo da cobra depois que ela passa
    ctx.clearRect (0, 0, canvasSize, canvasSize)
    drawSnake();
    drawFood();
}
//Inicializando a cobra
function drawSnake(){
    snake.forEach((segment, index) =>{
        if (index === 0){
            ctx.fillStyle = "darkblue" //define a cabeca da cobra como azul escuro
        }else {
            ctx.fillStyle = snakeColor
        }
        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize,
            gridSize
        )
    })
}

//Gera a comida aleatoriamente dentro do quadrado
function generateFood(){
    food = {
        x: Math.floor(Math.random()* (canvasSize / gridSize)),
        y: Math.floor(Math.random()* (canvasSize / gridSize)),
    }
}

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize)
}

generateFood()

document.addEventListener('keydown', handlekeyPress)