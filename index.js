const express = require('express')
const app = express()
const http = require('http').createServer(app); // ← thêm
var flash = require('express-flash')
const path = require('path');

require('dotenv').config();

const port = process.env.PORT || 3000;
const systemConfig = require('./config/system.js')

const routerAdmin = require('./routers/admin/index.route.js')
const router = require('./routers/client/route_index')
const methodOverride = require("method-override")
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const moment = require("moment");
const database = require("./config/database");

// ← THÊM SOCKET.IO
const { Server } = require("socket.io");
const io = new Server(http);
global._io = io;
require("./sockets/index.socket.js")(io);
// ← HẾT SOCKET.IO

app.use(cookieParser("12345"));
app.use(expressSession({ secret: '12345', resave: false, saveUninitialized: false, cookie: { maxAge: 60000 } }));
app.use(flash());
app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json());
app.use(methodOverride("_method"));
app.locals.prefixAdmin = systemConfig.prefixAdmin;
app.locals.moment = moment;
database.connect();
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "pug")

router(app)
routerAdmin(app)

// ← ĐỔI app.listen → http.listen
http.listen(port, () => {
    console.log(`example listening on ${port}`);
})