import {useEffect, useState} from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import { useAppContext } from '../libs/contextLib'

const Column = ({column, deleteColumn}) => {
    const {board, dispatch, socket} = useAppContext()
    const [title, setTitle] = useState(column.title)
    const updateTitle = _ => {
        const col = structuredClone(column)
        col.title = title
        if (board.id) {
            socket.emit('update_column', col)
        } else {
            dispatch({'action': 'update', 'type': 'column', 'value': col})
        }
    }

    useEffect(() => {
        setTitle(column.title)
    }, [board, column])

    return (
        <div className="column" id={column.id}>
            <div className="col-head">
                <input onBlur={updateTitle} onChange={e => setTitle(e.target.value)} value={title}/>
                <button onClick={() => deleteColumn(column.id)} className="material-icons-outlined icon">delete</button>
            </div>
            <div className="col-body" >
                <TaskForm column={column} />
                <TaskList column={column} />
            </div>
        </div>
    )
}

export default Column