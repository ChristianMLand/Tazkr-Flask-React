# Tazkr
This is a workflow management tool where you can create different tasks and lists to organize your progress. You can create boards without any sort of account and will be saved in your browsers local storage until you decide to share it. Once you share the board it will add the board to a database and allow for other people to connect with the provided link and interact with the board in real time using websockets.

# Complete re-write in progress
- keep track of moved tasks with websockets
- keep track of edited column titles with websockets
- share button should create board in database
    - using data from localstorage if exists
    - redirects to that board view
    - allow setting a password when creating the board/sharing
    - require password to match in query string in order to have write permissions
    - if no password or wrong password have read permissions only
- implement import/export to/from json files
- implement live chat for connected users
    - randomly generated usernames unique per connected client
