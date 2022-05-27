
from flask_app import app,socketio
from flask_socketio import join_room, emit
from flask_app.models.board_model import Board
from flask_app.models.column_model import Column
from flask_app.models.task_model import Task
from flask import jsonify

connected_users = {}
# REST API Routes
@app.route('/boards/<int:id>')
def get_board(id):
    board = Board.get_one(id=id)
    if board:
        return jsonify(board.json)
    else:
        return jsonify({})

@app.route('/boards/create')
def create_board():
    #TODO take post request with json data from localstorage + password
    board_id = Board.create(password="6969")
    board = Board.get_one(id=board_id)
    return jsonify(board.json)

# Socket listeners
@socketio.on('join_board')
def handle_join_board(data):
    print("CONNECTED!!!!!")
    #TODO actually handle users
    join_room(data['board_id'])
    emit('user_joined', data, room=str(data['board_id']))

@socketio.on('add_column')
def handle_add_column(data):
    col_id = Column.create(title=data['title'], board_id=data['board_id'])
    col = Column.get_one(id=col_id)
    emit('add_column', col.json, room=str(data['board_id']))

@socketio.on('del_column')
def handle_del_column(data):
    Column.delete(id=data['id'])
    emit('del_column', data, room=str(data['board_id']))

@socketio.on('add_task')
def handle_add_task(data):
    task_id = Task.create(index=data['index'], description=data['description'], column_id=data['column_id'])
    task = Task.get_one(id=task_id)
    emit('add_task', task.json, room=str(data['board_id']))

@socketio.on('del_task')
def handle_del_task(data):
    task = data['task']
    Task.delete(id=task['id'])
    emit('del_task', task, room=str( data['board_id']))

@socketio.on('move_task')
def handle_move_task(data):
    print(data)
    columns = data['value']
    for col in columns:
        for task in col['tasks']:
            Task.update(id=task['id'], column_id=task['column_id'], index=task['index'])
    emit('move_task', columns, room=str(data['board_id']))

@socketio.on('update_column')
def handle_update_column(data):
    col = data['col']
    Column.update(id=col['id'], title=col['title'])
    emit('update_column', col, room=str(data['board_id']))