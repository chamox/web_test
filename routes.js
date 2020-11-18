const koaRouter = require('koa-router');
const { routes } = require('./routes/orders');
const router = new koaRouter();

const orders = require('./routes/orders');
const users = require('./routes/users');
const rooms = require('./routes/rooms');
const auth = require('./routes/auth');
const map = require('./routes/map')


router.use('/orders', orders.routes());
router.use('/users', users.routes());
router.use('/rooms', rooms.routes());
router.use('/auth', auth.routes());
router.use('/map', map.routes());


module.exports = router;