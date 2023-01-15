import React from "react";

const Button = ({ status, onStart, onStop, onRestart }) => {
  return (
    <div className="button">
      {/* 
        statusによってボタンの表示を切り替える
        &&の前の条件式がtrueのときだけ後ろの処理が実行される
       */}
      {status === 'gameover' && <button onClick={onRestart}>gameover</button>}
      {status === 'init' && <button onClick={onStart}>start</button>}
      {status === 'suspended' && <button onClick={onStart}>start</button>}
      {status === 'playing' && <button onClick={onStop}>stop</button>}
    </div>
  );
};

export default Button;
