import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields } from './utils';

const initialPosition = { x: 17, y: 17 };
const initialValues = initFields(35, initialPosition);
const defaultInterval = 100;

const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
});

let timer = undefined;

const unsubscribe = () => {
  if (!timer) {
    return
  };
  clearInterval(timer); // clearIntervalでタイマーを削除する
}

function App() {
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState();
  const [status, setStatus] = useState(GameStatus.init);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setPosition(initialPosition);
    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval);
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!position || status !== GameStatus.playing) {
      return
    };
    goUp();
  }, [tick]);

  const onStart = () => setStatus(GameStatus.playing);

  const goUp = () => {
    const { x, y } = position
    const nextY = Math.max(y - 1, 0)
    fields[y][x] = ''
    fields[nextY][x] = 'snake'
    setPosition({ x, y: nextY })
    setFields(fields)
  }

  return (
    <div className="App">
      <header className='header'>
        <div className='title-container'>
          <h1 className='title'>Snake Game</h1>
        </div>
        <Navigation />
      </header>

      <main className='main'>
        <Field fields={fields} /> {/* 後ほどuseStateで定義する */}
      </main>
      <footer className='footer'>
        <Button onStart={onStart} />
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
