import React, { useEffect, useState } from 'react';
import Navigation from './components/Navigation';
import Field from './components/Field';
import Button from './components/Button';
import ManipulationPanel from './components/ManipulationPanel';
import { initFields } from './utils';

const initialPosition = { x: 17, y: 17 }
const initialValues = initFields(35, initialPosition)

function App() {
  const [fields, setFields] = useState(initialValues);
  const [position, setPosition] = useState();

  useEffect(() => {
    setPosition(initialPosition)
  }, [])

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
      <div style={{ padding: '16px' }}>
        <button onClick={goUp}>進む</button>
      </div>
      <footer className='footer'>
        <Button />
        <ManipulationPanel />
      </footer>
    </div>
  );
}

export default App;
