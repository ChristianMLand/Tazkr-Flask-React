import io from 'socket.io-client';

export let socket = io.connect('http://127.0.0.1:5000');