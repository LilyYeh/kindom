<template>
  <div class="game">
    <table class="board" id="target">
      <tr v-for="i in 6" :key="i">
        <td v-for="j in 7" :class="{ score: i==6 || j==7 }" :key="j" :id="'i'+i+'-j'+j" @click="putToken($event)">
          <span v-if="Target['i'+i+'-j'+j]">
            <Castle v-if="Target['i'+i+'-j'+j]['type']=='castle'" :id="Target['i'+i+'-j'+j]['tokenID']" :castleID="Target['i'+i+'-j'+j]['playerCastle']" :castleNum="Target['i'+i+'-j'+j]['castleNum']" :class="{active: myTurn}" @update="takeCastleToken"/>
            <Special v-else-if="Target['i'+i+'-j'+j]['type']=='special'" :id="Target['i'+i+'-j'+j]['tokenID']" :name="scorePool[Target['i'+i+'-j'+j]['tokenID']]['name']" :class="{active: myTurn}" @update="takeScoreToken"/>
            <Score v-else-if="Target['i'+i+'-j'+j]['type']=='score'" :id="Target['i'+i+'-j'+j]['tokenID']" :addOrMinus="scorePool[Target['i'+i+'-j'+j]['tokenID']]['type']" :score="scorePool[Target['i'+i+'-j'+j]['tokenID']]['score']" :class="{active: myTurn}" @update="takeScoreToken"/>
          </span>
          <span v-if="i==6 || j==7">{{total['i'+i+'-j'+j]}}</span>
        </td>
      </tr>
    </table>

    <div class="right-column">
      <div class="game-token">
        <div class="castle">
          <Castle v-for="(val,key) in castlePool" v-show="!val.isUsed" :key="key" :id="key" :castleID="myCastleID" :castleNum="val.castleNum" :class="{active: myTurn && !isPutToken}" @update="takeCastleToken"/>
        </div>
        <Special v-if="nextCard.type=='special'" :id="nextCard.id" :name="showTokenText" :class="{active: myTurn && !isPutToken}" @update="takeScoreToken"/>
        <Score v-else-if="nextCard.type=='add' || nextCard.type=='minus'" :id="nextCard.id" :addOrMinus="nextCard.type" :score="showTokenText" :class="{active: myTurn && !isPutToken}" @update="takeScoreToken"/>

        <span v-if="myCard">
          <Special v-if="myCard.type=='special'" :id="myCard.id" :name="myCard.name" :class="{active: myTurn && !isPutToken}" @update="takeMyCard"/>
          <Score v-else-if="myCard.type=='add' || myCard.type=='minus'" :id="myCard.id" :addOrMinus="myCard.type" :score="myCard.score" :class="{active: myTurn && !isPutToken}" @update="takeMyCard"/>
        </span>

        <div class="playerScore">
          <span v-for="(val,key) in players" :key="key" v-show="val.playerID!=''" :class="{playing : currentPlayer[key]}"> ︎{{val.playerName}} : {{playerScore[key]}}<br></span>
        </div>
      </div>
      <div class="fun">
        <button class="ok" @click="nextPlayer" :disabled="!myTurn || !isPutToken">動作完成，下一位玩家</button>
        <button class="restart" @click="restart">重新一局</button>
      </div>
      <div class="desc">
        <h3>特殊卡牌說明：</h3>
        <ul>
          <li>山脈：隔離</li>
          <li>火龍：只算負分</li>
          <li>巫師：上下左右城堡升級</li>
          <li>寶藏：分數*2倍</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import Castle from '@/components/block/token/Castle.vue';
  import Score from '@/components/block/token/Score.vue';
  import Special from '@/components/block/token/Special.vue';
  //import { reactive, toRaw } from 'vue';

  export default {
    name: 'Game',
    props: {},
    components: {
      Castle,Score,Special
    },
    data() {
      return {
        roomName: "",
        myName:"",
        players: {},        //所有玩家
        currentPlayer: {},
        socketID:this.$socket.id,
        myCastleID:"",

        scorePool: {},      //分數牌庫
        scoreCardOrder: {}, //分數牌庫出牌順序
        Target:{},          //Board 對應的 Token
        Token:{},           //Token 對應的 Board

        isTakeToken: false,  //正在被移動的板塊
        isPutToken: false,   //player已放置板塊
        showTokenText: "?",  //隨機抽牌文字
        isTakeMyCard: false, //選擇手牌
        tokenType: "",       //正在移動的板塊 type(score, castle, special),
        myTakeToken: "",     //正在被移動的 token id
        myPlayerCastle: "",  //正在被移動的城堡(玩家id)
        myCastleNum: "",     //正在被移動的城堡(城堡id)
      }
    },
    sockets: {
      system(data) {
        console.log('system');
        console.log(data);
        this.players = data.players;
      },
      /*connectMsg() {
        if(this.myName){
          this.$socket.emit('reConnected',{castleID:this.myCastleID, playerName:this.myName, roomName:this.roomName});
        }else{
          //location.href = '/kingdom'
        }
      },
      reConnected(data) {
        console.log('reConnected');
        console.log(data);
        this.currentPlayer = data.currentPlayer;
        this.players = data.players;
        if(data.castleID == this.myCastleID){
          this.Target = data.Target;
          this.Token = data.Token;
          this.scorePool = data.scoreCards;
          this.scoreCardOrder = data.scoreCardOrder;
        }
      },*/
      putToken(data) {
        this.Target = data.Target;
        this.Token = data.Token;
        this.scorePool = data.scoreCards;
        this.scoreCardOrder = data.scoreCardOrder;
        this.showTokenText = "?";
      },
      nextPlayer(data) {
        if(data.currentPlayer[this.myCastleID]){
          this.isPutToken = false;
        }
        this.currentPlayer = data.currentPlayer;
      },
      getGameData(data){
        console.log('getGameData')
        this.socketID = this.$socket.id;
        this.roomName = data.roomName;
        this.players = data.players;
        this.currentPlayer = data.currentPlayer;
        this.scorePool = data.scoreCards;
        this.scoreCardOrder = data.scoreCardOrder;
        for(let [playerID,playerData] of Object.entries(data.players)){
          if(this.socketID==playerData.playerID){
            this.myName = playerData.playerName
            this.myCastleID = playerID;
            break;
          }
        }
      },
      restart(){
        this.isTakeToken = false;
        this.isPutToken = false;
        this.Target = {};
        this.Token = {};
        this.showTokenText = "?"

        for(const key of Object.keys(this.castlePool)){
          this.castlePool[key]['isUsed'] = false;
        }
        this.$socket.emit('getGameData');
      }
    },
    methods: {
      putToken(event) {
        //計分格子 || 沒拿token || target 裡有 token
        if(event.target.closest("td").classList.contains('score') || !this.isTakeToken || event.target.childElementCount){
          return;
        }
        this.isTakeToken = false;
        this.showTokenText = "?";

        let target = event.target.id;
        let token = this.myTakeToken;
        if(this.tokenType=='castle'){
          //不是自己的城堡
          if(this.myPlayerCastle!=this.myCastleID){
            return;
          }
          //rm 自己 castlePool 的城堡
          if(!this.castlePool[token]['isUsed']){
            this.isPutToken = true;
          }
          this.castlePool[token]['isUsed'] = true;
        }else{
          //rm scorePool 的方塊
          if(!this.scorePool[token]['isUsed']){
            this.isPutToken = true;
            if(!this.isTakeMyCard){
              this.scoreCardOrder.splice(0,1);
            }
          }
          this.isTakeMyCard = false;
          this.scorePool[token]['isUsed'] = true;
        }

        //移除 token 原所在位置
        delete this.Target[this.Token[token]];

        //更新 token 新位置
        this.Token[token] = target;

        //新增位置放入 token
        if(!this.Target[target]){
          this.Target[target]={}
        }

        this.Target[target]['type'] = this.tokenType;
        this.Target[target]['tokenID'] = token;
        if(this.tokenType=='castle'){
          this.Target[target]['playerCastle'] = this.myPlayerCastle;
          this.Target[target]['castleNum'] = this.myCastleNum;
        }

        this.$socket.emit('putToken',{Target:this.Target,Token:this.Token,scoreCardOrder:this.scoreCardOrder,scoreCards:this.scorePool});
      },
      takeMyCard(val) {
        if(!this.setTakeToken(val.token)) return;

        this.isTakeToken = true;
        this.myTakeToken = val.token;
        this.isTakeMyCard = true;
        this.tokenType = 'score';
        if(this.scorePool[val.token]['type']=="special"){
          this.tokenType = 'special';
        }
      },
      takeCastleToken(val) {
        if(!this.setTakeToken(val.token)) return;

        this.isTakeToken = true;
        this.myTakeToken = val.token;
        this.tokenType = 'castle';
        this.myPlayerCastle = val.playerCastle;
        this.myCastleNum = val.castleNum;
      },
      takeScoreToken(val) {
        if(!this.setTakeToken(val.token)) return;

        this.isTakeToken = true;
        this.myTakeToken = val.token;
        if(this.scorePool[val.token]['type']=="special"){
          this.tokenType = 'special';
          if(!this.scorePool[val.token]['isUsed']) {
            this.showTokenText = this.nextCard.name;
          }
        }else{
          this.tokenType = 'score';
          if(!this.scorePool[val.token]['isUsed']) {
            this.showTokenText = this.nextCard.score;
          }
        }
      },
      setTakeToken(token) {
        if(!this.myTurn) return false;
        if(this.isPutToken && document.getElementById(token).closest('.game-token')) return false;
        if(this.showTokenText!=="?") return false;
        return true;
      },
      nextPlayer() {
        this.currentPlayer[this.myCastleID] = false;

        let p = Object.keys(this.currentPlayer);
        let isFind = false;
        let nextPlayerID = parseInt(this.myCastleID)+1;
        for(let i=nextPlayerID; i <= p.length; i++){
          if(this.players[i]['playerID']!=='') {
            this.currentPlayer[i] = true;
            isFind = true;
            break;
          }
        }
        if(!isFind){
          for(let i=1; i <= p.length; i++){
            if(this.players[i]['playerID']!=='') {
              this.currentPlayer[i] = true;
              isFind = true;
              break;
            }
          }
        }
        this.$socket.emit('nextPlayer',{currentPlayer:this.currentPlayer});
      },
      restart() {
        this.$socket.emit('restart');
      },
    },
    computed: {
      myTurn() {
        return this.currentPlayer[this.myCastleID];
      },
      myCard() {
        let playerData = {...this.players[this.myCastleID]};
        let myCard = playerData.myCard;
        let scorePool = {...this.scorePool[myCard]}
        if(scorePool.isUsed){
          return {};
        }
        let card = {...this.scorePool[myCard]}
        if(card.type=='special'){
          return {id:myCard,type:card.type,name:card.name};
        }
        return {id:myCard,type:card.type,score:card.score};
      },
      castlePool() {
        var castlePool = {};
        for(var i=1; i<=4; i++){
          castlePool['castle'+this.myCastleID+'-'+i+'-1'] = {castleNum:i,isUsed:false};
        }
        return castlePool;
      },
      nextCard() {
        let card = {...this.scorePool[this.scoreCardOrder[0]]}
        if(card.type=='special'){
          return {id:this.scoreCardOrder[0],type:card.type,name:card.name};
        }
        return {id:this.scoreCardOrder[0],type:card.type,score:card.score};
      },
      witchTarget() {
        let castleAdd = [];
        //巫師
        if(this.Token['witch']){
          let witchTarget = this.Token['witch'];
          let ij = witchTarget.replace('i','').replace('j','').split("-");
          let target_i = parseInt(ij[0]);
          let target_j = parseInt(ij[1]);
          var p;
          if(target_i>1) {
            p = target_i-1
            castleAdd['i'+p+'-j'+target_j]=1;
          }
          if(target_j>1) {
            p = target_j-1
            castleAdd['i'+target_i+'-j'+p]=1;
          }
          if(target_i<5) {
            p = target_i+1
            castleAdd['i'+p+'-j'+target_j]=1;
          }
          if(target_j<6) {
            p = target_j+1
            castleAdd['i'+target_i+'-j'+p]=1;
          }
        }
        return castleAdd;
      },
      playerScore() {
        let playerScore = {};
        for(let playerID of Object.keys(this.players)){
          playerScore[playerID]=0
        }
        let score,token,myArray,playerCastleID,castleScore;
        for(let i=1; i<=5; i++){
          let k = 0;
          for(let j=1; j<=6; j++){
            if(this.Target['i'+i+'-j'+j]){
              let val = this.Target['i'+i+'-j'+j];
              if(/mountain/.test(val.tokenID)){
                k++;
              }
              if(/castle/.test(val.tokenID)){
                token = val.tokenID.replace('castle', '');
                myArray = token.split("-");
                playerCastleID = parseInt(myArray[0]);
                castleScore = parseInt(myArray[1]);
                if(this.witchTarget['i'+i+'-j'+j]){
                  castleScore+=1;
                }
                score = this.total['i'+i+'-j7'][k];
                playerScore[playerCastleID] += score * castleScore;
              }

            }
          }
        }

        for(let j=1; j<=6; j++){
          let k = 0;
          for(let i=1; i<=5; i++){
            if(this.Target['i'+i+'-j'+j]){
              let val = this.Target['i'+i+'-j'+j];
              if(/mountain/.test(val.tokenID)){
                k++;
              }
              if(/castle/.test(val.tokenID)){
                token = val.tokenID.replace('castle', '');
                myArray = token.split("-");
                playerCastleID = parseInt(myArray[0]);
                castleScore = parseInt(myArray[1]);
                if(this.witchTarget['i'+i+'-j'+j]){
                  castleScore+=1;
                }
                score = this.total['i6-j'+j][k];
                playerScore[playerCastleID] += score * castleScore;
              }
            }
          }
        }
        return playerScore;
      },
      total() {
        //計算行列的分數
        let n = {};
        let dragon = {};
        let treasure = {};
        let minus = {};
        for(let i=1; i<=5; i++){
          n['i'+i+'-j7']=[0];
          minus['i'+i+'-j7']=[0];

          if(!dragon['i'+i+'-j7']){
            dragon['i'+i+'-j7'] = {};
          }
          if(!treasure['i'+i+'-j7']){
            treasure['i'+i+'-j7'] = {};
          }

          for(let j=1; j<=6; j++){
            if(!n['i6-j'+j]){
              n['i6-j'+j]=[0];
              minus['i6-j'+j]=[0];

              if(!dragon['i6-j'+j]){
                dragon['i6-j'+j] = {};
              }
              if(!treasure['i6-j'+j]){
                treasure['i6-j'+j] = {};
              }
            }

            if(this.Target['i'+i+'-j'+j]){
              let val = this.Target['i'+i+'-j'+j];
              var score;
              if(val.type=='score'){
                if(this.scorePool[val.tokenID]['type'] == 'add'){
                  if(!dragon['i'+i+'-j7'][n['i'+i+'-j7'].length-1]){
                    score = this.scorePool[val.tokenID]['score'];
                    if(treasure['i'+i+'-j7'][n['i'+i+'-j7'].length-1]){
                      score *= 2;
                    }

                    n['i'+i+'-j7'][n['i'+i+'-j7'].length-1]+=score;
                  }
                  if(!dragon['i6-j'+j][n['i6-j'+j].length-1]){
                    score = this.scorePool[val.tokenID]['score'];
                    if(treasure['i6-j'+j][n['i6-j'+j].length-1]){
                      score *= 2;
                    }

                    n['i6-j'+j][n['i6-j'+j].length-1]+=score;
                  }
                }else if(this.scorePool[val.tokenID]['type'] == 'minus') {
                  score = this.scorePool[val.tokenID]['score'];
                  if(treasure['i'+i+'-j7'][n['i'+i+'-j7'].length-1]){
                    score *= 2;
                  }
                  n['i'+i+'-j7'][n['i'+i+'-j7'].length-1]-=score;
                  minus['i'+i+'-j7'][minus['i'+i+'-j7'].length-1]-=score;

                  score = this.scorePool[val.tokenID]['score'];
                  if(treasure['i6-j'+j][n['i6-j'+j].length-1]){
                    score *= 2;
                  }
                  n['i6-j'+j][n['i6-j'+j].length-1]-=score;
                  minus['i6-j'+j][minus['i6-j'+j].length-1]-=score;
                }
              }
              if(/mountain/.test(val.tokenID)){
                n['i'+i+'-j7'].push(0);
                minus['i'+i+'-j7'].push(0);
                n['i6-j'+j].push(0);
                minus['i6-j'+j].push(0);
              }

              if(/dragon/.test(val.tokenID)){
                dragon['i'+i+'-j7'][n['i'+i+'-j7'].length-1]='x';
                dragon['i6-j'+j][n['i6-j'+j].length-1]='x';
                n['i'+i+'-j7'][n['i'+i+'-j7'].length-1] = minus['i'+i+'-j7'][minus['i'+i+'-j7'].length-1];
                n['i6-j'+j][n['i6-j'+j].length-1] = minus['i6-j'+j][minus['i6-j'+j].length-1];
              }

              if(/treasure/.test(val.tokenID)){
                treasure['i'+i+'-j7'][n['i'+i+'-j7'].length-1]='x';
                treasure['i6-j'+j][n['i6-j'+j].length-1]='x';

                n['i'+i+'-j7'][n['i'+i+'-j7'].length-1]*=2;
                n['i6-j'+j][n['i6-j'+j].length-1]*=2;
              }
            }
          }
        }

        return n;
      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .game {
    width:100%;
  }
  table.board {
    width: 60%;
    display: table;
    float: left;
  }
  table.board > tr {

  }
  table.board > tr > td {
    border: 1px solid black;
    width: 120px;
    height: 110px;
    cursor: pointer;
  }
  table.board .area {
    float: left;
    width: 120px;
    height: 110px;
    margin: 4px;
  }
  table.board .score {
    border: 0px;
    width: 83px
  }
  .right-column{
    display: inline-block;
    float: right;
    width: 39%;
  }
  .game-token {
    min-height: 264px;
    border: 1px solid black;
    position: relative;
  }
  .token {
    float: left;
    border: 1px solid black;
    /*width: 120px;
    height: 110px;*/
    width: 125.5px;
    height: 114px;
    margin: -2px -4px -2px -2px;
    cursor: pointer;
    font-weight: bold;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  /*.token:hover, .token:focus {
    border: 8px solid;
    border-image: linear-gradient(45deg, turquoise, greenyellow) 1;
  }*/
  .game-token .token {
    margin: 8px;
  }
  .castle{
    display: flex;
  }
  .playerScore {
    position: absolute;
    right: 10px;
    bottom: 10px;
    text-align: left;
  }
  .playerScore > span.playing {
    margin-left: -17px ;
  }
  .playerScore > span.playing:before {
    content: "✈︎";
  }
  .fun {
    display: flow-root;
  }
  .fun button {
    cursor: pointer;
    margin-top:10px;
    padding: 3px 10px;
  }
  .fun .restart {
    float: right;
  }
  .fun .ok {
    float: left;
  }
  .desc{
    margin: 40px 0;
    width: 40%;
    text-align: left;
  }
  .active:hover, .active:focus {
    border: 8px solid;
    border-image: linear-gradient(45deg, turquoise, greenyellow) 1;
  }
  @media screen and (max-width: 768px){
    .game {
      display: inline-block;
      width: 359px;
    }
    table.board {
      width: 100%
    }
    table.board > tr > td {
      max-width: 1px;
      height: 50px;
    }
    .right-column {
      width: 100%
    }
    table.board .score {
      display: none;
    }
    .token {
      width: 57.5px;
      height: 54px;
      margin: -2px;
    }
    .desc {
      width: 62%
    }
  }
</style>
