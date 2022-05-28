# Tazkr
This is a workflow management tool where you can create different tasks and lists to organize your progress. You can create boards without any sort of account and will be saved in your browsers local storage until you decide to share it. Once you share the board it will add the board to a database and allow for other people to connect with the provided link and interact with the board in real time using websockets.

## Technologies used
- React
- Flask
- MySQL (PyMySQL)
- Socket.io (Flask-Socketio)
- React Beautiful Dnd

# TODO
- make modal component
- implement import/export board - IN PROGRESS
    - export board to json - DONE
    - import board from json
- fully implement share button - IN PROGRESS
    - create board in database - DONE
    - connect with websockets - DONE
    - allow setting a board password
    - if no password or wrong password in query params have read permissions only
- implement better tasks - IN PROGRESS
    - able to edit task descriptions
    - task priority levels
    - assign due dates
- implement live chat for connected users
    - randomly generated usernames unique per connected client
    - limit number of users that can be connected at a time (maybe 30?)