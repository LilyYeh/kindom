<template>
  <div id="waiting">
    等待玩家進入{{roomName}}...
    <p v-for="(player,index) in players" :key="index">{{player+"進入聊天室"}}</p>
    <button v-if="Object.keys(players).length>=2" class="start" @click="start()">遊戲開始</button>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        roomName: '',
        players: {},          //所有玩家
      }
    },
    sockets: {
      connectMsg() {
        if(this.roomName){
          //this.$socket.emit('reConnected',{castleID:this.myCastleID, playerName:this.myName, roomName:this.roomName});
        }else{
          location.href = '/login'
        }
      },
      system(data) {
        this.players = data.rs;
      },
      getRoomData(data){
        console.log('getRoomData');
        console.log(data);
        this.roomName = data.roomName;
        this.players = data.rs;
      },
      game(){
        this.$router.push('/game')
      }
    },
    methods: {
      start() {
        console.log('start')
        this.$socket.emit('start');
      }
    },
    mounted() {
      this.$socket.emit('getRoomData');
    },
    computed: {},
  }
</script>