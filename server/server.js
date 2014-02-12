function Server(port, autostart)
{
    /*
        Параметры при инициализации:
            port - порт будущего сервера.
            autostart - запускать ли сервер по окончанию иницилизации.
        Свойства:
            Публичные свойства отсутствуют.
        Методы:
            Start - запуск сервера по заданным при инициализации параметрам.
    */
    autostart = autostart || true;
    
    var self = this;
    
    self._http = require("http");
    self._url = require("url");
    self._querystring = require("querystring");
    self._port = port;
    
    self.Start = function()
    {
        self._server = self._http.createServer(function(request, response)
        {
            var subdomain;
            try
            {
                if(request.headers.host.match(/\.+\w{3,}\..+/))
                {
                    subdomain = request.headers.host.replace(request.headers.host.match(/\.+\w{3,}\..+/), ""); 
                }
                else subdomain = "Root";
            }
            catch(error)
            {
                subdomain = "Root";
            }
            var info = {
                pathname: self._url.parse(request.url).pathname,
                query: self._querystring.parse(self._url.parse(request.url).query),
                subdomain: subdomain
            };
            Route.Go(info, response);      
        });
        self._server.listen(self._port);
        console.log("Server has started!");
    };
    
    if (autostart) self.Start();
}

exports.Server = Server;