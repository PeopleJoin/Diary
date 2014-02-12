function Route(handle, root)
{
    /*
        Класс Route - управление страницами.
            Инициализация: 
                var * = new Route((Object)handle_list, (String)root);
            Методы:
                Go - выполнение функции страницы, которую запросил клиент.
                    Параметры:
                        pathname - имя запрошенной директории/файла.
                        response - указатель на класс ответа.
                        data - пересланная информация клиентом.
                    
                AddHandle - добавлние новой страницы в текущий список.
                    Параметры:
                        name - имя страницы
                        handle - функция
                    
                ShowPage - показать страницу HTML
                    Параметры:
                        page - имя страницы
                        response - указатель на класс ответа
                    
                ChangeRoot - сменить корневую дерикторию
                    Параметры:
                        root - имя новой дериктории (если не указали, вернется предыдущая директория)
                    
                UpdateHandles - задать новый список функций
                    Параметры:
                        handles - список новых функций
    */
    var self = this;
    
    self._handles = handle;
    self._file = require("fs");
    self._root = root || "./";
    self._lastroot = self._root;
    
    self.Go = function(info, response)
    {
        console.log("Navigate (subdomain: " + info.subdomain + ") to " + info.pathname);
        if (typeof self._handles[info.subdomain][info.pathname] === 'function') self._handles[info.subdomain][info.pathname](info.query,response);
        else self.ShowPage("404.html", response);
    };
    
    self.AddHandle = function(handles, subdomain)
    {
        subdomain = subdomain || "Root";
        self._handles[subdomain] = self._handles[subdomain] || {};
        for (var key in handles)
        {
            var name = (key.match(/\//)) ? key : "/" + key;
            self._handles[subdomain][name] = handles[key];    
            console.log("Add new site (subdomain: " + subdomain + ") name " + name);
        }
    };
    
    self.ShowPage = function(page, response)
    {
        self._file.readFile(self._root + page, function(error, dataFile)
        {
            if (error) throw error;
            else
            {
                response.writeHead(200, {"Content-Type": "text/html"});
                response.write(dataFile);
                response.end();    
            }
        });    
    };
    
    self.ResponseJSON = function(object, response, callback)
    {
        if (typeof object === 'object')
        {
            response.writeHead(200, {"Content-Type": "application/javascript"});
            var JSONP = (callback !== undefined) ? callback + "(" + JSON.stringify(object) + ")" : JSON.stringify(object);
            response.write(JSONP);
        }
        else response.writeHead(404);
        response.end();
    };
    
    self.ChangeRoot = function(root)
    {
        if (root !== undefined) self._lastroot = self._root;
        self._root = root || self._lastroot;
    };
    
    self.UpdateHandles = function(handles)
    {
        self._handles = handles;    
    };
}

exports.Route = Route;