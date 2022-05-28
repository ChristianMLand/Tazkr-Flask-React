import {Draggable} from 'react-beautiful-dnd'
import { useAppContext } from "../libs/contextLib"

const Task = ({task}) => {
    const { handleDispatch } = useAppContext()
    const deleteTask = () => handleDispatch('remove', 'task', task)

    return (
        <Draggable draggableId={`${task.column_id}-${task.index}`} index={task.index}>
            {provided => (
                <div id={task.index} className="task" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <p>{task.description}</p>
                    <button onClick={deleteTask} className="material-icons-outlined icon">delete</button>
                </div>  
            )}
        </Draggable>
    )
}

export default Task