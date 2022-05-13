<template>
  <form id="enter">
    輸入暱稱：<input type="text" v-model="playerName"><br>
    輸入房間ID：<input type="text" v-model="roomName"><br>
    <button type="button" @click="Login()">送出</button>
  </form>
</template>

<script>

  export default {
    data() {
      return {
        playerName:"Lily Yeh",
        roomName:"room",
        socketID:""
      }
    },
    sockets: {
      connect() {
        //console.log('socket to notification channel connected');
        this.sockets.subscribe('connectMsg', (data) => {
          console.log(data);
        });
      },
      login() {
        this.$router.push('/waitingroom')
      }
    },
    methods: {
      Login() {
        this.$socket.emit('login',{playerName:this.playerName, roomName:this.roomName});
      }
    },
    mounted() {},
    computed: {},
  }
</script>