<template>
	<div class="cartcontrol">
		<transition name="move">
			<div class="cart-decrease" v-show="foods.count>0" @click.stop.prevent="decreaseCart">
				<i class="inner icon-remove_circle_outline"></i>
			</div>
		</transition>
		<div class="cart-count" v-show="foods.count>0">{{foods.count}}</div>
		<div class="cart-add icon-add_circle" @click.stop.prevent="addCart"></div>
	</div>
</template>

<script>
	import Vue from 'vue';

	export default {
		props: {
			foods:{
				type:Object
			}
		},
		methods:{
			addCart:function(event){
				if(!event._constructed){
					return;
				};
				//用vue.set(obj,key,value)去监听一个对象内部存在的变量
				//count不存在所以不能对其进行操作
				//需要引用vue
				if(typeof this.foods.count == 'undefined'){
					Vue.set(this.foods,'count',1);//添加count属性
				}else{
					this.foods.count++;
				};

				//子组件通过$emit来触发事件，将参数传递出去$emit(event,args)
				this.$emit('add',event.target);//add->派发的事件 event.target->参数
			},
			decreaseCart:function(event){
				if(!event._constructed){
					return;
				};

				if(this.foods.count){
					this.foods.count--;
				}
			}
		}
	}
</script>

<style lang="scss" rel="stylesheet/scss">
	.cartcontrol{
		font-size: 0;
		.cart-decrease{
			display:inline-block;
			padding:6px;
			&.move-enter-active,&.move-leave-active{
				transition:all .5s linear;
				opacity:1;
				transform:translate3D(0,0,0);
			}
			.inner{
				display: inline-block;
				font-size:24px;
				line-height:24px;
				color:rgb(0,160,220);
				transition: all .4s linear;
				transform:rotate(0);
			}
			&.move-enter,&.move-leave-to{
				opacity:0;
				transform:translate3D(24px,0,0);
				.inner{
					transform:rotate(180deg);
				}
			}
		}
		.cart-count{
			display:inline-block;
			vertical-align: top;
			width: 12px;
			padding-top:6px;
			line-height:24px;
			text-align: center;
			font-size:10px;
			color:rgb(147,153,159);
		}
		.cart-add{
			display:inline-block;
			padding:6px;
			font-size:24px;
			line-height:24px;
			color:rgb(0,160,220);
		}
	}
</style>