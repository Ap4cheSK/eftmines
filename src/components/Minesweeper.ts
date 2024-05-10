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
 * @param {number} flagCount - Numbers of currently placed flags (0 when first creating)
 * @param {boolean} firstMove - Identificator if first move is being used
 */
class Minesweeper {
	sizeX: number;
	sizeY: number;
	mines: number;
	status: string;
	flags: number;
	firstMove: boolean;
	board: GameArray = [];

	constructor(sizeX: number, sizeY: number, mines: number, flagCount: number, firstMove: boolean) {
		this.sizeX = sizeX;
		this.sizeY = sizeY;
		this.mines = mines;
		this.flags = flagCount;
		this.status = "playing";
		this.firstMove = firstMove;

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
	generateMines(startMineCount: number) {
		let minesGenerated = 0;

		if(startMineCount)
			minesGenerated = startMineCount;

		while(minesGenerated < this.mines) {
			const genPosX = this.generateRandomPos(this.sizeX);
			const genPosY = this.generateRandomPos(this.sizeY);

			if(this.board[genPosY][genPosX].type === "X")
				continue; // If mine already present at position

			if(this.board[genPosY][genPosX].opened)
				continue; // If moving mine after hitting in for first time, dont put mine again in open cell

			this.board[genPosY][genPosX].type = "X";
			minesGenerated++;
		}
	}

	/**
	 * Method to generate appropriate symbol for cell (nearby mines count, flag, ...)
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	generateIndicator(posY: number, posX: number) {
		if(this.board[posY][posX].type === "X")
			return "X";

		const startY = Math.max(posY - 1, 0);
		const startX = Math.max(posX - 1, 0);
		const endY = Math.min(posY + 1, this.sizeY - 1);
		const endX = Math.min(posX + 1, this.sizeX - 1);

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
		this.generateMines(0);
		this.generateMineIndicators();
	}

	/**
	 * Method to load board externally
	 * Usually used when external wrapper app resets/deletes instance of this class 
	 * automatically after refresh, for example React.
	 */
	loadBoard(loadedBoard: GameArray) {
		this.board = [...loadedBoard];
	}

	/**
	 * Method that opens nearby cells
	 * @private [INTERNAL] => should not be used out of this file/module
	 */
	openNearbyEmptyCells(posY: number, posX: number) {
		const startY = Math.max(posY - 1, 0);
		const startX = Math.max(posX - 1, 0);
		const endY = Math.min(posY + 1, this.sizeY - 1);
		const endX = Math.min(posX + 1, this.sizeX - 1);

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
		const startY = Math.max(posY - 1, 0);
		const startX = Math.max(posX - 1, 0);
		const endY = Math.min(posY + 1, this.sizeY - 1);
		const endX = Math.min(posX + 1, this.sizeX - 1);

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
		const startY = Math.max(posY - 1, 0);
		const startX = Math.max(posX - 1, 0);
		const endY = Math.min(posY + 1, this.sizeY - 1);
		const endX = Math.min(posX + 1, this.sizeX - 1);

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
	 * Method is also responsible for game-lost and game-won checking
	 * Method is also responsible for preventing of first-move-mine-hit
	 * @param {number} posY - Y index of game position
	 * @param {number} posX - X index of game position
	 */
	openCell(posY: number, posX: number) {
		if(this.board[posY][posX].flag)
			return;

		if(!this.board[posY][posX].opened) {
			if(this.board[posY][posX].type === "X") {
				if(!this.firstMove) {
					this.setGameOver();
					return;
				}

				this.board[posY][posX].type = "0";
				this.board[posY][posX].opened = true;

				this.generateMines(this.mines - 1);
				this.generateMineIndicators();

				return;
			}

			this.board[posY][posX].opened = true;

			if(this.board[posY][posX].type === "0")
				this.openNearbyEmptyCells(posY, posX);

			this.checkWin();
			return;
		}

		if(parseInt(this.board[posY][posX].type) === this.countFlags(posY, posX))
			this.openNearbyCellsByFlags(posY, posX);
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