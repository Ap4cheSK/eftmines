interface statusBarInterface {
	minesCount: number;
	timer: number;
	gameStatus: string;
}

function GameWon() {
	return (
		<div className="game-status game-won">
			<h3>You have won! Congratulations!</h3>
		</div>
	);
}

function GameLost() {
	return (
		<div className="game-status game-lost">
			<h3>You have lost! You can try again!</h3>
		</div>
	);
}

function StatusBar(status: statusBarInterface) {
	function newGame() {
		window.location.reload();
	}

	return (
		<section className="status-bar">
			<section className="game-info">
				<div className="status-item">
					<h3>Mines</h3>
					<p>{status.minesCount}</p>
				</div>

				<button onClick={newGame} className="new-game" aria-label="New Game">New Game</button>

				<div className="status-item">
					<h3>Time</h3>
					<p>{status.timer}</p>
				</div>
			</section>

			{status.gameStatus === "won" ? <GameWon/> : ""}
			{status.gameStatus === "lost" ? <GameLost/> : ""}
		</section>
	);
}

export default StatusBar;