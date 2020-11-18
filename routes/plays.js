const koaRouter = require('koa-router');
const authenticated = require('../middleware/authenticated');

const router = new koaRouter();

router.post('play.new', '/', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    console.log(body)
    // const new_play = await ctx.db.Play.create(body);

    // validar jugada 
    // ctx.body = new_play;
})

// const verifyMap = () => {
//     let map = await ctx.db.Map.findAll({
//         where: {roomI: ctx.params.roomId}
//     })
// }

module.exports = router;