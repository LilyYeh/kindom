<template>
	<h3>王國</h3>
	<Login v-show="isShowLogin"/>
	<WaitingRoom v-show="isShowWaiting"/>
	<Game v-show="isShowGame"/>
</template>

<script>
	import Login from '@/components/block/Login.vue';
	import WaitingRoom from '@/components/block/WaitingRoom.vue';
	import Game from '@/components/block/Game.vue';

	export default {
		components: {
			Login,WaitingRoom,Game
		},
		data() {
			return {
				isShowLogin:true,
				isShowWaiting:false,
				isShowGame:false,
			}
		},
		sockets: {
			connect() {
				//console.log('socket to notification channel connected');
				/*this.sockets.subscribe('connectMsg', (data) => {
					console.log(data);
				});*/
			},
			login() {
				this.isShowLogin = false;
				this.isShowWaiting = true;
				this.isShowGame = false;
			},
			getGameData() {
				this.isShowLogin = false;
				this.isShowWaiting = false;
				this.isShowGame = true;
			}
		},
		methods: {},
		mounted() {},
		computed: {},
	}
</script>