import "./App.css";
import { useState, useEffect, useRef } from "react";
import { useInterval } from "./useInterval";
import {
  CANVAS_SIZE,
  SNAKE_START,
  APPLE_START,
  SCALE,
  SPEED,
  DIRECTIONS,
} from "./constants.js";

function App() {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState(SNAKE_START);
  const [apple, setApple] = useState(APPLE_START);
  const [directions, setDirections] = useState([0, -1]);
  const [speed, setSpeed] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const startGame = () => {
    setSnake(SNAKE_START);
    setApple(APPLE_START);
    setDirections([0, -1]);
    setSpeed(SPEED);
    setGameOver(false);
  };
  const endGame = () => {
    setSpeed(null);
    setGameOver(true);
  };
  const moveSnake = ({ keyCode }) =>
    keyCode >= 37 && keyCode <= 40 && setDirections(DIRECTIONS[keyCode]);
  const createApple = () =>
    apple.map((_, i) => Math.floor((Math.random() * CANVAS_SIZE[i]) / SCALE));
  const checkCollision = (piece, snk = snake) => {
    if (
      piece[0] * SCALE >= CANVAS_SIZE[0] ||
      piece[0] < 0 ||
      piece[1] * SCALE >= CANVAS_SIZE[1] ||
      piece[1] < 0
    )
      return true;

    for (const seg of snk) {
      if (piece[0] === seg[0] && piece[1] === seg[1]) return true; // controls snake collision details
    }
    return false;
  };
  const checkAppleCollision = (newSnake) => {
    if (newSnake[0][0] === apple[0] && newSnake[0][1] === apple[1]) {
      let newApple = createApple();
      while (checkCollision(newApple, newSnake)) {
        newApple = createApple();
      }
      setApple(newApple);
      return true;
    }
    return false;
  };
  const gameLoop = () => {
    const snakeCopy = JSON.parse(JSON.stringify(snake));
    const newSnakeHead = [
      snakeCopy[0][0] + directions[0],
      snakeCopy[0][1] + directions[1],
    ];
    snakeCopy.unshift(newSnakeHead);
    if (checkCollision(newSnakeHead)) endGame();
    if (!checkAppleCollision(snakeCopy)) snakeCopy.pop();
    setSnake(snakeCopy);
  };

  useEffect(() => {
    const context = canvasRef.current.getContext("2d");
    context.setTransform(SCALE, 0, 0, SCALE, 0, 0);
    context.clearRect(0, 0, CANVAS_SIZE[0], CANVAS_SIZE[1]);
    context.fillStyle = "red";
    snake.forEach(([x, y]) => context.fillRect(x, y, 1, 1));
    context.fillStyle = "lightblue";
    context.fillRect(apple[0], apple[1], 1, 1);
  }, [snake, apple, gameOver]);

  useInterval(() => gameLoop(), speed);
  return (
    <div
      className="gameboard"
      role="button"
      tabIndex="0"
      onKeyDown={(e) => moveSnake(e)}
    >
      <h1 style={{ color: "white" }} className="snakeheader">
        Snake
      </h1>
      <div className="level-board">Level 1</div>
      <canvas
        style={{ border: "3px solid white" }}
        ref={canvasRef}
        width={`${CANVAS_SIZE[0]}px`}
        height={`${CANVAS_SIZE[1]}px`}
      />
      {gameOver && <div style={{ color: "white" }}>GAME OVER! </div>}
      <br></br>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
}

export default App;
