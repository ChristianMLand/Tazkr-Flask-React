import './App.css';
import {useReducer} from 'react';
import io from 'socket.io-client';
import { AppContext } from './libs/contextLib';
import Board from './components/Board'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
const socket = io('http://localhost:5000')

function App() {


  function reducer(curState, action) {
    let newState = structuredClone(curState)
    const actions = {
      'replace' : (_, value) => structuredClone(value),
      'add' : (list, value) => [...list, value],
      'remove' : (list, value) => list.filter(v => v.index !== value.index),
      'update' : (list, value) => list.map(v => v.index === value.index ? value : v)
    }
    switch (action.type) {
      case 'column':
        newState.columns = actions[action.action](curState.columns, action.value)
        break;
      case 'task':
        let col = newState.columns[action.value.column_idx]
        console.log('col: ', col)
        newState.columns[col.index].tasks = actions[action.action](col.tasks, action.value)
        console.log('new state: ', newState.columns[col.index].tasks.length)
        break;
      case 'board':
        newState = structuredClone(action.value)
        break;
      default:
        console.log('invalid action')
    }
    return newState
  }

  const [board,dispatch] = useReducer(reducer, {'columns':[]})

  return (
      <div>
        <h1>Tazkr</h1>
        <AppContext.Provider value={{board, dispatch, socket}}>
          <Router>
            <Routes>
              <Route path="/:board_id" element={<Board />} />
              <Route path="/" element={<Board />} />
            </Routes>
          </Router>
        </AppContext.Provider>
      </div>
  );
}

export default App;
