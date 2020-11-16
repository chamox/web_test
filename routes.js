const koaRouter = require('koa-router');
const { routes } = require('./routes/orders');
const router = new koaRouter();

const orders = require('./routes/orders');
const users = require('./routes/users');

router.use('/orders', orders.routes());
router.use('/users', users.routes());

module.exports = router;