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
      login(data) {
        this.roomName = data.roomName;
        this.players = data.rs;
      }
    },
    methods: {
      start() {
        console.log('start')
        this.$socket.emit('getGameData');
      }
    },
  }
</script>