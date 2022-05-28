import './App.css';
import axios from 'axios'
import io from 'socket.io-client';
import { useReducer, useEffect, useState } from 'react';
import { AppContext } from './libs/contextLib';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DragDropContext } from 'react-beautiful-dnd'
import Board from './views/Board'


const App = () => {
  const reIndex = column => {
    for (let i = 0; i < column.tasks.length; i++) {
      column.tasks[i].index = i
    }
  }

  const actions = {
    'replace' : (_, value) => value,
    'add' : (list, value) => [...list, value],
    'remove' : (list, value) => list.filter(v => v.index !== value.index),
    'update' : (list, value) => list.map(v => v.index === value.index ? value : v)
  }

  const reducer = (curState, {type, action, value}) => {
    let newState = structuredClone(curState)
    value = structuredClone(value)

    switch (type) {
      case 'column':
        newState.columns = actions[action](newState.columns, value);
        break;
      case 'task': 
        let col = newState.columns.find((col) => col.id === value.column_id);
        col.tasks = actions[action](col.tasks, value);
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

  const [board, dispatch] = useReducer(reducer, JSON.parse(localStorage.getItem('board')) || {columns:[]})

  const [socket, setSocket] = useState()

  const [shared, setShared] = useState(board.id)

  const handleDispatch = (action, type, value) => {
      if (!socket || action !== "add") {
        dispatch({action, type, value})
      }
      if (socket) {
          socket.emit(`${action}_${type}`, {board_id: shared, value})
      }
  }

  const onDragEnd = result => {//TODO refactor
      const src = result.source
      const des = result.destination
      if (!des || !src) return;
      const columns = structuredClone(board.columns)
      const sCol = columns.find(c => c.id === +src.droppableId)
      const dCol = columns.find(c => c.id === +des.droppableId)
      const task = sCol.tasks[src.index];
      sCol.tasks.splice(src.index, 1)
      dCol.tasks.splice(des.index, 0, task)
      task.column_id = dCol.id;
      reIndex(sCol)
      reIndex(dCol)
      handleDispatch('replace', 'column', columns)
  }

  useEffect(() => {
    if(shared) {
          console.log("SHOULDNT BE RUNNING")
          axios.get(`http://127.0.0.1:5000/boards/${shared}`)
          .then(data => dispatch({'action': 'replace', 'type': 'board', 'value': data.data}))
          .catch(console.error)

          if (!socket) {
              setSocket(io.connect('http://127.0.0.1:5000'))
          } else {
            socket.on('connect', () => socket.emit('join_board', {'board_id': shared, 'name': 'test'}))
            socket.on('add_column', data => dispatch({'action': 'add', 'type': 'column', 'value': data}))
            socket.on('update_column', data => dispatch({'action': 'update', 'type': 'column', 'value': data}))
            socket.on('remove_column', data => dispatch({'action': 'remove', 'type': 'column', 'value': data}))
            socket.on('replace_column', data => dispatch({'action': 'replace', 'type': 'column', 'value': data}))
            socket.on('add_task', data => dispatch({'action': 'add', 'type': 'task', 'value': data}))
            socket.on('remove_task', data => dispatch({'action': 'remove', 'type': 'task', 'value': data}))
  
            return () => socket.removeAllListeners()
          }
      }
  }, [socket, shared])

  return (
      <AppContext.Provider value={{board, handleDispatch}}>
        <h1>Tazkr</h1>
        <DragDropContext onDragEnd={onDragEnd}>
          <Router>
            <Routes>
              <Route path="/:board_id" element={<Board setShared={setShared}/>} />
              <Route path="/" element={<Board setShared={setShared}/>} />
            </Routes>
          </Router>
        </DragDropContext>
      </AppContext.Provider>
  );
}

export default App;
