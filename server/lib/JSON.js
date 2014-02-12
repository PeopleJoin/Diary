JSON.GetSeparate = function(string)
{
    try
    {
        var match = string.match(/([^\w](?=\s|\w))+/g);
        return (typeof match === 'object') ? match[0] : match;
    }
    catch (error)
    {
        return undefined;    
    }
};

JSON.StringToObject = function(string, separate)
{
    try
    {
        separate = separate || JSON.GetSeparate(string);
        var object = [];
        var regexp = new RegExp('(\u005Cw|\u005Cd)+(?!:(' + separate + "|$))", "g")
        if (string.match(regexp))
        {
            var matches = string.match(regexp);  
            for (var key in matches)
            {
                object.push(matches[key]);
            }
        }
        else if (sepearate === undefined) return JSON.parse("[" + string + "]");
        return object;
    }
    catch (error)
    {
        console.log(error);
        return undefined;
    }
};

JSON.Length = function(object)
{
    if (typeof object !== 'object') return (typeof object === 'array') ? object.length : undefined;
    var length = 0;
    for (var key in object)
    {
        length++;
    }
    return length;
};

JSON.Push = function(source)
{
    for(var key in arguments)
    {
        if (arguments[key] == source) continue;
        if (typeof source === 'array') source.push(arguments[key]);
        else
        {
            source[key] = arguments[key];
        }
    }
};