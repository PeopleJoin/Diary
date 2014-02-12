require("./lib/JSON");

var mysql = require("./mysql");
var apis = require("./sites/api");
var server = require("./server");
var handles = require("./sites/sites");
var route = require("./route");

global.Route = new route.Route(handles.Handles, "./Diary/sites/");
global.Server = new server.Server(8888);
global.MySQL = new mysql.MySQL({host: "localhost", user: "root", password: "1", database: "diary"});

Route.AddHandle(apis.Apis, "api");