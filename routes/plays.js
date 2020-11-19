const koaRouter = require('koa-router');
const authenticated = require('../middleware/authenticated');
const jwt_decode = require('jwt-decode');

const router = new koaRouter();

const blankMap = () => {
    var board = [];
    for(var i=0; i<=9; i++) {
        board[i] = [];
        for(var j=0; j<=9; j++) {
            board[i][j] = 0
        }
    }
    return board
}
  
const getPlayerId = async(ctx, userEmail) => {
    const dbUser = await ctx.db.User.findOne({where: {email: userEmail}})
    console.log("player id: ", dbUser.dataValues.id);
    return dbUser.dataValues.id;
}

const setInitialMap = async (roomData, map, ctx) => {
    for(var i=0; i<=9; i++) {
        for(var j=0; j<=9; j++) {
             map[i][j] = {element: 0, roomId: roomData.room, position: i*10+j+1 }
        }
    }  
  
    portCoords = [9,9,4,9,0,9,9,0,4,0,0,0];
    shipCoords = [8,9,5,9,1,9,8,0,5,0,1,0];
    idList = roomData.userEmails;

    islandCoords = [3,3,9,3,7,4,5,5,1,5,9,6,3,6,6,7];
    var islandId = 0; 
    
    while (islandCoords.length){
        var x1 = islandCoords.pop();
        var y1 = islandCoords.pop();

        map[x1][y1].element = 3;
        map[x1][y1].roomId = roomData.room;
        map[x1][y1].description = islandId;
        islandId++;
    }
  
    for (var i = 0; i <= roomData.userEmails.length + 1; i++){
        
        var x0 = portCoords.pop();
        var y0 = portCoords.pop()

        map[x0][y0].element = 1;
        map[x0][y0].roomId = roomData.room;

        var x = shipCoords.pop();
        var y = shipCoords.pop();
        map[x][y].element = 2;
        let playerId =  await getPlayerId(ctx, idList.pop());
        console.log("PLAYERS IDS: ", playerId);
        console.log("for print: ** ", playerId );
        map[x][y].description = playerId
        map[x][y].roomId = roomData.room;
        
    }
    return map;
  }
  

router.post('play.start', '/start', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    mapRoom = await ctx.db.Map.findOne({where: {roomId: body.room}})
    if(!mapRoom){
        let map = blankMap();
        let board = await setInitialMap(body, map, ctx);
        for (let row of board){
            for (let col of row){
            const new_cell = await ctx.db.Map.create(col); 
            }
        }
        const ans = await ctx.db.Map.findAll({where: {roomId: body.room}});
        ctx.body = ans;
    }
    
})

// Juagada de un usuario
router.post('play.new', '/', authenticated, async(ctx) => {
    const body = await ctx.request.body;
    const token = await ctx.request.header.authorization;
    decoded = jwt_decode(token.split(' ')[1]).sub;
    console.log("request: ", decoded);
    let map = await ctx.db.Map.findAll({
        where: {roomId: body.room}
    })
    let get_user_position = await ctx.db.Map.findOne(
        {
            where: {
                element: 2, 
                description: decoded.toString()
            }
        }
    );
    let position = get_user_position.dataValues.position;
    let new_position;

    if(body.move === "Abajo"){
        new_position = position + 10;
    }
    if(body.move === "Arriba"){
        new_position = position - 10;
    }
    if(body.move === "Derecha"){
        new_position = position + 1;
    }
    if(body.move === "Izquierda"){
        new_position = position - 1;
    }
    if(body.move === "None"){
        console.log("none selected");
        new_position = position;
    }

    // Ponemos el barco en la nueva posicion, modificando el elemento y la descripcion
    await ctx.db.Map.update({element: 2}, {
        where: {roomId: body.room, position: new_position}
    });

    await ctx.db.Map.update({description: decoded}, {
        where: {roomId: body.room, position: new_position}
    });

    // Sacamos el barco de la antigua posicion, cambiando su elemento a Sea (0).
    await ctx.db.Map.update({element: 0}, {
        where: {roomId: body.room, position: position}
    });


    // const new_play = await ctx.db.Play.create(body);

    // validar jugada 
    // verifyMap(decoded, user_position.dataValues.position, body.room, body.move, map)
    // ctx.body = new_play;
})

// const verifyMap = async (userId, position, room, movement, map) => {
    
//     console.log("position: ", position)
//     console.log("room: ", room);
//     console.log("movement: ", movement);
//     console.log("user id: ", userId);
    // if( position === 1 ){
    //     // Revisar abajo y derecha
    // }else if( position ===  10){
    //     // Revisar abajo e izquierda 
    // }else if(position === 91){
    //     // Revisar arriba derecha
    // }else if(position === 100){
    //     // Revusar arriba izquierda
    // }else if(position%10 === 0){
    //     // revisar izquierda, arriba, abajo
    // }else if(position%)



module.exports = router;