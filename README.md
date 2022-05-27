# Tazkr
## Technologies used
- React
- Flask
- MySQL (PyMySQL)
- Socket.io (Flask-Socketio)
- React Beautiful Dnd

# TODO
- keep track of edited column titles with websockets - IN PROGRESS
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