import createError from 'http-errors';
import express from'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from "cors";
import { fileURLToPath } from 'url';
import { sendContactEmail } from "./services/emailService.js";

import userRouter from './modules/user/user.routes.js';

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

app.post("/contact", async (req, res) => {
  try {
    const { nombre, telefono, email, mensaje } = req.body;
    await sendContactEmail({ nombre, telefono, email, mensaje });
    res.json({ ok: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false });
  }
});
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
