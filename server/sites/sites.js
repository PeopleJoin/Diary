var Handles = {
    Root: {},
    api: {}
};

Handles.Root['/'] = function(data, response)
{
    Route.ShowPage("index.html", response);
};

Handles.api['/'] = function(data, response)
{
    Route.ShowPage("api/index.html", response);    
};

Handles.Root['/stop'] = function(data, response)
{
    console.log("MySQL disabled!");
    MySQL.Disconnect();
    console.log("Server has stoped!");
    Server._server.close();    
};

exports.Handles = Handles;