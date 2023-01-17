import { useCallback, useEffect, useState } from 'react';
import {
  defaultInterval,
  defaultDifficulty,
  Delta,
  Difficulty,
  Direction,
  DirectionKeyCodeMap,
  GameStatus,
  OppositeDirection,
  initialPosition,
  initialValues
} from '../constants';
import {
  initFields,
  isCollision,
  isEatingMyself,
  getFoodPosition
} from '../utils';

let timer = undefined;

// タイマーを止める関数
const unsubscribe = () => {
  if (!timer) {
    return;
  };
  // clearIntervalでタイマーを削除する
  clearInterval(timer);
}

const useSnakeGame = () => {
  const [fields, setFields] = useState(initialValues);
  const [body, setBody] = useState([]);
  const [status, setStatus] = useState(GameStatus.init);
  const [direction, setDirection] = useState(Direction.up);
  const [difficulty, setDifficulty] = useState(defaultDifficulty);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setBody([initialPosition]);

    // ゲームの中の時間を管理する
    const interval = Difficulty[difficulty - 1];
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, interval);
    return unsubscribe;
  }, [difficulty]);

  useEffect(() => {
    // positionがnullまたはstatusがplaying以外のときは早期returnを返す
    if (body.length === 0 || status !== GameStatus.playing) {
      return;
    };
    // 以下ゲーム続行可能の処理
    const canContinue = handleMoving();
    // canContinueがfalseのときの処理
    if (!canContinue) {
      unsubscribe();
      setStatus(GameStatus.gameover);
    };
  }, [tick]);

  const start = () => setStatus(GameStatus.playing);

  const stop = () => setStatus(GameStatus.suspended);

  const reload = () => {
    timer = setInterval(() => {
      setTick(tick => tick + 1)
    }, defaultInterval);
    setStatus(GameStatus.init);
    setBody([initialPosition]);
    setDirection(Direction.up);
    setFields(initFields(fields.length, initialPosition));
  }

  // 進行方向を変える
  const updateDirection = useCallback(
    (newDirection) => {
      // ゲームプレイ中かどうか
      if (status !== GameStatus.playing) {
        return;
      };
      // 進行方向と真逆の向きかどうか
      if (OppositeDirection[direction] === newDirection) {
        return;
      };
      setDirection(newDirection);
    },
    [direction, status]
  );

  // 難易度を更新する
  const updateDifficulty = useCallback(
    (difficulty) => {
      if (status !== GameStatus.init) {
        return;
      }
      if (difficulty < 1 || difficulty > Difficulty.length) {
        return;
      }
      setDifficulty(difficulty);
    }, [status]
  );

  // キーボードが押されたときの処理
  useEffect(() => {
    const handleKeyDown = (e) => {
      const newDirection = DirectionKeyCodeMap[e.keyCode];
      if (!newDirection) {
        return;
      };
      updateDirection(newDirection);
    };
    document.addEventListener('keydown', handleKeyDown);
    // イベントをクリーンにする関数をreturnで渡す（このクリーン関数はuseEffectが再実行される際に実行される）
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [updateDirection]);

  const handleMoving = () => {
    const { x, y } = body[0]
    const delta = Delta[direction];
    const newPosition = {
      x: x + delta.x,
      y: y + delta.y
    };
    if (
      isCollision(fields.length, newPosition) ||
      isEatingMyself(fields, newPosition)
    ) {
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
  };

  return {
    body,
    difficulty,
    fields,
    status,
    start,
    stop,
    reload,
    updateDirection,
    updateDifficulty,
  };
};

export default useSnakeGame;
