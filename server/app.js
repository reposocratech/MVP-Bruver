import userTestRouter from "./modules/user/user.comprobar.routes.js";

import createError from 'http-errors';
import express from'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

//Cambiar


import appointmentRouter from "./modules/appointment/appointment.routes.js";
import petRouter from "./modules/pet/pet.routes.js";
import userRouter from './modules/user/user.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/user', userRouter);
app.use('/', userRouter);
app.use("/pet", petRouter);
app.use("/appointment", appointmentRouter);

app.use("/user", userTestRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json(err);
});

export default app;
