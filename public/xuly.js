var socket = io('http://localhost:3000');
socket.on('Server-send-data', (data) => {
    $('#noidung').append(data + ', ');
});

socket.on('server-send-dki-thatbai', () => {
    alert('Sai username (co nguoi dang ky roi!!!)');
});
socket.on('server-send-dki-thanhcong', (data) => {
    $('#currentUser').html(data);
    $('#loginForm').hide(2000);
    $('#chatForm').show(1000);
});

socket.on('server-send-danhsach-users', (data) => {
    $('#boxContent').html('');
    data.forEach((item) => {
        $('#boxContent').append(`<div class="useronline">${item}</div>`);
    });
});

socket.on('server-send-message', (data) => {
    $('#listMessages').append(`<div class="ms">${data.username}: ${data.noidung}</div>`);
});
socket.on('ai-do-dang-go-chu', (data) => {
    $('#thongbao').html(data);
});
socket.on('ai-do-stop-go-chu', () => {
    $('#thongbao').html('');
});
$(document).ready(function() {
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnRegister').click(() => {
        socket.emit('client-send-Username', $('#txtUsername').val());
    });
    $('#btnLogout').click(() => {
        socket.emit('logout');
        $('#chatForm').hide(2000);
        $('#loginForm').show(1000);
    });

    $('#btnSendMessage').click(() => {
       socket.emit('user-send-message', $('#txtMessage').val());
    });

    $('#txtMessage').focusin(() => {
       socket.emit('toi-dang-go-chu');
    });
    $('#txtMessage').focusout(() => {
       socket.emit('toi-stop-go-chu');
    });
});