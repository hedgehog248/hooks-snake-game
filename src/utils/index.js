const getFoodPosition = (fieldSize) => {
  // fieldSizeの一番外側から1マス内側でランダムな座標を取得
  const x = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
  const y = Math.floor(Math.random() * (fieldSize - 1 - 1)) + 1;
  return { x, y };
}

export const initFields = (fieldSize, initialPosition) => {
  const fields = []
  for (let i = 0; i < fieldSize; i++) {
    const cols = new Array(fieldSize).fill('')
    fields.push(cols)
  }
  fields[initialPosition.y][initialPosition.x] = 'snake';

  const food = getFoodPosition(fieldSize);
  fields[food.y][food.x] = 'food';

  return fields // 作成した配列を返却
}
