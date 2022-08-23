<template>
	<!--remove @click="takeToken($event)"-->
	<button class="token castle" :class="'castle-'+castleID">城堡 x{{castleNum}}</button>
</template>

<script>
	export default {
		name: 'Castle',
		props: {
			castleID: String,
			castleNum: Number,
		},
		/*data() {
		  return {
			isTakeToken:false,
			token:""
		  }
		},*/
		/*methods: {
		  takeToken(event) {
			event.stopPropagation();
			this.isTakeToken=!this.isTakeToken;
			this.token = event.target.id;
		  }
		},*/
		/*watch: {
		  isTakeToken: {
			handler() {
			  console.log('isTakeToken')
			  this.$emit('update', {token:this.token,playerCastle:this.castleID,castleNum:this.castleNum});
			}
		  }
		}*/
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.castle {
		color:white;
	}
	.castle-1{
		background: #6C3365;
	}
	.castle-2{
		background: #004B97;
	}
	.castle-3{
		background: #336666;
	}
	.castle-4{
		background: #467500;
	}
</style>
