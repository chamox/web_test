const koaRouter = require('koa-router');
const router = new koaRouter();


router.get('maps', '/:roomId', async(ctx) => {
    const map = await ctx.db.Map.findOrCreate({
        where: {roomId: roomId}
    });
    ctx.body = map;
})

module.exports = router;