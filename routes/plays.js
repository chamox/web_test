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

const canMove = (finalElement) => {
    if (finalElement === 0){
        return true
    }else{
        return false
    }        
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
    const mapRoom = await ctx.db.Map.findOne({where: {roomId: body.room}})
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
    let decoded = jwt_decode(token.split(' ')[1]).sub;
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
    else if(body.move === "Arriba"){
        new_position = position - 10;
    }
    else if(body.move === "Derecha"){
        new_position = position + 1;
    }
    else if(body.move === "Izquierda"){
        new_position = position - 1;
    }
    else if(body.move === "None"){
        console.log("none selected");
        new_position = position;
    }

    // Acá obtenemos el element de new_position
    let finalElement;
    if(new_position >= 1 && new_position <= 100){
        let getElementNew = await ctx.db.Map.findOne({where: {position: new_position}});
        finalElement = getElementNew.dataValues.element;

    }else{
        finalElement = -1
    }
    
    if (canMove(finalElement)){
        
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

    }
})



module.exports = router;