type GameArray = {
	type: string;
	opened: boolean;
	flag: boolean;
}[][];

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
	status: string;
	flags: number
	board: GameArray = [];

	constructor(sizeX: number, sizeY: number, mines: number, flagCount: number) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.mines = mines;
		this.flags = flagCount;
		this.status = "playing";

		for(let row = 0; row < this.sizeY; row++) {
			this.board[row] = [];
			for(let column = 0; column < this.sizeX; column++) {
				this.board[row][column] = {
					type: "0",
					opened: false,
					flag: false
				}
			}
		}
	}

	/**
	 * Method to generate random position
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	generateRandomPos(max: number) {
		// Generates from 0 (inclusive) to max (exclusive)
		return Math.floor(Math.random() * max);
	}

	/**
	 * Method to generate mines for gameboard.
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	generateMines() {
		let minesGenerated = 0;

		while(minesGenerated < this.mines) {
			const genPosX = this.generateRandomPos(this.sizeX);
			const genPosY = this.generateRandomPos(this.sizeY);

			if(this.board[genPosY][genPosX].type === "X")
				continue; // If mine already present at position

			this.board[genPosY][genPosX].type = "X";
			minesGenerated++;
		}
	}

	/**
	 * Method to generate appropriate symbol for cell (nearby mines count, flag, ...)
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	generateIndicator(posY: number, posX: number) {
		if(this.board[posY][posX].type === "X") {
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
				if(this.board[row][column].type === "X")
					minesNearby++;
			}
		}

		return minesNearby.toString();
	}

	/**
	 * Method to generate indicators (symbols) for cells in whole gameboard
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	generateMineIndicators() {
		for(let row = 0; row < this.sizeY; row++) {
			for(let column = 0; column < this.sizeX; column++) {
				this.board[row][column].type = this.generateIndicator(row, column);
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
	 * Method to load board externally
	 * Usually used when external wrapper app resets/deletes instance of this class 
	 * automatically after refresh, for example React.
	 */
	loadBoard(loadedBoard: GameArray) {
		this.board = [...loadedBoard];
		console.log(this.board);
	}

	/**
	 * [DEBUG] Prints game board, meant to debug behaviours of the game logic
	 */
	printBoard() {
		console.log("Game Board:")
		for(let row = 0; row < this.sizeY; row++) {
			let rowString = "";

			for(let column = 0; column < this.sizeX; column++) {
				rowString = rowString + this.board[row][column].type + " ";
			}

			console.log(rowString);
		}
	}

	/**
	 * Method that opens nearby cells
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	openNearbyEmptyCells(posY: number, posX: number) {
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

		for(let row = startY; row <= endY; row++) {
			for(let column = startX; column <= endX; column++) {
				if(!this.board[row][column].opened) {
					this.openCell(row, column);
				}
			}
		}
	}

	/**
	 * Method that counts neighboring flagged cells (8 cells around)
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	countFlags(posY: number, posX: number) {
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

		let flagsNearby = 0;

		for(let row = startY; row <= endY; row++) {
			for(let column = startX; column <= endX; column++) {
				if(this.board[row][column].flag) {
					flagsNearby++;
				}
			}
		}

		return flagsNearby;
	}

	/**
	 * Method that opens all neighboring cells by ignoring flagged ones. Doesnt prevent losing game!
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	openNearbyCellsByFlags(posY: number, posX: number) {
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

		for(let row = startY; row <= endY; row++) {
			for(let column = startX; column <= endX; column++) {
				if(!this.board[row][column].flag && !this.board[row][column].opened) {
					this.openCell(row, column);
				}
			}
		}
	}

	/**
	 * Method to set game as lost
	 * sets game status and opens whole gameboard so user can see all cells
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	setGameOver() {
		this.status = "lost";

		for(let row = 0; row < this.sizeY; row++) {
			for(let column = 0; column < this.sizeX; column++) {
				this.board[row][column].opened = true;
				this.board[row][column].flag = false;
			}
		}
	}

	/**
	 * Method to check if game was won
	 * if yes, sets game status and opens whole gameboard so user can see all cells
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	checkWin() {
		let isWon = true;

		for(let row = 0; row < this.sizeY; row++) {
			for(let column = 0; column < this.sizeX; column++) {
				if(this.board[row][column].type !== "X" && !this.board[row][column].opened) {
					isWon = false;
					return;
				}
			}
		}

		if(isWon)
			this.status = "won";
	}

	/**
	 * Method to open cell, cell open is blocked if cell is flagged
	 * If opened cell is blank, the method auto-opens all neighboring cells recursively
	 * Method is also responsible for game-over checking
	 * Method is also responsible for game-won checking
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	openCell(posY: number, posX: number) {
		if(this.board[posY][posX].flag)
			return;

		if(this.board[posY][posX].opened === false) {
			this.board[posY][posX].opened = true;

			if(this.board[posY][posX].type === "X") {
				// opened mine, game over.
				this.setGameOver();
				return;
			}

			if(this.board[posY][posX].type === "0")
				this.openNearbyEmptyCells(posY, posX);

			this.checkWin();
			return;
		}

		if(this.board[posY][posX].opened) {
			if(parseInt(this.board[posY][posX].type) === this.countFlags(posY, posX))
				this.openNearbyCellsByFlags(posY, posX);
		}

		this.checkWin();
	}

	/**
	 * Method to flag/unflag cell by right clicking it
	 * Flag will not be placed if count of mines is already flagged.
	 */
	flagCell(posY: number, posX: number) {
		if(this.board[posY][posX].opened)
			return;

		if(this.board[posY][posX].flag) {
			this.board[posY][posX].flag = false;
			this.flags--;
		} else {
			if(this.flags >= this.mines)
				return;

			this.board[posY][posX].flag = true;
			this.flags++;
		}
	}
}

export default Minesweeper;