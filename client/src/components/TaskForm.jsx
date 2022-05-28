import {useState} from 'react';

const TaskForm = ({addTask}) => {
    const [adding, setAdding] = useState(false)
    const [description, setDescription] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        addTask(description)
        setDescription('')
        setAdding(false)
    };

    return (
        adding ? 
        <form onSubmit={handleSubmit}> 
            <textarea 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Task description" 
                rows="3"
                value={description}
            ></textarea>
            <div className="buttons">
                <button className="btn">Add</button>
                <button type="button" onClick={() => setAdding(false)} className="btn">Cancel</button>
            </div>
        </form> :  
        <button onClick={() => setAdding(true)} className="btn">+ Add Task</button>
    )
}
export default TaskForm