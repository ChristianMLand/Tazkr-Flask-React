from flask_app import app,socketio
from flask_app.controllers import board_controller

if __name__ == "__main__":
    socketio.run(app,debug=True)