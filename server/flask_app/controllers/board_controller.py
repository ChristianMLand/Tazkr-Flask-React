
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
    #TODO actually handle users
    join_room(data['board_id'])
    emit('user_joined', data, room=str(data['board_id']))

@socketio.on('add_column')
def handle_add_column(data):
    col_id = Column.create(index=data['index'], title=data['title'], board_id=data['board_id'])
    emit('add_column', Column.get_one(id=col_id).json, room=str(data['board_id']))

@socketio.on('del_column')
def handle_del_column(data):
    Column.delete(id=data['id'])
    emit('del_column', data, room=str(data['board_id']))

@socketio.on('add_task')
def handle_add_task(data):
    task_id = Task.create(index=data['index'], description=data['description'], column_id=data['column_id'])
    emit('add_task', Task.get_one(id=task_id).json, room=str(data['board_id']))#TODO fix room

@socketio.on('del_task')
def handle_del_task(data):
    Task.delete(id=data['id'])
    emit('del_task', data, room=str( data['board_id']))#TODO fix room

@socketio.on('move_task')
def handle_move_task(data):
    #TODO
    Column.update(**data)
    emit('move_task', data)

@socketio.on('update_column')
def handle_update_column(data):
    #TODO
    Column.update(**data)
    emit('update_column', data, room=str(data['board_id']))