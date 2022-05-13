<template>
  <form id="enter">
    輸入暱稱：<input type="text" v-model="playerName"><br>
    輸入房間ID：<input type="text" v-model="roomName"><br>
    <button type="button" @click="Login()">送出</button>
  </form>
</template>

<script>
  export default {
    name: 'Login',
    data() {
      return {
        playerName:"Lily Yeh",
        roomName:"room",
      }
    },
    sockets: {},
    methods: {
      Login() {
        this.$socket.emit('login',{playerName:this.playerName, roomName:this.roomName});
      }
    },
  }
</script>