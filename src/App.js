import React, { useCallback, useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields, getFoodPosition } from './utils';

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

// スネークの進行方向のステートを定義
const Direction = Object.freeze({
  up: 'up',
  right: 'right',
  left: 'left',
  down: 'down'
});

// キーコードのマップを定義
const DirectionKeyCodeMap = Object.freeze({
  37: Direction.left,
  38: Direction.up,
  39: Direction.right,
  40: Direction.down,
});

// 進行方向と真逆の方向を定義
const OppositeDirection = Object.freeze({
  up: 'down',
  right: 'left',
  left: 'right',
  down: 'up'
});

// 各進行方向における座標の変化量を定義
const Delta = Object.freeze({
  up: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  left: { x: -1, y: 0 },
  down: { x: 0, y: 1 },
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
  const [body, setBody] = useState([]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setBody([initialPosition]);
    // ゲームの中の時間を管理する
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval);
    return unsubscribe;
  }, []);

  useEffect(() => {
    // positionがnullまたはstatusがplaying以外のときは早期returnを返す
    if (body.length === 0 || status !== GameStatus.playing) {
      return
    };
    // 以下ゲーム続行可能の処理
    const canContinue = handleMoving();
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
    setBody([initialPosition]);
    setDirection(Direction.up);
    setFields(initFields(35, initialPosition))
  }

  // 進行方向を変える
  const onChangeDirection = useCallback(
    (newDirection) => {
      // ゲームプレイ中かどうか
      if (status !== GameStatus.playing) {
        return
      };
      // 進行方向と真逆の向きかどうか
      if (OppositeDirection[direction] === newDirection) {
        return
      };
      setDirection(newDirection);
    },
    [direction, status]
  );

  // キーボードが押されたときの処理
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      };
      onChangeDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    // イベントをクリーンにする関数をreturnで渡す（このクリーン関数はuseEffectが再実行される際に実行される）
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onChangeDirection]);

  const handleMoving = () => {
    const { x, y } = body[0]
    const delta = Delta[direction];
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y
    };
    if (isCollision(fields.length, newPosition)) {
      unsubscribe();
      return false;
    };

    // pop,unshift(破壊的メソッド)の前にスプレッド構文でステートをコピーしておく
    // useStateで得る更新関数以外で直接ステートの更新をしないようにするため
    const newBody = [...body];
    // 先頭がfoodかどうか
    if (fields[newPosition.y][newPosition.x] !== 'food') {
      // foodじゃないときはbodyを伸ばさない
      const removingTrack = newBody.pop();                 // 末尾の配列を取り出して削除する
      fields[removingTrack.y][removingTrack.x] = '';       // 削除された配列の座標に空文字をいれる
    } else {
      // foodのときは新しいfoodを作る
      const food = getFoodPosition(fields.length, [...newBody, newPosition]);
      fields[food.y][food.x] = 'food';
    }
    fields[newPosition.y][newPosition.x] = 'snake'; // snakeを一歩前へ伸ばす
    newBody.unshift(newPosition);                   // 配列の先頭に要素を追加する

    setBody(newBody); // コピーし編集した配列でステートを更新する
    setFields(fields);
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
        <ManipulationPanel onChange={onChangeDirection} />
      </footer>
    </div>
  );
}

export default App;
