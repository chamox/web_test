'use strict';

const Koa = require('koa');
const koaRouter = require('koa-router')

const app = new Koa();
const router = new koaRouter()

router.get('koala', '/', (ctx) => {
    ctx.body = "Welcome! To the Koala Book of Everything!"
  })

router.get('koala', '/es', (ctx) => {
ctx.body = "Bienvenido"
})
  
app.use(router.routes())
  .use(router.allowedMethods())

app.listen(3000);