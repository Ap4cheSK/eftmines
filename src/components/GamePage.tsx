import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// App Components
import AppHeader from "./AppHeader";
// Game Logic
import Minesweeper from "./Minesweeper";
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

	const [time, setTime] = useState(0);

	const gameDiff = [
		// X, Y, mines
		[8, 8, 12],
		[8, 12, 20],
		[12, 12, 40],
	];

	useEffect(() => {
		let diff = 0;
		if(difficulty)
			diff = parseInt(difficulty);

		const game = new Minesweeper(gameDiff[diff][0], gameDiff[diff][1], gameDiff[diff][2], 0, firstMove);

		game.initBoard();

		setFirstMove(true);
		setBoardData(game.board);
		setSizeX(game.sizeX);
		setSizeY(game.sizeY);
		setGameStatus("waiting");
		setMinesCount(game.mines - game.flags);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Player's move handling
	useEffect(() => {
		if(gameStatus !== "playing" && gameStatus !== "waiting")
			return;

		if(moveX !== -1 && moveY !== -1 && moveType !== -1 && moveTimestamp !== -1) {
			let diff = 0;
			if(difficulty)
				diff = parseInt(difficulty);

			const flagCount = gameDiff[diff][2] - minesCount;

			const game = new Minesweeper(gameDiff[diff][0], gameDiff[diff][1], gameDiff[diff][2], flagCount, firstMove);
			
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

	// Game timer
	useEffect(() => {
		if(gameStatus !== "playing")
			return;

		const timer = setInterval(() => setTime(time + 1), 1000);
		return () => clearInterval(timer);
	}, [gameStatus, time]);

	return (
		<>
			<AppHeader homeBtn={true}/>
			<main className="game-container">
				<StatusBar minesCount={minesCount} gameStatus={gameStatus} timer={time}/>
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