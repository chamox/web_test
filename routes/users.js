const koaRouter = require('koa-router');
const router = new koaRouter();

// PONER AQUI LOS ROUTER.GET
router.post('user.new', '/new', async(ctx) => {
    const body = await ctx.request.body;
    const new_user = await ctx.body.user.create(body);
    ctx.body = new_user;
})

router.get('users', '/:userId', async(ctx) => {
    const user = await ctx.db.User.findByPk(ctx.params.userId);
    ctx.body =user;
})

module.exports = router;