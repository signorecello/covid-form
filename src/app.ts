
import createError from 'http-errors';
import express from "express";
import { Request, Response, NextFunction } from "express";
import path from 'path';
import cookieParser from "cookie-parser";
import logger from "morgan";
import bodyParser from "body-parser"

require("dotenv").config({ path: ".env" });

const https = require('https');
const fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

const { auth, requiresAuth } = require("express-openid-connect");

app.use(
  auth({
    required: false,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
    baseURL: process.env.AUTH0_BASEURL,
    clientID: process.env.AUTH0_CLIENT_ID,
    appSession: {
      secret: process.env.AUTH0_CLIENT_SECRET
    }
  })
);

require("./routes/index")(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err: { message: any; status: any; }, req : Request, res : Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


console.log("Listening on port" + process.env.PORT);
app.listen(process.env.PORT);

