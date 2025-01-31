import React, { useState, useRef, useEffect } from 'react';
import ConfettiComponent from './ConfettiComponent.tsx';
import TimeDisplay from './TimeDisplay.tsx';
import TimeInput from './TimeInput.tsx';
import ButtonContainer from './ButtonContainer.tsx';
import ModalComponent from './Modal.tsx';
import MouseCircle from './MouseCircle.tsx';

const Stopwatch = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdownMode, setCountdownMode] = useState(false);
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiOpacity, setConfettiOpacity] = useState(1);
  const intervalRef = useRef<number | null>(null);  // Explicit typing here

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const startStop = () => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);  // Clear interval using a valid number
    } else {
      const startTime = Date.now() - time;
      if (countdownMode) {
        const totalTime = (Number(hours) * 3600000) + (Number(minutes) * 60000) + (Number(seconds) * 1000);
        intervalRef.current = window.setInterval(() => {  // Assign interval ID to ref
          setTime((prev) => {
            if (prev <= 0) {
              if (intervalRef.current) clearInterval(intervalRef.current);
              triggerConfetti(); // Trigger confetti when countdown ends
              return 0;
            }
            return prev - 10;
          });
        }, 10);
        setTime(totalTime);
      } else {
        intervalRef.current = window.setInterval(() => {  // Assign interval ID to ref
          setTime(Date.now() - startTime);
        }, 10);
      }
    }
    setIsRunning(!isRunning);
  };

  const reset = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);  // Clear interval using a valid number
    setTime(0);
    setIsRunning(false);
  };

  const triggerConfetti = () => {
    setShowConfetti(true);
    setConfettiOpacity(1);
    setTimeout(() => {
      const fadeInterval = setInterval(() => {
        setConfettiOpacity((prev) => {
          if (prev <= 0) {
            clearInterval(fadeInterval);
            setShowConfetti(false);
            return 0;
          }
          return prev - 0.05;
        });
      }, 100);
    }, 5000);
  };

  return (
    <div style={styles.container}>
      <style>{`
        html, body {
          margin: 0;
          padding: 0;
          height: 100%;
        }
      `}</style>
      {showConfetti && <ConfettiComponent opacity={confettiOpacity} />}
      <TimeDisplay time={time} />
      {countdownMode && (
        <TimeInput
          hours={hours}
          minutes={minutes}
          seconds={seconds}
          setHours={setHours}
          setMinutes={setMinutes}
          setSeconds={setSeconds}
        />
      )}
      <ButtonContainer
        isRunning={isRunning}
        countdownMode={countdownMode}
        startStop={startStop}
        reset={reset}
        setCountdownMode={setCountdownMode}
      />
      <ModalComponent />
      <MouseCircle />
    </div>
  );
  
};

const styles = {
  container: {
    display: 'flex' as 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center' as 'center',
    justifyContent: 'center' as 'center',
    backgroundColor: '#0f172a',
    height: '100vh',
    width: '100vw',
  },
};

export default Stopwatch;
