import {Draggable} from 'react-beautiful-dnd'

const Task = ({task, deleteTask}) => {//TODO figure out better way to handle draggable
    return (
        <Draggable draggableId={`${task.column_id}-${task.index}`} index={task.index}>
            {provided => (
                <div className="task" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <p>{task.description}</p>
                    <button onClick={deleteTask} className="material-icons-outlined icon">delete</button>
                </div>  
            )}
        </Draggable>
    )
}

export default Task