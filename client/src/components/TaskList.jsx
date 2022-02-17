import Task from "./Task"
import {Droppable} from 'react-beautiful-dnd'
import { useAppContext } from "../libs/contextLib"

const TaskList = ({idx}) => {
    const {board, dispatch, socket} = useAppContext()
    const deleteTask = i => {
        const task = board.columns[idx].tasks[i]
        task.column_idx = idx
        if (board.id) {
            socket.emit('del_task', task)
        } else {
            dispatch({'action': 'remove', 'type': 'task', 'value': task})
        }
    }

    return (
        <Droppable droppableId={`${idx}`} index={idx}>
            {provided => (
                <div className="task-list" ref={provided.innerRef}>
                    {board && board.columns[idx].tasks.map((task,i) => (
                        <Task
                            key={i}
                            cid={idx}
                            idx={i}
                            task={task}
                            deleteTask={deleteTask}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default TaskList