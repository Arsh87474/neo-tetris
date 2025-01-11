import styles from './GameBoard.module.css'

const CELL_SIZE = 25 // Reduced from 30 to 25

export default function GameBoard({ board, currentPiece }) {
  const renderCell = (value, rowIndex, colIndex) => {
    let cellContent = value
    if (
      currentPiece &&
      rowIndex >= currentPiece.y &&
      rowIndex < currentPiece.y + currentPiece.shape.length &&
      colIndex >= currentPiece.x &&
      colIndex < currentPiece.x + currentPiece.shape[0].length
    ) {
      const pieceRow = rowIndex - currentPiece.y
      const pieceCol = colIndex - currentPiece.x
      if (currentPiece.shape[pieceRow][pieceCol]) {
        cellContent = currentPiece.color
      }
    }

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={`${styles.cell} ${cellContent ? styles[`color${cellContent}`] : styles.empty}`}
        style={{ width: CELL_SIZE, height: CELL_SIZE }}
      />
    )
  }

  return (
    <div className={styles.gameBoard}>
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className={styles.row}>
          {row.map((cell, colIndex) => renderCell(cell, rowIndex, colIndex))}
        </div>
      ))}
    </div>
  )
}

