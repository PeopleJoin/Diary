function MySQL(settings)
{
    var self = this;
    
    self._mysql = require("mysql");
    self._connection = self._mysql.createConnection(settings);
    self._connection.connect(function(error)
    {
        if (!error)
        {
            for(var key in self._connection)
            {
                self[key] = self._connection[key];
            }
            console.log("MySQL success connected");
        }    
        else console.log(error);
    });
}

global.MySQL = new MySQL({host: "localhost", user: "root", password: "hi", database: "diary"});