import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Minesweeper from "./Minesweeper";
import AppHeader from "./AppHeader";

type GameArray = {
	type: string;
	opened: boolean;
	flag: boolean;
}[][];

interface gameBoardInterface {
	board: GameArray;
	sizeX: number;
	sizeY: number;
	showMines: boolean;
	moveX: React.Dispatch<React.SetStateAction<number>>
	moveY: React.Dispatch<React.SetStateAction<number>>
	moveType: React.Dispatch<React.SetStateAction<number>>
	moveTimestamp: React.Dispatch<React.SetStateAction<number>>
}

interface CellInterface {
	flag: boolean;
	opened: boolean;
	type: string;
	rowIdx: number;
	cellIdx: number;
	moveX: React.Dispatch<React.SetStateAction<number>>
	moveY: React.Dispatch<React.SetStateAction<number>>
	moveType: React.Dispatch<React.SetStateAction<number>>
	moveTimestamp: React.Dispatch<React.SetStateAction<number>>
}

function StatusBar() {
	function newGame() {
		window.location.reload();
	}

	return (
		<section className="status-bar">
			<div className="status-item">
				<h3>Mines</h3>
				<p>not functional</p>
			</div>

			<button onClick={newGame} className="new-game" aria-label="New Game">New Game</button>

			<div className="status-item">
				<h3>Time</h3>
				<p>not functional</p>
			</div>
		</section>
	);
}

function Cell(cell: CellInterface) {
	function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		event.preventDefault();

		cell.moveX(cell.cellIdx);
		cell.moveY(cell.rowIdx);
		cell.moveType(event.button);
		cell.moveTimestamp(Date.now());
	}

	if(!cell.opened) {
		return (
			<div onClick={handleClick} onContextMenu={handleClick} className="game-cell"></div>
		);
	}

	if(cell.opened) {
		if(cell.type === "X") {
			return (
				<div onClick={handleClick} onContextMenu={handleClick} className="game-cell mine"><i className="fa-solid fa-bomb"></i></div>
			);
		}

		return (
			<div onClick={handleClick} onContextMenu={handleClick} className="game-cell number">{cell.type}</div>
		);
	}

	if(cell.flag) {
		return (
			<div className="game-cell"><i className="fa-solid fa-flag"></i></div>
		);
	}
}

function GameBoard(game: gameBoardInterface) {
	const [moveX, setMoveX] = useState(-1);
	const [moveY, setMoveY] = useState(-1);
	const [moveType, setMoveType] = useState(-1);
	const [moveTimestamp, setMoveTimestamp] = useState(0);

	useEffect(() => {
		game.moveX(moveX);
		game.moveY(moveY);
		game.moveType(moveType);
		game.moveTimestamp(moveTimestamp);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moveX, moveY, moveType, moveTimestamp]);

	return (
		<section className="game-board">
			{game.board.map((row, rowIdx) => (
				<div className="game-row" key={rowIdx}>
					{row.map((cell, cellIdx) => (
						<Cell
							moveTimestamp={setMoveTimestamp}
							moveX={setMoveX}
							moveY={setMoveY}
							moveType={setMoveType}
							rowIdx={rowIdx}
							cellIdx={cellIdx}
							key={cellIdx}
							type={cell.type}
							flag={cell.flag ? true : false}
							opened={cell.opened}
						/>
					))}
				</div>
			))}
		</section>
	);
}

function GamePage() {
	const { difficulty } = useParams();
	const [boardData, setBoardData] = useState<GameArray>([]);
	const [sizeX, setSizeX] = useState(0);
	const [sizeY, setSizeY] = useState(0);
	const [showMines, setShowMines] = useState(false);
	const [moveX, setMoveX] = useState(-1);
	const [moveY, setMoveY] = useState(-1);
	const [moveType, setMoveType] = useState(-1);
	const [moveTimestamp, setMoveTimestamp] = useState(-1);

	const gameInitX = [8, 8, 12];
	const gameInitY = [8, 12, 12];
	const gameInitMines = [12, 24, 32];
	
	let diff = 0;
	if(difficulty)
		diff = parseInt(difficulty);

	const game = new Minesweeper(gameInitX[diff], gameInitY[diff], gameInitMines[diff]);

	useEffect(() => {
		game.initBoard();

		setBoardData(game.board);
		setSizeX(game.sizeX);
		setSizeY(game.sizeY);
		setShowMines(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if(moveX !== -1 && moveY !== -1 && moveType !== -1 && moveTimestamp !== -1) {
			console.log(`X:${moveX} Y:${moveY} T:${moveType}`);

			game.openCell(moveY, moveX);
			setBoardData(game.board);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moveX, moveY, moveType, moveTimestamp]);

	return (
		<>
			<AppHeader homeBtn={true}/>
			<main className="game-container">
				<StatusBar/>
				<GameBoard
					moveTimestamp={setMoveTimestamp}
					moveX={setMoveX}
					moveY={setMoveY}
					moveType={setMoveType}
					board={boardData}
					sizeX={sizeX}
					sizeY={sizeY}
					showMines={showMines}
				/>
			</main>
			<div></div>
		</>
	);
}

export default GamePage;