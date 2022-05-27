# Tazkr
This is a workflow management tool where you can create different tasks and lists to organize your progress. You can create boards without any sort of account and will be saved in your browsers local storage until you decide to share it. Once you share the board it will add the board to a database and allow for other people to connect with the provided link and interact with the board in real time using websockets.

## Technologies used
- React
- Flask
- MySQL (PyMySQL)
- Socket.io (Flask-Socketio)
- React Beautiful Dnd

# TODO
- implement share button creating board row in database - IN PROGRESS
    - use data from localstorage if exists
    - redirect to the view of the created board - DONE
    - allow setting a password when creating the board/sharing 
    - require password to match in query string in order to have write permissions
    - if no password or wrong password have read permissions only
- implement editing task descriptions (same way as editing column titles) - IN PROGRESS
- implement import/export to/from json files
- implement live chat for connected users
    - randomly generated usernames unique per connected client
    - limit number of users that can be connected at a time (maybe 30?)