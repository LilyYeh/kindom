<template>
	<button class="token" :class="'score-'+addOrMinus+' '+black" @click="takeToken($event)">{{boardText}}</button>
</template>

<script>
	export default {
		name: 'Score',
		props: {
			addOrMinus: String,
			score: [Number, String],
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
		computed: {
			boardText() {
				if(this.score=="?") {
					return this.score;
				}
				if(this.addOrMinus=='minus'){
					return '-'+this.score;
				}else{
					return '+'+this.score;
				}
			},
			black() {
				if(this.score=="?") {
					return 'black';
				}
				return '';
			}
		},
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
	.score-minus {
		color: red;
	}
	.score-add {
		color:blue;
	}
	.black {
		color:black !important;
	}
</style>
