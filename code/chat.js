function Chat()
{
    var self = this;
    
    self._io = require("socket.io").listen(8000);
    
    self._io.on('connection', function(socket)
    {
        socket.on('message', function(data)
        {
            socket.emit("message", {message: data.message, user: data.user});
            socket.broadcast.emit("message", {message: data.message, user: data.user});
        });
    });
}

global.Chat = new Chat();