interface CellInterface {
	flag: boolean;
	opened: boolean;
	type: string;
	rowIdx: number;
	cellIdx: number;
	setMoveX: React.Dispatch<React.SetStateAction<number>>
	setMoveY: React.Dispatch<React.SetStateAction<number>>
	moveType: React.Dispatch<React.SetStateAction<number>>
	moveTimestamp: React.Dispatch<React.SetStateAction<number>>
}

function Cell(cell: CellInterface) {
	function handleClick(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
		event.preventDefault(); // prevent opening context menu

		cell.setMoveX(cell.cellIdx);
		cell.setMoveY(cell.rowIdx);
		cell.moveType(event.button);
		cell.moveTimestamp(Date.now());
	}

	if(cell.flag) {
		return (
			<div onClick={handleClick} onContextMenu={handleClick} className="game-cell c-flag">
				<i className="fa-solid fa-flag"></i>
			</div>
		);
	}

	// Un-opened blank cover cell
	if(!cell.opened) {
		return (
			<div onClick={handleClick} onContextMenu={handleClick} className="game-cell">

			</div>
		);
	}

	if(cell.opened) {
		// Mine
		if(cell.type === "X") {
			return (
				<div onClick={handleClick} onContextMenu={handleClick} className="game-cell c-open">
					<i className="fa-solid fa-bomb"></i>
				</div>
			);
		}

		// Blank cell
		if(cell.type === "0") {
			return (
				<div onClick={handleClick} onContextMenu={handleClick} className="game-cell c-open">
					
				</div>
			);
		}

		// Number cell
		const numbers = ["c-one", "c-two", "c-three", "c-four", "c-five", "c-six", "c-seven", "c-eight"];

		return (
			<div
				onClick={handleClick}
				onContextMenu={handleClick}
				className={`game-cell c-open ${numbers[parseInt(cell.type)-1]}`}
			>
				{cell.type}
			</div>
		);
	}
}

export default Cell;