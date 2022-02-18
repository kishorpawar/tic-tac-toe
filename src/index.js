import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import './index.css';
import './custom.css'

// class Square extends React.Component {

//     // constructor(props){
//     //     super(props);
//     //     this.state = {
//     //         value : null,
//     //     }
//     // }

//     setValue(){
//         console.log(`clicked ${this.props.value}`);
//         // this.setState({value: 'X'});
//         this.props.onClick();
//     }

//     render() {
//         return (
//             <button 
//                 className="square" 
//                 onClick={this.setValue.bind(this)}
//             >
//                 {this.props.value}
//             </button>
//         );
//     }
// }

function Square(props){
    return (
        <Button 
            className='square'
            onClick={props.onClick}
            // disabled={props.disabled}
        >
            <div className='content'>
                {props.value}
            </div>
        </Button>
    )
}

class Board extends React.Component {

    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares : Array(9).fill(null),
    //         xIsNext: true,
    //         status: "Next Player: X",
    //         isDisabled: false,
    //     }
    // } 

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]} 
                onClick={() => this.props.onClick(i)}
                disabled={this.props.isDisabled}
            />
        );
    }

    render() {
        return (
            <div>
                {/* <div className="status">{this.props.status}</div> */}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            history :[{
                squares : Array(9).fill(null),
            }],
            xIsNext: true,
            status: "Next Player: X",
            isDisabled: false,
            stepNumber: 0,
        }
    } 

    handleClick(i){
        console.log(`Clicked #${i}. `)
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const squares = current.squares.slice();

        if(squares[i] != null)
        {
            // Tell user it is foul;
            return false;
        }

        const winner = calculateWinner(squares);
        if (winner){
            this.setState({
                status: `Winner : ${winner}`,
                isDisabled: true
            });
            return false;
        }
        else{
            this.setState({status : `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`});
        }

        squares[i] =  this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat({
                squares:squares,
            }),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            }, () => {
            console.log(`It is ${squares[i]}.`);
            const winner = calculateWinner(squares);
            if (winner){
                this.setState({
                    status: `Winner : ${winner}`,
                    isDisabled: true
                });
                return false;
            }
            else{
                this.setState({status : `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`});
            }
        });
    }

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext : (step % 2) === 0
        })
    }

    render() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        // const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                `Go to move # ${move}` :
                `Restart`;
            
            return (
                <li key={move} className="mt-1">
                    <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
                </li>
            );
        })

        // let status;
        // if (winner){
        //     status = `Winner : ${winner}`;
        // }
        // else{
        //     status = `Next Player: ${this.state.xIsNext ? 'X' : 'O'}`;
        // }

        return (
            <div className="game justify-content-center">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className='h3'>{this.state.status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [0, 3, 6],
        [0, 4, 8],
        [3, 4, 5],
        [6, 7, 8],
        [6, 4, 2],
        [1, 4, 7],
        [2, 5, 8],
    ]

    for (let i=0; i < lines.length; i++)
    {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && 
            squares[a] === squares[c])
        {
            return squares[a];
        }
    }
    return null;
}