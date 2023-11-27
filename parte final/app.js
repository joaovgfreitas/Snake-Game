const gridSize = 20;
const canvasSize = 400;
let snakeColor = "white";
const foodColor = "orange";
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
let snake = [
  { x: 14, y: 10 }, // cabeça da cobra
  { x: 13, y: 10 }, // segmento 1
  { x: 12, y: 10 }, // segmento 2
  { x: 11, y: 10 }, // segmento 3
  { x: 10, y: 10 }, // segmento 4
];
let food = { x: 15, y: 10 }; // posicao inicial comida, mas é gerado de forma aleatoria embaixo
let dx = 0;
let dy = 0;
let score = 0;
let gameloop;
let powerUpActive = false;
let powerUpType = null;

function handlekeyPress(e) {
  if (gameloop === undefined) {
    gameloop = setInterval(updateGame, 100); // Intervalo de movimentacao = velocidade da cobra
  }
  const key = e.key;
  if (key === "ArrowUp" && dy !== 1) {
    dx = 0;
    dy = -1;
  } else if (key === "ArrowDown" && dy !== -1) {
    dx = 0;
    dy = 1;
  } else if (key === "ArrowLeft" && dx !== 1) {
    dx = -1;
    dy = 0;
  } else if (key === "ArrowRight" && dx !== -1) {
    dx = 1;
    dy = 0;
  }
}

function activatePowerUp() {
  if (powerUpType === "speed") {
    // Power-up de aumento de velocidade
    snakeColor = "red"; // Mude a cor da cobra quando o power-up estiver ativo

    // Limpa o intervalo original antes de definir um novo com uma velocidade aumentada
    clearInterval(gameloop);
    gameloop = setInterval(() => {
      updateGame();
      if (!powerUpActive) {
        // Se o power-up não estiver mais ativo, volte para a velocidade padrão
        snakeColor = "white";
        clearInterval(gameloop);
        gameloop = setInterval(updateGame, 100);
      }
    }, 50); // Aumenta a velocidade

    setTimeout(() => {
      // Restaura a cor padrão da cobra e sinaliza que o power-up não está mais ativo
      snakeColor = "white";
      powerUpActive = false;
    }, 5000); // O power-up de velocidade dura 5 segundos (pode ajustar conforme necessário)
  } else if (powerUpType === "slow") {
    // Power-up de diminuir de velocidade
    snakeColor = "green"; // Mude a cor da cobra quando o power-up estiver ativo

    // Limpa o intervalo original antes de definir um novo com uma velocidade aumentada
    clearInterval(gameloop);
    gameloop = setInterval(() => {
      updateGame();
      if (!powerUpActive) {
        // Se o power-up não estiver mais ativo, volte para a velocidade padrão
        snakeColor = "white";
        clearInterval(gameloop);
        gameloop = setInterval(updateGame, 100);
      }
    }, 150); // diminui a velocidade

    setTimeout(() => {
      // Restaura a cor padrão da cobra e sinaliza que o power-up não está mais ativo
      snakeColor = "white";
      powerUpActive = false;
    }, 5000); // O power-up de velocidade dura 5 segundos (pode ajustar conforme necessário)
  }
}

function gameOver() {
  clearInterval(gameloop);
  ctx.clearRect(0, 0, canvasSize, canvasSize);
  ctx.fillStyle = "white";
  ctx.font = "30px Arial";
  ctx.fillText("Game Over", 120, 130);
  ctx.fillText(`Score: ${score}`, 135, 170);
}

function updateGame() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  // Retorna a cobra para cima, baixo, esquerda ou direita quando sair do quadrado
  if (head.x < 0) {
    head.x = canvasSize / gridSize - 1;
  } else if (head.x >= canvasSize / gridSize) {
    head.x = 0;
  } else if (head.y < 0) {
    head.y = canvasSize / gridSize - 1;
  } else if (head.y >= canvasSize / gridSize) {
    head.y = 0;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x === head.x && snake[i].y === head.y) {
      gameOver();
      return;
    }
  }

  snake.unshift(head);
  // Aumenta o tamanho da cobra quando come
  if (head.x === food.x && head.y === food.y) {
    score += 10;

    // Verifica se a pontuação atingiu 20 ou 50 para gerar power-ups
    if (score === 20) {
      powerUpType = "speed";
      powerUpActive = true;
      generateFood(); // Gera uma nova comida regular além do power-up
    } else if (score === 50) {
      powerUpType = "slow";
      powerUpActive = true;
      generateFood(); // Gera uma nova comida regular além do power-up
    } else {
      generateFood();
    }
  } else {
    snake.pop();
  }

  // Ativa o power-up quando necessário
  if (powerUpActive) {
    activatePowerUp();
  }

  ctx.clearRect(0, 0, canvasSize, canvasSize);
  drawSnake();
  drawFood();
}

function drawSnake() {
  snake.forEach((segment, index) => {
    if (index === 0) {
      ctx.fillStyle = "darkblue"; // define a cabeca da cobra como azul escuro
    } else {
      ctx.fillStyle = snakeColor;
    }
    ctx.fillRect(
      segment.x * gridSize,
      segment.y * gridSize,
      gridSize,
      gridSize
    );
  });
}

function generateFood() {
  let newFoodPosition;
  do {
    newFoodPosition = {
      x: Math.round(Math.random() * (canvasSize / gridSize)),
      y: Math.round(Math.random() * (canvasSize / gridSize)),
    };
  } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));

  food = newFoodPosition;
}


function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

generateFood();
document.addEventListener("keydown", handlekeyPress);