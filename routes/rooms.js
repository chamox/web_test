const koaRouter = require('koa-router');
const router = new koaRouter();

// PONER AQUI LOS ROUTER.GET
router.post('rooms.new', '/new', async(ctx) => {
    const body = await ctx.request.body;
    const new_room = await ctx.db.Room.create(body);
    ctx.body = new_room;
})

router.get('rooms', '/', async(ctx) => {
    const rooms = await ctx.db.Room.findAll();
    ctx.body = rooms;
})

module.exports = router;