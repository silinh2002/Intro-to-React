import React from "react";
import { useState } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
function Square(props) {
  return (
    <button className={"square " + props.className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}
function Board(props) {
  const [row, setRow] = useState([0, 1, 2]);
  const renderSquare = (i) => {
    let className = props.lines.includes(i) ? "square-win" : "";
    if (props.squares[i]) {
      className += props.squares[i] === "X" ? " square-x" : " square-o";
    }
    return (
      <Square
        className={className}
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
      />
    );
  };
  const element = row.map((value) => (
    <div key={value} className="board-row">
      {renderSquare((value % 3) * 3)}
      {renderSquare((value % 3) * 3 + 1)}
      {renderSquare((value % 3) * 3 + 2)}
    </div>
  ));
  return <div>{element}</div>;
}
function Game(props) {
  const [state, setState] = useState({
    history: [{ squares: Array(9).fill(null) }],
    stepNumber: 0,
    xIsNext: true,
    isStart: false,
    player: null,
    operatorClick: false,
    // position: 0,
    backStep: null,
    lastX: null,
    lastO: null,
  });
  let handleClick = (i) => {
    // let position ;
    const history = state.history.slice(0, state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = state.xIsNext ? "X" : "O";
    setState({
      history: history.concat([
        {
          squares: squares,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !state.xIsNext,
    });
  };
  let jumpTo = (step) => {
    setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  };
  const history = state.history;
  const current = history[state.stepNumber];
  const winner = calculateWinner(current.squares);
  const moves = history.map((step, move) => {
    const desc = move ? "Go to move #" + move : "Go to game start";
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });
  let status;
  if (winner) {
    status = "Winner: " + winner.playerWin;
  } else {
    if (history.length > 9) status = "No winner: X and O tied ";
    else status = "Next player: " + (state.xIsNext ? "X" : "O");
  }
  return (
    <div className="game">
      <div className="game-board">
        <Board
          lines={winner ? winner.lines : []}
          squares={current.squares}
          onClick={(i) => handleClick(i)}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}
// ========================================
ReactDOM.render(<Game />, document.getElementById("root"));
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        playerWin: squares[a],
        lines: lines[i],
      };
    }
  }
  return null;
}

//ReactDOM.render(<Game />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
