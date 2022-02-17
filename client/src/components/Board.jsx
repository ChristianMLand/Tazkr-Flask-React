import { useEffect } from "react"
import axios from 'axios'
import { useAppContext } from '../libs/contextLib'
import { DragDropContext } from 'react-beautiful-dnd'
import { useParams, useNavigate } from "react-router-dom"
import Column from './Column'

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const Board = () => {
    const { board_id } = useParams()
    const {board, dispatch, socket} = useAppContext()
    // const [searchParams, ] = useSearchParams()
    // searchParams.get('password')
    const addColumn = () => {
        const col = {
            'index': board.columns.length,
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

    const deleteColumn = (cid,idx) => {
        const col = {
            'id': cid, 
            'index': idx,
            'board_id': board_id, 
        }
        if (board_id) {
            socket.emit('del_column', col)
        } else {
            dispatch({'action': 'remove', 'type': 'column', 'value': col})
        }
    }

    const onDragEnd = result => {
        const src = result.source
        const des = result.destination
        if (!des || !src) return
        const columns = structuredClone(board.columns)
        const sColIdx = parseInt(src.droppableId)
        const dColIdx = parseInt(des.droppableId)
        const task = columns[sColIdx].tasks[src.index]
        columns[sColIdx].tasks.splice(src.index, 1)
        columns[dColIdx].tasks.splice(des.index, 0, task)
        if (board_id) {
            socket.emit('move_task', {'board_id' : board_id, 'value': result})
        } else {
            dispatch({'action': 'replace', 'type': 'column', 'value': columns})
        }
    }

    useEffect(() => {
        if(board_id) {
            axios.get(`http://127.0.0.1:5000/boards/${board_id}`, {headers: {'Access-Control-Allow-Origin' : '*'}})
            .then(data => dispatch({'action': 'replace', 'type': 'board', 'value': data.data}))
            .catch(err => console.error(err))

            socket.on('connect', () => socket.emit('join_board', {'board_id': board_id, 'name': 'test'}))//TODO 
            socket.on('join_board', data => console.log('successfully joined', data))//TODO
            socket.on('add_column', data => dispatch({'action': 'add', 'type': 'column', 'value': data}))
            socket.on('del_column', data => dispatch({'action': 'remove', 'type': 'column', 'value': data}))
            socket.on('add_task', data => dispatch({'action': 'add', 'type': 'task', 'value': data}))
            socket.on('del_task', data => dispatch({'action': 'remove', 'type': 'task', 'value': data}))
            socket.on('move_task', data => dispatch({'action': 'replace', 'type': 'column', 'value': data}))
            socket.on('update_column', data => dispatch({'action': 'update', 'type': 'column', 'value': data}))
        } else {
            let json = localStorage.getItem('board')
            if (json) dispatch({'action': 'replace', 'type': 'board', 'value': JSON.parse(json)})
        }
    }, [dispatch, board_id, socket])

    useEffect(() => {
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
                        return <Column key={i} idx={i} cid={c.id} deleteColumn={deleteColumn} />
                    })}
                </div>
            </DragDropContext>
        </div>
    )
}

export default Board