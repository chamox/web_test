const koaRouter = require('koa-router');
const jwt = require('jsonwebtoken');
const bodyParser = require('koa-bodyparser');
const bcrypt = require('../utilities/bcrypt');

const router = new koaRouter();
const secret = process.env.JWT_SECRET || 'secret';
const wrongUserPassMsg = 'Incorrect username and/or password.';


router.post('auth', '/', bodyParser(), async (ctx) => {
    const { email, password } = ctx.request.body;
    if (!email) ctx.throw(422, 'Email required.');
    if (!password) ctx.throw(422, 'Password required.');

    const dbUser = await ctx.db.User.findOne({where: {email: email}});
    if (!dbUser) ctx.throw(401, wrongUserPassMsg);
    if(await bcrypt.compare(password, dbUser.passwordHash)){
        const payload = { sub: dbUser.id };
        const token = jwt.sign(payload, secret);
        ctx.body = token;   
    }else{
        ctx.throw(401, wrongUserPassMsg);
    }   
})


module.exports = router;