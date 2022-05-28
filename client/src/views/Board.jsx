import axios from 'axios'
import { useEffect } from "react"
import { useAppContext } from '../libs/contextLib'
import { useParams } from "react-router-dom"
import Column from '../components/Column'

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

const Board = ({setShared}) => {
    const { board_id } = useParams()
    let { board, handleDispatch} = useAppContext()

    const addColumn = () => {
        const col = {
            'id': board.columns.length,
            'index' : board.columns.length,
            'title': 'Unnamed', 
            'tasks' : [], 
            'board_id' : board_id
        }
        handleDispatch('add','column', col)
    }
    
    const createBoard = () => {
        axios.post(`http://127.0.0.1:5000/boards/create`, board)
        .then(data => window.location.href = `/${data.data}`)
        .catch(err => console.error(err))
    }

    useEffect(() => setShared(board_id), [board_id, setShared])

    useEffect(() => {
        if (!board_id) {
            console.log("localstorage updated")
            localStorage.setItem('board', JSON.stringify(board))
        }
    }, [board, board_id])

    return (
        <div className="board">
            <div>
                <button onClick={addColumn} className="btn">+ Add Column</button>
                {/* <a href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(board))}`} download="data.json" className="btn">Export</a> */}
                <button onClick={createBoard} className="btn">Share</button>
            </div>
            <div className="column-list">
                {board.columns && board.columns.map((column, i) => (
                    <Column key={i} column={column}/>
                ))}
            </div>
        </div>
    )
}

export default Board