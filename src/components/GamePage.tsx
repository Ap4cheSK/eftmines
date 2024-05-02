import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Minesweeper from "./Minesweeper";
import AppHeader from "./AppHeader";

interface gameBoardInterface {
	board: string[][];
	sizeX: number;
	sizeY: number;
	showMines: boolean;
}

interface SquareInterface {
	isMine: boolean;
	flag: boolean;
	show: boolean;
	minesNear: number;
}

function StatusBar() {
	function redirect() {
		window.location.reload();
	}

	return (
		<section className="status-bar">
			<div className="status-item">
				<h3>Mines</h3>
				<p>0</p>
			</div>

			<button onClick={redirect} className="new-game" aria-label="New Game">New Game</button>

			<div className="status-item">
				<h3>Time</h3>
				<p>0</p>
			</div>
		</section>
	);
}

function Cell(cell: SquareInterface) {
	if(!cell.show) {
		return (
			<div className="game-cell"></div>
		);
	}

	if(cell.show) {
		if(cell.isMine) {
			return (
				<div className="game-cell mine"><i className="fa-solid fa-bomb"></i></div>
			);
		}

		if(cell.minesNear === 0) {
			return (
				<div className="game-cell number"></div>
			);
		}

		return (
			<div className="game-cell number">{cell.minesNear}</div>
		);
	}

	if(cell.flag) {
		return (
			<div className="game-cell"><i className="fa-solid fa-flag"></i></div>
		);
	}
}

function GameBoard(game: gameBoardInterface) {
	return (
		<section className="game-board">
			{game.board.map((row, rowIdx) => (
				<div className="game-row" key={rowIdx}>
					{row.map((cell, cellIdx) => (
						<Cell
							key={cellIdx}
							isMine={cell === "X" ? true : false}
							flag={cell === "F" ? true : false}
							show={false}
							minesNear={isNaN(parseInt(cell)) ? 0 : parseInt(cell)}
						/>
					))}
				</div>
			))}
		</section>
	);
}

function GamePage() {
	const { difficulty } = useParams();
	const [boardData, setBoardData] = useState<string[][]>([]);
	const [sizeX, setSizeX] = useState(0);
	const [sizeY, setSizeY] = useState(0);
	const [showMines, setShowMines] = useState(false);

	useEffect(() => {
		const gameInitX = [8, 8, 12];
		const gameInitY = [8, 12, 12];
		const gameInitMines = [16, 24, 32];
		let diff = 0;

		if(difficulty)
			diff = parseInt(difficulty);

		const game = new Minesweeper(gameInitX[diff], gameInitY[diff], gameInitMines[diff]);
		game.initBoard();

		setBoardData(game.board);
		setSizeX(game.sizeX);
		setSizeY(game.sizeY);
		setShowMines(false);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			<AppHeader homeBtn={true}/>
			<main className="game-container">
				<StatusBar/>
				<GameBoard board={boardData} sizeX={sizeX} sizeY={sizeY} showMines={showMines}/>
			</main>
			<div></div>
		</>
	);
}

export default GamePage;