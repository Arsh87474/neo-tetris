import styles from './ScoreDisplay.module.css'

export default function ScoreDisplay({ score }) {
  return (
    <div className={styles.scoreDisplay}>
      <h2>Score</h2>
      <p>{score}</p>
    </div>
  )
}

