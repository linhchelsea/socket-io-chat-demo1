const express = require('express');
const app = express();
app.use(express.static('./public'));
app.set('view engine', 'ejs');
app.set('views', './views');

const server = require('http').Server(app);
const io = require('socket.io')(server);
server.listen(3000, () => {
    console.log('Server is running on port: 3000');
});
let mangUsers = ['AAA'];
io.on('connection', (socket) => {
    console.log('Co nguoi ket noi: ' + socket.id);
    socket.on('disconnect', () => {
        console.log(socket.id + ' vua ngat ket noi');
    });

    socket.on('client-send-Username', (data) => {
        if (mangUsers.indexOf(data) >= 0) {
            // fail
            socket.emit('server-send-dki-thatbai');
        } else {
            // success
            mangUsers.push(data);
            socket.username = data;
            socket.emit('server-send-dki-thanhcong', data);
            io.sockets.emit('server-send-danhsach-users', mangUsers);
        }
    });

    socket.on('logout', () => {
        mangUsers.splice(mangUsers.indexOf(socket.username), 1);
        socket.broadcast.emit('server-send-danhsach-users', mangUsers);
    });

    socket.on('user-send-message', (data) => {
        io.sockets.emit('server-send-message', {
            username: socket.username,
            noidung: data,
        });
    });

    socket.on('toi-dang-go-chu', () => {
        io.sockets.emit('ai-do-dang-go-chu', `${socket.username} dang go chu`);
    });
    socket.on('toi-stop-go-chu', () => {
        io.sockets.emit('ai-do-stop-go-chu');
    });
    /*socket.on('Client-send-data', (data) => {
        // Ban cho tat ca
        // io.sockets.emit('Server-send-data', `${data}-888`);

        // Ban cho chinh minh
        // socket.emit('Server-send-data', `${data}-888`);

        // Ban cho room
        // socket.broadcast.emit('Server-send-data', `${data}-999`);
    });*/
});

app.get('/', (req, res) => {
    res.render('trangchu');
});