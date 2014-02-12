var Apis = {};

Apis.users = function(data, response)
{
    if (data.act === undefined) Route.ResponseJSON({}, response);
    switch(data.act)
    {
        case "get":
            try
            {
                var users = JSON.StringToObject(data.user_ids);
                if (JSON.Length(users) > 0)
                {
                    var userinfo = {
                        count: 0, 
                        users: []
                    };
                    var ids = data.user_ids.replace(/null\s?\,?/g, "").replace(/\,/g, " OR id = ").replace(/OR id =\s(?!\S)/g, "");
                    MySQL.Ex.query("SELECT * FROM users WHERE id = " + ids, function(error, rows, fields)
                    {
                        if (error) return Route.ResponseJSON({error: "Error on server"}, response);
                        var userinfo = {
                            count: rows.length,
                            users: []
                        };
                        for (var key in rows)
                        {
                            if (rows[key].id === undefined) continue;

                            var get_fields = ["id", "login"];
                            if (data.fields !== undefined)
                            {
                                var temp = JSON.StringToObject(data.fields);
                                for (var keys in temp)
                                {
                                    get_fields.push(temp[keys]);
                                }
                            }
                            var user = {};
                            for(var keys in get_fields)
                            {
                                if (rows[key][get_fields[keys]] === undefined) continue;
                                user[get_fields[keys]] = rows[key][get_fields[keys]];
                            }
                            userinfo.users.push(user);
                        }
                        Route.ResponseJSON(userinfo, response, data.callback);
                    });
                }
                else return Route.ResponseJSON({error: "Error user ids"}, response);
            }
            catch (error)
            {
                console.log(error);
                return Route.ResponseJSON({error: "Error parsing user ids"}, response);    
            }
            break;

        default:
            Route.ResponseJSON({error: "Error action type"}, response);
            break;
    }
};

exports.Apis = Apis;