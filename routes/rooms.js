const koaRouter = require('koa-router');
const authenticated = require('../middleware/authenticated');

const router = new koaRouter();

router.post('rooms.new', '/new', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    const new_room = await ctx.db.Room.create(body);
    ctx.body = new_room;
})

// router.post('rooms.join', '/join', authenticated, async(ctx) => ){

// }

router.get('rooms', '/', authenticated, async(ctx) => {
    const rooms = await ctx.db.Room.findAll();
    ctx.body = rooms;
})

module.exports = router;