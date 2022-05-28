import {useEffect, useState} from 'react'
import TaskForm from './TaskForm'
import { useAppContext } from '../libs/contextLib'
import {Droppable} from 'react-beautiful-dnd'
import Task from "./Task"

const Column = ({column}) => {
    const {board, handleDispatch} = useAppContext()
    const [title, setTitle] = useState(column.title)

    useEffect(() => setTitle(column.title), [board, column])

    const updateTitle = () => handleDispatch('update','column', {...column, title: title})

    const deleteColumn = () => handleDispatch('remove', 'column', {'id': column.id, 'index': column.index})

    const addTask = (description) => {
        const task = {
            index : column.tasks.length,
            description: description,
            column_id: column.id,
            board_id: board.id
        }
        handleDispatch('add', 'task', task)
    }

    return (
        <div className="column" id={column.id}>
            <div className="col-head">
                <input onBlur={updateTitle} onChange={e => setTitle(e.target.value)} value={title}/>
                <button onClick={deleteColumn} className="material-icons-outlined icon">delete</button>
            </div>
            <div className="col-body">
                <TaskForm addTask={addTask} />
                <Droppable droppableId={`${column.id}`} index={column.id}>
                    {provided => (
                        <div className="task-list" ref={provided.innerRef}>
                            {column.tasks && column.tasks.map((task, i) => <Task key={i} task={task}/>)}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </div>
        </div>
    )
}

export default Column