import './App.css';
import {useReducer} from 'react';
import { AppContext } from './libs/contextLib';
import { socket } from './libs/socketLib';
import Board from './components/Board'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'

const App = () => {

  function reIndex(column) {
    for (let i = 0; i < column.tasks.length; i++) {
      column.tasks[i].index = i
    }
  }

  function reducer(curState, action) {
    let newState = structuredClone(curState)
    const value = structuredClone(action.value)
    const actions = {//TODO refactor remove and update to be cleaner
      'replace' : (_, value) => value,
      'add' : (list, value) => [...list, value],
      'remove' : (list, value) => list.filter(v => {
        if (value.index !== undefined) {
          return v.index !== value.index
        } else {
          return v.id !== value.id
        } 
      }),
      'update' : (list, value) => list.map(v => {
        if (value.index !== undefined) {
          return v.index === value.index ? value : v
        } else {
          return v.id === value.id ? value : v
        }
      })
    }
    switch (action.type) {
      case 'column':
        newState.columns = actions[action.action](newState.columns, value);
        break;
      case 'task': 
        let col = newState.columns.filter((col) => col.id === value.column_id)[0];
        col.tasks = actions[action.action](col.tasks, value);
        reIndex(col)
        break;
      case 'board':
        newState = value;
        break;
      default:
        console.log('invalid action');
    }
    return newState
  }

  const [board, dispatch] = useReducer(reducer, {'columns':[]})

  return (
      <AppContext.Provider value={{board, dispatch, socket, reIndex}}>
        <h1>Tazkr</h1>
        <Router>
          <Routes>
            <Route path="/:board_id" element={<Board />} />
            <Route path="/" element={<Board />} />
          </Routes>
        </Router>
      </AppContext.Provider>
  );
}

export default App;
