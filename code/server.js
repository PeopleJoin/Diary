var express = require("express");
global.app = express();

app.get("/chat", function(req, res)
{
    if (req.subdomains[1] === undefined)
    {
        res.sendfile("./diary/sites/chat.html");    
    }
    else res.send(404);
});

app.get("/method/:name", function(req, res)
{
    if (req.subdomains[1] === 'api')
    {
        if (req.params.name.match(/\./))
        {
            try
            {
                var fn = req.params.name.match(/\w+/g);
                if (typeof api[fn[0]][fn[1]] === 'function')
                {
                    res.sendError = function(code)
                    {
                        this.jsonp({error_code: code, error: errors.names[code]}); 
                    };
                    var data = (req.body !== undefined) ? req.body : req.query;
                    for (var key in data)
                    {
                        data[key] = data[key].replace(/[^\w+\d+_\s\.\@]/, "");
                    }
                    return api[fn[0]][fn[1]](req, res, data);
                }
            }
            catch(error)
            {
                console.log(error);
            }
        }
        else if (api[req.params.name] === 'function') return api[req.params.name](req, res);
    }
    res.send(404);
});

app.listen(8888);
console.log("server started!");