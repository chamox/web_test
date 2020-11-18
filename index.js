'use strict';

var session = require('koa-session');
const Koa = require('koa');
const cors = require('@koa/cors');
const koaRouter = require('koa-router')
const koaBody = require('koa-body');
const routes = require('./routes');
const errorHandler = require('./middleware/errorHandler');


const app = new Koa();
const router = new koaRouter()

app.keys = ['Shh, its a secret!'];
app.use(cors());
app.use(session(app));
app.use(errorHandler);

const db = require('./models');

const PORT = 3000;

db.sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfull')
    app.listen(PORT, (err) => {
      if (err){
        return console.error('Failed', err);
      }
      console.log(`Listening on port ${PORT}`);
      return app;
    });
  })
  .catch((err) => console.error('Unable to connect to the database:', err));
  
app.use(koaBody());
app.context.db = db;
app.use(routes.routes());

router.get('koala', '/', (ctx) => {
    ctx.body = "Welcome! To the Koala Book of Everything!"
  })


router.get('koala', '/es', (ctx) => {
ctx.body = "Bienvenido"
})
  
app.use(router.routes())
  .use(router.allowedMethods())

// app.listen(3000);