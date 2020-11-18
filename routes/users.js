const koaRouter = require('koa-router');
const router = new koaRouter();
const bcrypt = require('bcrypt');
const saltRounds = 10;


router.post('users.new', '/new', async(ctx) => {
    const body = await ctx.request.body;
    if(!body.username) ctx.throw(422, 'Username required.');
    if(!body.email) ctx.throw(422, 'Email required.');
    if(!body.password) ctx.throw(422, 'Password required.');

    const dbUser = await ctx.db.User.findOne({where: {email: body.email}});
    if(dbUser) ctx.throw(422, 'Email Alredy Exists.');

    bcrypt.hash(body.password, saltRounds, async function(err, hash) {
      if(err) console.log(err); 
      body.passwordHash = hash;
      const new_user = await ctx.db.User.create(body);
      ctx.body = new_user;
    });
});     



router.get('users', '/:userId', async(ctx) => {
    const user = await ctx.db.User.findByPk(ctx.params.userId);
    ctx.body = user;
})

module.exports = router;