api.user = {
    get: function(req, res, data)
    {
        /*
            Использование:
            user.get?user_ids=IDS&fields=FIELDS
        */
        access_token = data.access_token || "";
        MySQL.query("select * from users where access_token = '" + access_token + "' limit 1", function(error, rows)
        {
            var permissions = parseInt("00000", 2);
            if (rows[0] !== undefined) permissions = parseInt(rows[0].permissions, 2);
                
            var fields = ["id", "login"];
            var want_fields = JSON.StringToObject(data.fields);
            for (var key in want_fields)
            {
                if (want_fields[key] == 'password' || want_fields[key] == 'access_token')
                {
                    if (permissions & User.ACCESS.ACCOUNTS) fields.push(want_fields[key]);
                }
                else fields.push(want_fields[key]);
            }
                
            User.Get(JSON.StringToObject(data.user_ids), {fields: fields}, res);
        });
    },
    auth: function(req, res, data)
    {
        /*
            Использование:
                user.auth?type=TYPE&params...
        */
        switch(data.type)
        {
            case "login":
                // login, password
                User.Auth.Login(data.login, data.password, res);
                break;
            case "reg":
                // login, mail, password, code OR access_token
                if (data.code !== undefined)
                {
                    MySQL.query("select * from codes where code = '" + data.code + "' limit 1", function(error, rows)
                    {
                        if (error || rows[0].code === undefined) res.sendError(errors.FALSE_CODE); 
                        else
                        {
                            if (data.mail == rows[0].mail)
                            {
                                MySQL.query("delete from codes where code = '" + data.code + "'", function(error, rows)
                                {
                                    if (error || rows.changedRows < 1) res.sendError(errors.FALSE_CODE);
                                    else User.Auth.Reg(data.mail, data.login, data.password, res);
                                });    
                            }
                        }
                    });    
                }
                else if (data.access_token !== undefined)
                {
                    MySQL.query("select * from users where access_token = '" + data.access_token + "'", function(error, rows)
                    {
                        if (error || rows[0].id === undefined) res.sendError(errors.FALSE_REG);
                        else if (parseInt(rows[0].permissions, 2) & User.ACCESS.REG) User.Auth.Reg(data.mail, data.login, data.password, res);
                        else res.sendError(errors.FALSE_REG);
                    });
                }
                else res.sendError(errors.FALSE_REG);
                break;
            case "logout":
                // access_token
                MySQL.query("update users set access_token = '' where access_token = '" + data.access_token + "' limit 1", function(error, rows)
                {
                    if (error || rows.changedRows < 1) res.sendError(errors.FALSE_LOGOUT);
                    else res.jsonp({success: true});
                });
                break;
            default:
                res.sendError(errors.AUTH_TYPE);
                break;
        }
    }
};

var User = {

    ACCESS: 
    {
        REG: 1, // 00001 - доступ к регистрации
        MARKS: 2, // 00010 - доступ к изменению оценочек
        MESSAGES: 4, // 00100 - доступ к отправке сообщений юзерам
        JOURNAL: 8, // 01000 - доступ к всем журналам
        ACCOUNTS: 16 // 10000 - доступ к аккаунтам
    },

    Auth: 
    {
        Reg: function(mail, login, password, res)
        {
            MySQL.query("select * from users where login = '" + login + "' or mail = '" + mail + "' limit 1", function(error, rows)
            {
                if (error || rows[0] === undefined)
                {
                    MySQL.query("insert into users (login, password, mail) values ('" + login + "', '" + SHA1(password) + "', '" + mail + "')", function(error, rows)
                    {
                        if (error) res.sendError(errors.FAIL_REG);
                        else User.Auth.Login(login, password, res); 
                    });    
                }
                else res.sendError(errors.USER_DEFINED);
            });
        },
    
        Login: function(login, password, res)
        {
            MySQL.query("select * from users where login = '" + login + "'", function(error, rows)
            {
            if (error || rows[0] === undefined) res.sendError(errors.FALSE_LOGIN);
            else
            {
                if(SHA1(password) == rows[0].password)
                {
                    var access_token = SHA1(rows[0].id + new Date().getTime());
                    MySQL.query("update users set access_token = '" + access_token + "' where id = " + rows[0].id, function(error)
                    {
                        if (error) res.sendError(errors.ERROR_LOGIN);
                        else res.jsonp({id: rows[0].id, access_token: access_token});
                    });
                }
                else res.sendError(errors.FALSE_PASS);
            }
        });    
        }
    },
    
    Get: function(user_ids, settings, callback)
    {
        MySQL.query("select * from users where id = " + JSON.SetSeparate(user_ids, " OR id = "), function(error, rows)
        {
            if (!error)
            {
                var users = {count: rows.length, users: []};
                for (var i = 0; i < rows.length; i++)
                {
                    var user = {};
                    for(var key in settings.fields)
                    {
                        if (rows[i][settings.fields[key]] !== undefined) user[settings.fields[key]] = rows[i][settings.fields[key]];
                    }
                    users.users.push(user);
                }
                if (typeof callback === 'function') callback(users);
                else callback.jsonp(users);
            }
            else 
            {
                if (typeof callback === 'function') callback(undefined);
                else callback.jsonp(error.USER_IDS);
            }
        });    
    }
};