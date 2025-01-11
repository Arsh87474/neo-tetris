import styles from './ControlButtons.module.css'

interface ControlButtonsProps {
  onStart: () => void
  onStop: () => void
  isPlaying: boolean
}

export default function ControlButtons({ onStart, onStop, isPlaying }: ControlButtonsProps) {
  return (
    <div className={styles.controlButtons}>
      <button
        className={`${styles.button} ${styles.startButton}`}
        onClick={onStart}
        disabled={isPlaying}
      >
        Start
      </button>
      <button
        className={`${styles.button} ${styles.stopButton}`}
        onClick={onStop}
        disabled={!isPlaying}
      >
        Stop
      </button>
    </div>
  )
}

