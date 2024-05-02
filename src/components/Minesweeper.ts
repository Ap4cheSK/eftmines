/**
 * Minesweeper game logic.
 * @param {number} sizeX - Width of gameboard
 * @param {number} sizeY - Height of gameboard
 * @param {number} mines - Number of mines in gameboard
 */
class Minesweeper {
	sizeX: number;
	sizeY: number;
	mines: number;
	board: string[][] = [];

	constructor(sizeX: number, sizeY: number, mines: number) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.mines = mines;

		for(let row = 0; row < this.sizeY; row++) {
			this.board[row] = [];
			for(let column = 0; column < this.sizeX; column++) {
				this.board[row][column] = "_";
			}
		}
	}

	/**
	 * Minesweeper internal method
	 */
	generateRandomPos(max: number) {
		// Generates from 0 (inclusive) to max (exclusive)
		return Math.floor(Math.random() * max);
	}

	/**
	 * Minesweeper internal method
	 */
	generateMines() {
		let minesGenerated = 0;

		while(minesGenerated < this.mines) {
			const genPosX = this.generateRandomPos(this.sizeX);
			const genPosY = this.generateRandomPos(this.sizeY);

			if(this.board[genPosY][genPosX] === "X")
				continue; // If mine already present at position

			this.board[genPosY][genPosX] = "X";
			minesGenerated++;
		}
	}

	/**
	 * Minesweeper internal method
	 */
	generateIndicator(posY: number, posX: number) {
		if(this.board[posY][posX] === "X") {
			return "X";
		}

		let startY = posY - 1;
		let startX = posX - 1;
		let endY = posY + 1;
		let endX = posX + 1;

		if(startY < 0)
			startY = 0;

		if(startX < 0)
			startX = 0;

		if(endY >= this.sizeY)
			endY = this.sizeY - 1;

		if(endX >= this.sizeX)
			endX = this.sizeX - 1;

		let minesNearby = 0;

		for(let row = startY; row <= endY; row++) {
			for(let column = startX; column <= endX; column++) {
				if(this.board[row][column] === "X")
					minesNearby++;
			}
		}

		if(minesNearby === 0)
			return "_";

		return minesNearby.toString();
	}

	/**
	 * Minesweeper internal method
	 */
	generateMineIndicators() {
		for(let row = 0; row < this.sizeY; row++) {
			for(let column = 0; column < this.sizeX; column++) {
				this.board[row][column] = this.generateIndicator(row, column);
			}
		}
	}

	/**
	 * Method to initialize board. Generate mines, generate mine indicators (numbers)
	 */
	initBoard() {
		this.generateMines();
		this.generateMineIndicators();
	}

	/**
	 * [DEBUG] Prints game board, meant to debug behaviours of the game logic
	 */
	printBoard() {
		console.log("Game Board:")
		for(let row = 0; row < this.sizeY; row++) {
			let rowString = "";

			for(let column = 0; column < this.sizeX; column++) {
				rowString = rowString + this.board[row][column] + " ";
			}

			console.log(rowString);
		}
	}
}

export default Minesweeper;