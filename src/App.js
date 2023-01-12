import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields } from './utils';

const initialPosition = { x: 17, y: 17 };
const initialValues = initFields(35, initialPosition);
const defaultInterval = 100;

// ステータスを定数で作っておき、一元管理する
const GameStatus = Object.freeze({
  init: 'init',
  playing: 'playing',
  suspended: 'suspended',
  gameover: 'gameover'
});

let timer = undefined;

// タイマーを止める関数
const unsubscribe = () => {
  if (!timer) {
    return
  };
  clearInterval(timer); // clearIntervalでタイマーを削除する
}

// 壁にぶつかったかの判定
const isCollision = (fieldSize, position) => {
  if (position.y < 0 || position.x < 0) {
    return true;
  }
  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    return true;
  }
  return false;
};

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
    // positionがnullまたはstatusがplaying以外のときは早期returnを返す
    if (!position || status !== GameStatus.playing) {
      return
    };
    // 以下ゲーム続行可能の処理
    const canContinue = goUp();
    // canContinueがfalseのときの処理
    if (!canContinue) {
      setStatus(GameStatus.gameover);
    };
  }, [tick]);

  const onStart = () => setStatus(GameStatus.playing);

  const onRestart = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval);
    setStatus(GameStatus.init);
    setPosition(initialPosition);
    setFields(initFields(35, initialPosition))
  }

  const goUp = () => {
    const { x, y } = position
    const newPosition = { x, y: y - 1 };
    if (isCollision(fields.length, newPosition)) {
      unsubscribe();
      return false;
    };
    fields[y][x] = ''
    fields[newPosition.y][x] = 'snake';
    setPosition(newPosition);
    setFields(fields)
    return true;
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
        <Button status={status} onStart={onStart} onRestart={onRestart} />
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
