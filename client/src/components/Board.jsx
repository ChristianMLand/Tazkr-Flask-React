import { useEffect } from "react"
import axios from 'axios'
import { useAppContext } from '../libs/contextLib'
import { DragDropContext } from 'react-beautiful-dnd'
import { useParams, useNavigate } from "react-router-dom"
import Column from './Column'

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const Board = () => {//TODO make a view instead
    const { board_id } = useParams()
    let { board, dispatch, socket, reIndex} = useAppContext()
    // const [searchParams, ] = useSearchParams()
    // searchParams.get('password')
    const addColumn = () => {
        const col = {
            'id': board.columns.length,
            'title': 'Unnamed', 
            'tasks' : [],
            'board_id' : board_id,
        }
        if (board_id) {
            socket.emit('add_column', col)
        } else {
            dispatch({'action': 'add', 'type': 'column', 'value': col})
        }
    }

    const deleteColumn = id => {
        const col = {
            'id': id, 
            'board_id': board_id, 
        }
        if (board_id) {
            socket.emit('del_column', col)
        } else {
            dispatch({'action': 'remove', 'type': 'column', 'value': col})
        }
    }
    //TODO send drag position over websocket so other clients can see the task being dragged
    const onDragEnd = result => {//TODO refactor
        const src = result.source//source droppable
        const des = result.destination//destination droppable
        if (!des || !src) return;
        const columns = structuredClone(board.columns)
        const sCol = columns.find(c => c.id === +src.droppableId)// get source column
        const dCol = columns.find(c => c.id === +des.droppableId)// get destination column
        const task = sCol.tasks[src.index];// get dragged task
        sCol.tasks.splice(src.index, 1)//remove task from source column
        dCol.tasks.splice(des.index, 0, task)//add task to destination column
        task.column_id = dCol.id;
        //re-index all the tasks
        reIndex(sCol)
        reIndex(dCol)
        if (board_id) {
            socket.emit('move_task', {'board_id' : board_id, 'value': columns})
        } else {
            dispatch({'action': 'replace', 'type': 'column', 'value': columns})
        }
    }

    useEffect(() => {
        if(board_id) {
            axios.get(`http://127.0.0.1:5000/boards/${board_id}`, {headers: {'Access-Control-Allow-Origin' : '*'}})
            .then(data => dispatch({'action': 'replace', 'type': 'board', 'value': data.data}))
            .catch(err => console.error(err))

            socket.on('connect', () => socket.emit('join_board', {'board_id': board_id, 'name': 'test'}))
            socket.on('user_joined', data => console.log('successfully joined', data))//TODO display connected users?

            socket.on('add_column', data => dispatch({'action': 'add', 'type': 'column', 'value': data}))//WORKS
            socket.on('update_column', data => dispatch({'action': 'update', 'type': 'column', 'value': data}))
            socket.on('del_column', data => dispatch({'action': 'remove', 'type': 'column', 'value': data}))//WORKS

            socket.on('add_task', data => dispatch({'action': 'add', 'type': 'task', 'value': data}))//NOT WORKING FULLY
            socket.on('move_task', data => {
                console.log("RECIEVED MOVED TASKS", data);
                dispatch({'action': 'replace', 'type': 'column', 'value': data})
            })
            socket.on('del_task', data => dispatch({'action': 'remove', 'type': 'task', 'value': data}))
            
            return () => socket.removeAllListeners()
        } else {
            let json = localStorage.getItem('board')
            if (json) {
                dispatch({'action': 'replace', 'type': 'board', 'value': JSON.parse(json)})
            }
        }
    }, [dispatch, board_id, socket])

    useEffect(() => {//TODO figure out way to combine useeffects and pull out into functions
        if(!board_id){
            localStorage.setItem('board', JSON.stringify(board))
            console.log('localstorage updated!', board)
        }
    }, [board, dispatch, board_id])

    let navigate = useNavigate();

    function createBoard() {
        axios.get(`http://127.0.0.1:5000/boards/create`, {headers: {'Access-Control-Allow-Origin' : '*'}})
        .then(data => navigate(`/${data.data.id}`))
        .catch(err => console.error(err))
    }

    return (
        <div className="board">
            <div>
                <button onClick={addColumn} className="btn">+ Add Column</button>
                <button onClick={createBoard} className="btn">Share</button>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="column-list">
                    {board.columns && board.columns.map((c, i) => {
                        return <Column key={i} column={c} deleteColumn={deleteColumn} />
                    })}
                </div>
            </DragDropContext>
        </div>
    )
}

export default Board