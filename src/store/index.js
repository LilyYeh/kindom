import { createApp } from 'vue'
import App from '../App.vue'
import { createStore } from 'vuex'

createApp(App).use(createStore)

export default createStore({
	state: {
		store: 'Vuex',
		rs: {} //各房間裡的使用者(roomPlayers)
	},
	getters: {},
	mutations: {
		"<MUTATION_PREFIX><EVENT_NAME>"() {
			// do something
		},
		/*rsUpdate(state, val){
			let roomName = val.roomName;
			let socketID = val.socketID;
			let playerName = val.playerName;
			if (!rs.hasOwnProperty(roomName)) {
				rs[roomName] = {};
			}
			state.rs[roomName]['socketID'] = socketID;
			state.rs[roomName]['playerName'] = playerName;
		}*/
	},
	actions: {
		"<ACTION_PREFIX><EVENT_NAME>"() {
			// do something
		}
	},
	modules: {
	}
})