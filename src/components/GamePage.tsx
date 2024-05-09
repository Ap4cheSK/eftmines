import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Game Logic
import Minesweeper from "./Minesweeper";
// App Components
import AppHeader from "./AppHeader";
// Game Components
import GameBoard from "./GameComponents/GameBoard";

type GameArray = {
	type: string;
	opened: boolean;
	flag: boolean;
}[][];

function StatusBar() {
	function newGame() {
		window.location.reload();
	}

	return (
		<section className="status-bar">
			<div className="status-item">
				<h3>Mines</h3>
				{/* <p>not functional</p> */}
			</div>

			<button onClick={newGame} className="new-game" aria-label="New Game">New Game</button>

			<div className="status-item">
				<h3>Time</h3>
				{/* <p>not functional</p> */}
			</div>
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

	useEffect(() => {		
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

	useEffect(() => {
		if(moveX !== -1 && moveY !== -1 && moveType !== -1 && moveTimestamp !== -1) {
			console.log(`X:${moveX} Y:${moveY} T:${moveType}`);

			let diff = 0;
			if(difficulty)
				diff = parseInt(difficulty);

			const game = new Minesweeper(gameInitX[diff], gameInitY[diff], gameInitMines[diff]);
			
			game.loadBoard(boardData);

			if(moveType == 0) {
				// Left Mouse Button
				game.openCell(moveY, moveX);
			} else {
				// Right Mouse Button
				game.flagCell(moveY, moveX);
			}

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