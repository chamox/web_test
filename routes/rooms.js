const koaRouter = require('koa-router');
const authenticated = require('../middleware/authenticated');
const jwt_decode = require('jwt-decode');


const router = new koaRouter();

router.post('rooms.new', '/new', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    const new_room = await ctx.db.Room.create(body);
    ctx.body = new_room;
})

router.post('rooms.join', '/join', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    const token = await ctx.request.header.authorization;
    let decoded = jwt_decode(token.split(' ')[1]).sub;

    // Revisamos que el usuario no se encuentre en otra room. Si eso pasa, lo eliminamos.
    const userInRoom = await ctx.db.UserRoom.findOne({where: {userId: decoded}})
    if(userInRoom){
        await ctx.db.UserRoom.destroy({
            where: {userId: decoded}
        })
    }
    // Agregamos al usuario a la sala deseada si es que no tiene el maximo de jugadores.
    const usersInRoom = await ctx.db.UserRoom.findAll({where: {roomId: body.roomId}});
    if (usersInRoom.length < 5){
        const joinUser = await ctx.db.UserRoom.create({"roomId": body.roomId, "userId": decoded});
        ctx.body = joinUser;
    }
})

router.get('rooms', '/', authenticated, async(ctx) => {
    const rooms = await ctx.db.Room.findAll();
    ctx.body = rooms;
})

router.get('rooms.users', '/users', authenticated, async(ctx) => {
    const rooms = await ctx.db.UserRoom.findAll();
    ctx.body = rooms;
})

module.exports = router;