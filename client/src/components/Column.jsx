import {useEffect, useState} from 'react'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import { useAppContext } from '../libs/contextLib'

const Column = ({idx, cid, deleteColumn}) => {
    const {board, dispatch, socket} = useAppContext()
    const [title, setTitle] = useState(board.columns[idx].title)

    const updateTitle = _ => {
        let col = board.columns[idx]
        col.title = title
        if (board.id) {
            socket.emit('update_column', col)
        } else {
            dispatch({'action': 'update', 'type': 'column', 'value': col})
        }
    }

    useEffect(() => {
        setTitle(board.columns[idx].title)
    }, [board, idx])

    return (
        <div className="column" cid={cid}>
            <div className="col-head">
                <input onBlur={updateTitle} onChange={e => setTitle(e.target.value)} value={title}/>
                <button onClick={() => deleteColumn(cid,idx)} className="material-icons-outlined icon">delete</button>
            </div>
            <div className="col-body" >
                <TaskForm idx={idx} cid={cid} />
                <TaskList idx={idx} />
            </div>
        </div>
    )
}

export default Column