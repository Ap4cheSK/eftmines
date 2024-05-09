import { useEffect, useState } from "react";
// Game Components
import Cell from "./Cell";

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
							setMoveX={setMoveX}
							setMoveY={setMoveY}
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

export default GameBoard;