import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// Game Logic
import Minesweeper from "./Minesweeper";
// App Components
import AppHeader from "./AppHeader";
// Game Components
import GameBoard from "./GameComponents/GameBoard";
import StatusBar from "./GameComponents/StatusBar";

type GameArray = {
	type: string;
	opened: boolean;
	flag: boolean;
}[][];

function GamePage() {
	const { difficulty } = useParams();
	const [boardData, setBoardData] = useState<GameArray>([]);
	const [sizeX, setSizeX] = useState(0);
	const [sizeY, setSizeY] = useState(0);
	const [gameStatus, setGameStatus] = useState("playing");
	const [minesCount, setMinesCount] = useState(0);
	const [firstMove, setFirstMove] = useState(false);
	const [moveX, setMoveX] = useState(-1);
	const [moveY, setMoveY] = useState(-1);
	const [moveType, setMoveType] = useState(-1);
	const [moveTimestamp, setMoveTimestamp] = useState(-1);

	const gameInitX = [8, 8, 12];
	const gameInitY = [8, 12, 12];
	const gameInitMines = [12, 20, 40];

	useEffect(() => {
		let diff = 0;
		if(difficulty)
			diff = parseInt(difficulty);

		const game = new Minesweeper(gameInitX[diff], gameInitY[diff], gameInitMines[diff], 0, firstMove);

		game.initBoard();

		setFirstMove(true);
		setBoardData(game.board);
		setSizeX(game.sizeX);
		setSizeY(game.sizeY);
		setGameStatus("playing");
		setMinesCount(game.mines - game.flags);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Player's move handling
	useEffect(() => {
		if(gameStatus !== "playing")
			return;

		if(moveX !== -1 && moveY !== -1 && moveType !== -1 && moveTimestamp !== -1) {
			let diff = 0;
			if(difficulty)
				diff = parseInt(difficulty);

			const flagCount = gameInitMines[diff] - minesCount;

			const game = new Minesweeper(gameInitX[diff], gameInitY[diff], gameInitMines[diff], flagCount, firstMove);
			
			game.loadBoard(boardData);

			if(moveType == 0) {
				// Left Mouse Button
				game.openCell(moveY, moveX);
			} else {
				// Right Mouse Button
				game.flagCell(moveY, moveX);
			}

			setBoardData(game.board);
			setGameStatus(game.status);
			setMinesCount(game.mines - game.flags);

			if(firstMove)
				setFirstMove(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [moveX, moveY, moveType, moveTimestamp]);

	return (
		<>
			<AppHeader homeBtn={true}/>
			<main className="game-container">
				<StatusBar minesCount={minesCount} gameStatus={gameStatus}/>
				<GameBoard
					moveTimestamp={setMoveTimestamp}
					moveX={setMoveX}
					moveY={setMoveY}
					moveType={setMoveType}
					board={boardData}
					sizeX={sizeX}
					sizeY={sizeY}
				/>
			</main>
			<div></div>
		</>
	);
}

export default GamePage;