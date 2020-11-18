const koaRouter = require('koa-router');
const authenticated = require('../middleware/authenticated');

const router = new koaRouter();

router.get('map', '/:roomId', authenticated, async(ctx) => {
    const map = await ctx.db.Map.findAll({
        where: {roomId: ctx.params.roomId}
    });
    ctx.body = map;
})

module.exports = router;