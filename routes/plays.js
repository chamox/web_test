const koaRouter = require('koa-router');
const authenticated = require('../middleware/authenticated');

const router = new koaRouter();

router.post('play.new', '/new', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    // const new_play = await ctx.db.Play.create(body);

    // validar jugada 
    ctx.body = new_play;
})


module.exports = router;