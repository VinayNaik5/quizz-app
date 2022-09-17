import './App.css';
import Questions from './components/Questions';
import Result from './components/Result';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import { useState } from 'react';
import { ScoreContext } from './context/Contexts';

function App() {
  const [score, setScore] = useState(0);
  return (
    <div className="App">
      <ScoreContext.Provider value={{score,setScore}}>
        <Router>
          <Routes>
            <Route exact path='/' element={<Questions/>}/>
            <Route path='/Result' element={<Result/>}/>
          </Routes>
        </Router>
      </ScoreContext.Provider>
    </div>
  );
}

export default App;
