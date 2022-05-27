import Task from "./Task"
import {Droppable} from 'react-beautiful-dnd'
import { useAppContext } from "../libs/contextLib"

const TaskList = ({column}) => {
    const {board, dispatch, socket} = useAppContext()
    const deleteTask = task => {
        if (board.id) {
            socket.emit('del_task', {board_id: board.id, task})
        } else {
            dispatch({'action': 'remove', 'type': 'task', 'value': task})
        }
    }

    return (
        <Droppable droppableId={`${column.id}`} index={column.id}>
            {provided => (
                <div className="task-list" ref={provided.innerRef}>
                    {board && column.tasks.map((task, i) => (
                        <Task
                            key={i}
                            task={task}
                            deleteTask={() => deleteTask(task)}
                        />
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    )
}

export default TaskList