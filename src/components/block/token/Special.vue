<template>
	<button class="token special" @click="takeToken($event)">{{name}}</button>
</template>

<script>
	export default {
		name: 'Score',
		props: {
			name: String,
		},
		data() {
			return {
				isTakeToken:false,
				token:""
			}
		},
		methods: {
			takeToken(event) {
				event.stopPropagation();
				this.isTakeToken=!this.isTakeToken;
				this.token = event.target.id;
			}
		},
		computed: {},
		watch: {
			isTakeToken: {
				handler() {
					console.log('isTakeToken')
					this.$emit('update', {token:this.token});
				}
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	
</style>
