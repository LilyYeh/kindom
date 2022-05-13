const server = require('http').createServer();
const io = require('socket.io')(server);
const log = require('simple-node-logger').createSimpleFileLogger('/var/log/node/error.log');

const rs = {};  //各房間裡的使用者(players)

//遊戲狀態
const playersData = {};
const Target = {};
const Token = {};
const scoreCardOrder = {};
const scoreCards = {};
const currentPlayer = {};

// 當發生連線事件
const playerRoom = io.of('socket');
playerRoom.on('connection', (socket) => {
	//log.info("connect success !!");
	playerRoom.emit('connectMsg',{rs:rs});

	// 當發生離線事件
	socket.on('disconnect', () => {
		//離開聊天室
		let thisUser = socket.id;
		let thisRoom = socket.room;
		let thisUserName = rs[thisRoom][thisUser];
		leaveAllRoom(thisRoom,thisUser);
		socket.leave(thisRoom);
		playerRoom.in(thisRoom).emit("system", {rs:rs[thisRoom], players:playersData[thisRoom]});
	});

	socket.on('login',function(data){ //接收連接中的login事件
		//log.info('你發過來的數據是：'+data.playerName+'|'+data.roomName);
		let thisRoom = data['roomName'];
		let thisUserID = socket.id;
		let thisUserName = data['playerName'];
		//document.cookie = 'username='+thisUserName;

		//紀錄thisuser所在聊天室
		socket.room = thisRoom;

		//加入聊天室
		socket.join(thisRoom);
		if (!rs.hasOwnProperty(thisRoom)) {
			rs[thisRoom] = {};
		}
		rs[thisRoom][thisUserID] = thisUserName;
		//socket.players = rs[thisRoom];

		//通知thisroom有新人加入
		playerRoom.in(thisRoom).emit('login',{
			roomName:thisRoom,
			rs:rs[thisRoom],
		});
	});

	socket.on('reConnected',function(data){ //接收連接中的login事件
		let thisRoom = data['roomName'];
		let thisUserID = socket.id;
		let thisUserName = data['playerName'];
		let castleID = data.castleID;

		//紀錄thisuser所在聊天室
		socket.room = thisRoom;

		//加入聊天室
		socket.join(thisRoom);
		if (!rs.hasOwnProperty(thisRoom)) {
			rs[thisRoom] = {};
		}
		rs[thisRoom][thisUserID] = thisUserName;
		//socket.players = rs[thisRoom];

		currentPlayer[thisRoom][castleID] = false;
		playersData[thisRoom][castleID]['playerID'] = thisUserID;

		playerRoom.in(thisRoom).emit('reConnected',{
			Target:Target[thisRoom],
			Token:Token[thisRoom],
			scoreCardOrder:scoreCardOrder[thisRoom],
			scoreCards:scoreCards[thisRoom],
			players:playersData[thisRoom],
			currentPlayer:currentPlayer[thisRoom],
			castleID:castleID
		})
	});

	socket.on('getRoomData',function(){
		let thisRoom = socket.room;
		//let players = socket.players
		let players = rs[thisRoom]

		playerRoom.in(thisRoom).emit('getRoomData',{
			roomName:thisRoom,
			rs:players,
		})
	})

	socket.on('getGameData',function(){
		let thisRoom = socket.room;
		//let players = socket.players
		let players = rs[thisRoom]
		let castleID = 0;

	//-- init data --//
		//卡牌庫
		scoreCards[thisRoom] = {'minus1':{'type':'minus','score':1,'isUsed':false},'minus2':{'type':'minus','score':2,'isUsed':false},'minus3':{'type':'minus','score':3,'isUsed':false},
			'minus4':{'type':'minus','score':4,'isUsed':false},'minus5':{'type':'minus','score':5,'isUsed':false},'minus6':{'type':'minus','score':6,'isUsed':false},
			'add1-1':{'type':'add','score':1,'isUsed':false},'add1-2':{'type':'add','score':1,'isUsed':false},'add2-1':{'type':'add','score':2,'isUsed':false},
			'add2-2':{'type':'add','score':2,'isUsed':false},'add3-1':{'type':'add','score':3,'isUsed':false},'add3-2':{'type':'add','score':3,'isUsed':false},
			'add4-1':{'type':'add','score':4,'isUsed':false},'add4-2':{'type':'add','score':4,'isUsed':false},'add5-1':{'type':'add','score':5,'isUsed':false},
			'add5-2':{'type':'add','score':5,'isUsed':false},'add6-1':{'type':'add','score':6,'isUsed':false},'add6-2':{'type':'add','score':6,'isUsed':false},
			'treasure':{'type':'special', 'name':'寶藏', 'isUsed':false},'dragon':{'type':'special', 'name':'火龍', 'isUsed':false},'witch':{'type':'special', 'name':'巫師', 'isUsed':false},
			'mountain1':{'type':'special', 'name':'山脈', 'isUsed':false},'mountain2':{'type':'special', 'name':'山脈', 'isUsed':false}}

		scoreCardOrder[thisRoom] = shuffleCards(Object.keys(scoreCards[thisRoom]));

		//players 狀態資料
		playersData[thisRoom] = {};
		currentPlayer[thisRoom] = {};

		for(let [playerID, playerName] of Object.entries(players)){
			castleID++;
			myCard = scoreCardOrder[thisRoom][0];
			scoreCardOrder[thisRoom].splice(0,1);
			playersData[thisRoom][castleID] = {playerID:playerID, playerName:playerName, myCard:myCard};

			currentPlayer[thisRoom][castleID] = false;
			if(castleID==1){
				currentPlayer[thisRoom][castleID] = true;
			}
		}
	//-- init data --//

		//通知thisroom有新人加入
		playerRoom.in(thisRoom).emit('getGameData',{
			roomName:thisRoom,
			players:playersData[thisRoom],
			currentPlayer:currentPlayer[thisRoom],
			scoreCards:scoreCards[thisRoom],
			scoreCardOrder:scoreCardOrder[thisRoom]})
	})

	socket.on('start',function(){
		let thisRoom = socket.room;
		playerRoom.in(thisRoom).emit('game')
	})

	socket.on('restart',function(){
		let thisRoom = socket.room;
		playerRoom.in(thisRoom).emit('restart')
	})

	socket.on('putToken',function(data){
		let thisRoom = socket.room;

		Target[thisRoom] = data.Target;
		Token[thisRoom] = data.Token;
		scoreCardOrder[thisRoom] = data.scoreCardOrder;
		scoreCards[thisRoom] = data.scoreCards;

		playerRoom.in(thisRoom).emit('putToken',{
			Target:data.Target,
			Token:data.Token,
			scoreCardOrder:data.scoreCardOrder,
			scoreCards:data.scoreCards
		})
	});
	
	socket.on('nextPlayer',function(data){
		let thisRoom = socket.room;
		currentPlayer[thisRoom] = data.currentPlayer;
		playerRoom.in(thisRoom).emit('nextPlayer',{currentPlayer:data.currentPlayer});
	})
});

server.listen(3000, () => {
	log.info("Server Started");
});

function leaveAllRoom(room,user){
	//for(r in rs) {
	    delete rs[room][user];
		if(Object.keys(rs[room]).length==0){
			delete rs[room];
			if(!playersData[room]) return;
			delete playersData[room];
			delete Target[room];
			delete Token[room];
			delete scoreCardOrder[room];
			delete scoreCards[room];
			delete currentPlayer[room];
		}
	//}
	if(!playersData[room]) return;
	for(let [castleID,playerd] of Object.entries(playersData[room])){
		if(user==playerd.playerID){
			//清空離線的 socket id
			playersData[room][castleID]['playerID']='';
			break;
		}
	}
}

function shuffleCards(arr) {
	for (let i = arr.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}
	return arr;
}