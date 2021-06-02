import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.letter}
    </button>
  );
}

class Board extends React.Component {
  createSquare(i) {
    return (
      <Square
        letter={this.props.squares[i]}
	onClick={() => this.props.onClick(i)}
      />
    );
  }

  createRow(start, numRows) {
    let row=[];
    for (let j = start; j < (start+numRows); j++) {
      row.push(this.createSquare(j));
    }
    return row;
  }

  createBoard(numRows) {
    let board=[];
    for (let j = 0; j < numRows; j++) {
      board.push(
        <div className="board-row">
          {this.createRow(j*numRows, numRows)}
        </div>
      );
    }
    return board;
  }

  render() {
    const numRows = Number.parseInt(this.props.numRows, 10);
    return (
      <div>
        {this.createBoard(numRows)}
      </div>
    );
  }
}

function MoveList(props) {
  const ascending = props.ascending;
  const arr = props.history.map((step, move) => {
    const desc = move ?
    'Go to move #' + move + ' at ' + props.history[move].lastLocation:
    'Go to game start';
     return (
       <li key={move}>
         <button
           onClick={() => props.jumpTo(move)}
           className={(move === props.selectedMove) ? "selected" : null}
          >
          {desc}
          </button>
       </li>
     );
   }
  );
  if (ascending) {
    return arr;
  } else {
    return arr.reverse();
  }
}

function ToggleButton(props) {
  const ascending = props.ascending;
  const ascdesc = ascending ? "Sort descending" : "Sort ascending";
  return (
    <button
      onClick={props.handleToggle}
    >
      {ascdesc}
    </button>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(
	  (Number.parseInt(this.props.numRows, 10)) *
	  (Number.parseInt(this.props.numRows, 10))
	).fill(null),
	lastLocation: null,
      }],
      selectedMove: null,
      stepNumber: 0,
      xIsNext: true,
      ascending: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const numRows = Number.parseInt(this.props.numRows);
    if (calculateWinner(squares, numRows) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastLocation: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      selectedMove: step,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleToggle() {
    this.setState(prevState => ({
      ascending: !prevState.ascending
    }));
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const numRows = Number.parseInt(this.props.numRows, 10);
    const winner = calculateWinner(current.squares, numRows);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
	    numRows = {numRows}
	    squares={current.squares}
	    onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
	</div>
        <div className="move-list">
	  <MoveList
	    history = {this.state.history}
	    jumpTo = {(move) => this.jumpTo(move)}
	    selectedMove = {this.state.selectedMove}
	    ascending = {this.state.ascending}
	  />
	</div>
	<div className="toggle-button">
	  <ToggleButton
	    ascending = {this.state.ascending}
	    handleToggle = {() => this.handleToggle()}
	  />
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game numRows="3"/>,
  document.getElementById('root')
);

function calculateWinner(squares, numRows) {
  let lines = [];

  //calculate horizontal row wins
  for (let k = 0; k < numRows; k++) {
    let combo = [];
    for (let j = k*numRows; j < (k*numRows + numRows); j++) {
      combo.push(j);
    }
    lines.push(combo);
  }

  //calculate vertical column wins
  for (let k=0; k < numRows; k++) {
    let combo = [];
    for (let j = k; j < numRows*numRows; j += numRows) {
      combo.push(j);
    }
    lines.push(combo);
  }

  //calculate diagonal wins
  let diagonal1 = [];
  for ( let k=0; k < (numRows*numRows); k += (numRows + 1) ) {
    diagonal1.push(k);
  }
  lines.push(diagonal1);

  let diagonal2 = [];
  for ( let k=(numRows - 1); k < (numRows*numRows); k +=(numRows - 1) ) {
    diagonal2.push(k);
  }
  lines.push(diagonal2);

  //check for winner
  for (let i = 0; i < lines.length; i++) {
    let arr = [];
    for (let h = 0; h < numRows; h++) {
      arr.push( (lines[i])[h] );
    }
    if (!squares[arr[0]]) {
      continue;
    }
    for (let g = 1; g <= numRows; g++) {
      if (g === numRows) {
        return squares[arr[0]];
      }
      if (squares[arr[0]] != squares[arr[g]]) {
        break;
      }
    }
  }
  return null;
}
