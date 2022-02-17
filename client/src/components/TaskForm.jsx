import {useState} from 'react';
import { useAppContext } from '../libs/contextLib';

const TaskForm = ({idx, cid}) => {
    const [adding,setAdding] = useState(false)
    const [description, setDescription] = useState('')
    const {board, dispatch, socket} = useAppContext()

    const addTask = () => {
        const task = {
            index : board.columns[idx].tasks.length,
            description: description,
            column_id: cid,
            column_idx: idx,
        }
        if (board.id) {
            socket.emit('add_task', task)
        } else {
            dispatch({'action': 'add', 'type': 'task', 'value': task})
        }
        setDescription('')
        setAdding(false)
    };

    return (
        adding ? 
        <> 
            <textarea 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Task description" 
                rows="3"
                value={description}
            ></textarea>
            <div className="buttons">
                <button onClick={addTask} className="btn">Add</button>
                <button onClick={() => setAdding(false)} className="btn">Cancel</button>
            </div>
        </> :  
        <button onClick={() => setAdding(true)} className="btn">+ Add Task</button>
    )
}
export default TaskForm