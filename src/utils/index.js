export const getFoodPosition = (fieldSize, excludes) => {
  while (true) {
    // fieldSizeの一番外側から1マス内側でランダムな座標を取得
    const x = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    const y = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
    const conflict = excludes.some(item => item.x === x && item.y === y);

    if (!conflict) {
      return { x, y };
    }
  }
}

export const initFields = (fieldSize, snake) => {
  const fields = []
  for (let i = 0; i < fieldSize; i++) {
    const cols = new Array(fieldSize).fill('')
    fields.push(cols)
  }
  fields[snake.y][snake.x] = 'snake';

  const food = getFoodPosition(fieldSize, [snake]);
  fields[food.y][food.x] = 'food';

  return fields // 作成した配列を返却
}

// 壁にぶつかったかを判定
export const isCollision = (fieldSize, position) => {
  if (position.y < 0 || position.x < 0) {
    // x, yのどちらかの座標が−の値のとき
    return true;
  }
  if (position.y > fieldSize - 1 || position.x > fieldSize - 1) {
    // s, yのどちらかの座標がフィールドサイズを超えてしまっているとき
    return true;
  }
  return false;
};

// 自分を食べてしまった場合の処理
export const isEatingMyself = (fields, position) => {
  return fields[position.y][position.x] === 'snake';
}
