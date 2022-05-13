import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueSocketIO from 'vue-3-socket.io'
import SocketIO from 'socket.io-client'

createApp(App).use(router).use(store).use(new VueSocketIO({
	debug: true,
	connection: SocketIO('http://'+window.location.hostname+'/socket'),
	vuex: {
		store,
		actionPrefix: "SOCKET_",
		mutationPrefix: "SOCKET_"
	}
})).mount('#app')