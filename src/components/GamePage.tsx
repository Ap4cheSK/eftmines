import { useEffect } from "react";
import Minesweeper from "./Minesweeper";
import AppHeader from "./AppHeader";

function GamePage() {
	useEffect(() => {
		const game = new Minesweeper(5,5,5);
		game.initBoard();
		game.printBoard();
	}, []);


	return (
		<>
			<AppHeader homeBtn={true}/>
			<main className="game-container">

			</main>
			<div></div>
		</>
	);
}

export default GamePage;