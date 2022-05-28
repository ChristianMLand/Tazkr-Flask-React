
from flask_app import app,socketio
from flask_socketio import join_room, emit
from flask_app.models.board_model import Board
from flask_app.models.column_model import Column
from flask_app.models.task_model import Task
from flask import jsonify, request

connected_users = {}
# REST API Routes
@app.route('/boards/<int:id>')
def get_board(id):
    board = Board.get_one(id=id)
    if board:
        return jsonify(board.json)
    else:
        return jsonify({})

@app.post('/boards/create')
def create_board():
    board_id = Board.create(password="1234")
    boardData = request.json
    for col in boardData['columns']:
        col_id = Column.create(board_id=board_id, title=col['title'])
        for task in col['tasks']:
            Task.create(column_id=col_id, index=task['index'], description=task['description'])
    return jsonify(board_id)

# Socket listeners
@socketio.on('join_board')
def handle_join_board(data):
    join_room(data['board_id'])
    emit('user_joined', data, room=str(data['board_id']))

@socketio.on('add_column')
def handle_add_column(data):
    col = data['value']
    col_id = Column.create(title=col['title'], board_id=data['board_id'])
    col = Column.get_one(id=col_id)
    emit('add_column', col.json, room=str(data['board_id']))

@socketio.on('remove_column')
def handle_remove_column(data):
    col = data['value']
    Column.delete(id=col['id'])
    emit('remove_column', col, room=str(data['board_id']), include_self=False)

@socketio.on('add_task')
def handle_add_task(data):
    task = data['value']
    task_id = Task.create(index=task['index'], description=task['description'], column_id=task['column_id'])
    task = Task.get_one(id=task_id)
    emit('add_task', task.json, room=str(data['board_id']))

@socketio.on('remove_task')
def handle_remove_task(data):
    task = data['value']
    Task.delete(id=task['id'])
    emit('remove_task', task, room=str( data['board_id']), include_self=False)

@socketio.on('replace_column')
def handle_replace_columns(data):
    columns = data['value']
    for col in columns:
        for task in col['tasks']:
            Task.update(id=task['id'], column_id=task['column_id'], index=task['index'])
    emit('replace_column', columns, room=str(data['board_id']), include_self=False)

@socketio.on('update_column')
def handle_update_column(data):
    column = data['value']
    Column.update(id=column['id'], title=column['title'])
    emit('update_column', column, room=str(data['board_id']), include_self=False)