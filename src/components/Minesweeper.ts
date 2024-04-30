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
			for(let column = 0; column < this.sizeX; column++) {
				this.board[row][column] = " ";
			}
		}
	}

	generateRandomPos(max: number) {
		// Generates from 0 (inclusive) to max (exclusive)
		return Math.floor(Math.random() * max);
	}

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

	generateIndicator(posY: number, posX: number) {
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

		for(let row = startY; row < endY; row++) {
			for(let column = startX; column < endX; column++) {
				if(this.board[row][column] === "X")
					minesNearby++;
			}
		}

		if(minesNearby === 0)
			return " ";

		return minesNearby.toString();
	}

	generateMineIndicators() {
		for(let row = 0; row < this.sizeY; row++) {
			for(let column = 0; column < this.sizeX; column++) {
				if(this.board[row][column] === "X")
					continue;

				this.board[row][column] = this.generateIndicator(row, column);
			}
		}
	}
}