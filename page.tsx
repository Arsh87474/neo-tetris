'use client'

import { useState, useEffect, useCallback } from 'react'
import styles from './page.module.css'
import GameBoard from './components/GameBoard'
import ScoreDisplay from './components/ScoreDisplay'
import ControlButtons from './components/ControlButtons'

const BOARD_WIDTH = 10
const BOARD_HEIGHT = 12 

export default function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(null)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const moveDown = useCallback(() => {
    if (!currentPiece) return
    const newY = currentPiece.y + 1
    if (isValidMove(currentPiece.shape, currentPiece.x, newY)) {
      setCurrentPiece({ ...currentPiece, y: newY })
    } else {
      placePiece()
    }
  }, [currentPiece])

  useEffect(() => {
    if (!isPlaying || gameOver) return

    const gameLoop = setInterval(() => {
      moveDown()
    }, 1000)

    return () => clearInterval(gameLoop)
  }, [isPlaying, gameOver, moveDown])

  useEffect(() => {
    if (!currentPiece && !gameOver && isPlaying) {
      const newPiece = generateRandomPiece()
      if (isValidMove(newPiece.shape, newPiece.x, newPiece.y)) {
        setCurrentPiece(newPiece)
      } else {
        setGameOver(true)
        setIsPlaying(false)
      }
    }
  }, [currentPiece, gameOver, isPlaying])

  const placePiece = () => {
    if (!currentPiece) return
    const newBoard = [...board]
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          newBoard[y + currentPiece.y][x + currentPiece.x] = currentPiece.color
        }
      })
    })
    setBoard(newBoard)
    clearLines(newBoard)
    setCurrentPiece(null)
  }

  const clearLines = (board) => {
    let linesCleared = 0
    const newBoard = board.filter((row) => {
      if (row.every((cell) => cell !== 0)) {
        linesCleared++
        return false
      }
      return true
    })

    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0))
    }

    if (linesCleared > 0) {
      setScore((prevScore) => prevScore + linesCleared * 100)
      setBoard(newBoard)
    }
  }

  const isValidMove = (shape, x, y) => {
    return shape.every((row, dy) =>
      row.every((value, dx) => {
        if (!value) return true
        const newX = x + dx
        const newY = y + dy
        return (
          newX >= 0 &&
          newX < BOARD_WIDTH &&
          newY < BOARD_HEIGHT &&
          (newY < 0 || board[newY][newX] === 0)
        )
      })
    )
  }

  const movePiece = (dx) => {
    if (!currentPiece || !isPlaying) return
    const newX = currentPiece.x + dx
    if (isValidMove(currentPiece.shape, newX, currentPiece.y)) {
      setCurrentPiece({ ...currentPiece, x: newX })
    }
  }

  const rotatePiece = () => {
    if (!currentPiece || !isPlaying) return
    const rotatedShape = currentPiece.shape[0].map((_, index) =>
      currentPiece.shape.map((row) => row[index]).reverse()
    )
    if (isValidMove(rotatedShape, currentPiece.x, currentPiece.y)) {
      setCurrentPiece({ ...currentPiece, shape: rotatedShape })
    }
  }

  const handleKeyPress = useCallback(
    (e) => {
      if (gameOver || !isPlaying) return
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1)
          break
        case 'ArrowRight':
          movePiece(1)
          break
        case 'ArrowDown':
          moveDown()
          break
        case 'ArrowUp':
          rotatePiece()
          break
      }
    },
    [gameOver, isPlaying, moveDown]
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [handleKeyPress])

  const startGame = () => {
    setIsPlaying(true)
    setGameOver(false)
    setScore(0)
    setBoard(createEmptyBoard())
    setCurrentPiece(null)
  }

  const stopGame = () => {
    setIsPlaying(false)
    setGameOver(true)
  }

  return (
    <div className={styles.tetrisContainer}>
      <h1 className={styles.title}>Neo-Tetris</h1>
      <GameBoard board={board} currentPiece={currentPiece} />
      <ScoreDisplay score={score} />
      <ControlButtons onStart={startGame} onStop={stopGame} isPlaying={isPlaying} />
      {gameOver && <div className={styles.gameOver}>Game Over!</div>}
    </div>
  )
}

function createEmptyBoard() {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(0))
}

function generateRandomPiece() {
  const pieces = [
    { shape: [[1, 1, 1, 1]], color: 1 }, // I
    { shape: [[1, 1], [1, 1]], color: 2 }, // O
    { shape: [[1, 1, 1], [0, 1, 0]], color: 3 }, // T
    { shape: [[1, 1, 0], [0, 1, 1]], color: 4 }, // S
    { shape: [[0, 1, 1], [1, 1, 0]], color: 5 }, // Z
    { shape: [[1, 1, 1], [1, 0, 0]], color: 6 }, // L
    { shape: [[1, 1, 1], [0, 0, 1]], color: 7 }, // J
  ]
  const randomPiece = pieces[Math.floor(Math.random() * pieces.length)]
  return {
    ...randomPiece,
    x: Math.floor(BOARD_WIDTH / 2) - Math.floor(randomPiece.shape[0].length / 2),
    y: 0,
  }
}

