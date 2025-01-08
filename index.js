const express = require('express');
const app = express();
const server = require('http').createServer(app);
const webSockets = require('ws');

// Membuat WebSocket server yang menghubungkan ke server HTTP
const wss = new webSockets.Server({ server: server });

wss.on('connection', function connection(ws) {
    console.log('A New Client connected!');
    ws.send('Welcome New Client!');

    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        ws.send('Got your msg, it\'s: ' + message); // Mengirim balasan ke klien yang mengirim pesan

        // Mengirim pesan ke semua klien yang terhubung
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === webSockets.OPEN) {
                client.send(message); // Mengirim pesan ke semua klien yang lain
            }
        });
    });
});

// Aplikasi Express
app.get('/', (req, res) => res.send('Hello World'));

// Menjalankan server di port 3000
server.listen(3000, () => console.log('Listening on port :3000'));
