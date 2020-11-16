const koaRouter = require('koa-router');
const router = new koaRouter();

// PONER AQUI LOS ROUTER.GET
router.post('users.new', '/new', async(ctx) => {
    const body = await ctx.request.body;
    const new_user = await ctx.db.User.create(body);
    ctx.body = new_user;
})

router.get('users', '/:userId', async(ctx) => {
    const user = await ctx.db.User.findByPk(ctx.params.userId);
    ctx.body =user;
})

module.exports = router;