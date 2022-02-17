import {Draggable} from 'react-beautiful-dnd'

const Task = ({cid,idx,task,deleteTask}) => {
    return (
        <Draggable draggableId={`${cid}-${idx}`} index={idx}>
            {provided => (
                <div className="task" ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                    <p>{task.description}</p>
                    <button onClick={() => deleteTask(idx)} className="material-icons-outlined icon">delete</button>
                </div>  
            )}
        </Draggable>
    )
}

export default Task