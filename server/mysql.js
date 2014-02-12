function MySQL(settings)
{
    var self = this;
    
    self._settings = settings;
    self._mysql = require("mysql");
    
    self.Connect = function()
    {
        self._connection = self._mysql.createConnection(self._settings);    
        self._connection.connect();
        
        self.Ex = self._connection;
    };
    
    self.Disconnect = function()
    {
        self._connection.end();    
    };
    
    self.Connect();
    
    self.Query = self._connection.query;
}

exports.MySQL = MySQL;