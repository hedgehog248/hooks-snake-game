import React from "react";

const Button = ({ status, onStart, onStop, onRestart }) => {
  return (
    <div className="button">
      {/* 
        statusによってボタンの表示を切り替える
        &&の前の条件式がtrueのときだけ後ろの処理が実行される
       */}
      {status === 'gameover' && <button className="btn btn-gameover" onClick={onRestart}>gameover</button>}
      {status === 'init' && <button className="btn btn-init" onClick={onStart}>start</button>}
      {status === 'suspended' && <button className="btn btn-suspended" onClick={onStart}>start</button>}
      {status === 'playing' && <button className="btn btn-playing" onClick={onStop}>stop</button>}
    </div>
  );
};

export default Button;
