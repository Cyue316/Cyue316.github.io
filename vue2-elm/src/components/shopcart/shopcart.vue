<template>
	<div>
		<div class="shopcart">
			<div class="content" @click="toggleList">
				<div class="content-left">
					<div class="logo-wrapper">
						<div class="logo" :class="{'highlight':totalCount>0}">
							<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
						</div>
						<div class="num" v-show="totalCount>0">{{totalCount}}</div>
					</div>
					<div class="price" :class="{'highlight':totalPrice>0}">￥{{totalPrice}}</div>
					<div class="desc">另需配送费￥{{deliveryprice}}元</div>
				</div>
				<div class="content-right" @click.stop.prevent="pay">
					<div class="pay" :class="payClass">{{payDesc}}</div>
				</div>
			</div>
			<!-- 添加购物车小球动画 -->
			<div class="ball-container">
				<div v-for="ball in balls">
					<!-- 过度钩子函数 -->
					<transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter">
						<div class="ball" v-show="ball.show">
							<div class="inner inner-hook"></div>
						</div>
					</transition>
				</div>
			</div>
			<!-- 购物车详情页 -->
			<transition name="fold">
				<div class="shopcart-list" v-show="listShow">
					<div class="list-header">
						<h1 class="title">购物车</h1>
						<span class="empty" @click="empty">清空</span>
					</div>
					<div class="list-content" ref="listcontent">
						<ul>	
							<li class="food" v-for="(food,index) in selectfoods">
								<span class="name">{{food.name}}</span>
								<div class="price">
									<span>￥{{food.price*food.count}}</span>
								</div>
								<div class="cartcontrol-wrapper">
									<cartcontrol :foods="food"></cartcontrol>
								</div>
							</li>
						</ul>
					</div>
				</div>
			</transition>
		</div>
		<!-- 购物车详情页模糊背景 -->
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>
</template>

<script>
	import BScroll from "better-scroll";
	import cartcontrol from "../cartcontrol/cartcontrol.vue";

	export default {
		props:{
			selectfoods:{
				type:Array,
				default(){
					return [];
				}
			},
			deliveryprice:{
				type:Number,
				default:0
			},
			minprice:{
				type:Number,
				default:0
			}
		},
		data(){
			return {
				//小球的个数
				balls:[
					{//小球儿的状态
						show:false
					},
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					},
					{
						show:false
					}
				],
				//存储下落的小球
				dropBalls:[],
				//购物车显示隐藏状态控制
				foldList:true
			};
		},
		computed:{
			//计算选择商品的总价格
			totalPrice: function(){
				let total = 0;
				this.selectfoods.forEach((food,index) => {
					total += food.price * food.count;
				});
				return total;
			},
			//计算选择商品的总个数
			totalCount: function(){
				let count = 0;
				this.selectfoods.forEach((food,index) => {
					count += food.count;
				});
				return count;
			},
			//计算描述文字
			payDesc: function(){
				if(this.totalPrice === 0 ){
					return `￥${this.minprice}元起送`;
				}else if(this.totalPrice < this.minprice){
					let diff = this.minprice - this.totalPrice;
					return `还差￥${diff}元起送`;
				}else{
					return '去结算';
				}
			},
			//计算结算样式
			payClass: function(){
				if(this.totalPrice > this.minprice){
					return 'enough';
				}else{
					return 'not-enough';
				}
			},
			//购物车详情显示控制，与foldList绑定在一起
			listShow: function(){
				if(!this.totalCount){
					this.foldList = true;
					return false;
				}

				let show = !this.foldList;
				//列表显示了才进行滑动
				if(show){
					this.$nextTick(() =>{
						//不存在 better-scroll，进行初始化，存在即调用 refresh方法
						if(!this.listScroll){
							this.listScroll = new BScroll( this.$refs.listcontent,{
								click:true
						});
						}else{
							this.listScroll.refresh();//不需要重新实例化
						}
					})
				}
				return show;
			}
		},
		methods: {
			//小球下落
			drop:function(el){
				//console.log(el);//dom节点
				//循环遍历show为false的小球
				for(let i=0; i<this.balls.length;i++){
					let ball = this.balls[i];
					if(!ball.show){
						ball.show = true;//触发动画的关键
						ball.el = el;//执行下落时 将 父组件传递过来的 dom 对象 当做一个属性 给 ball,方便 在下面的方法中计算 ball 的位置
						//console.log(ball);
						this.dropBalls.push(ball);
						//console.log(this.dropBalls.length);
						return;
					}
				}
			},
			//JavaScript 钩子 参数为传入的dom节点
			beforeEnter:function(el){
				let count = this.balls.length;
				while(count--){
					let ball = this.balls[count];
					if(ball.show){
						//元素相对于视口的距离
						let rect = ball.el.getBoundingClientRect();
						//console.log(rect);
						//获得x,y轴的偏移
						let x = rect.left-32;
						//console.log(window.innerHeight);
						let y = -(window.innerHeight - rect.top -22);
						el.style.display='';//手动让小球显示
						//设置小球的初始位置
						//el （初始位置为 0，0，0）和购物车icon在一起，将小球（el）  放到加号位置去
						//纵向动画
						el.style.webkitTransform = `translate3d(0,${y}px,0)`;
						el.style.transform = `translate3d(0,${y}px,0)`;
						//横向动画  inner-hook，  仅仅定义类 dom选择器，不做样式
						let inner = el.getElementsByClassName('inner-hook')[0];
						inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
						inner.style.transform = `translate3d(${x}px,0,0)`;
					}
				}
			},
			enter:function(el,done){
				//手动触发浏览器重绘
				let rf = el.offsetHeight;//这是一个手动触发html重绘的方法
				//console.log(rf);
				this.$nextTick(()=>{
					//将 ball 通过 transform ：translate（0，0，0） 移动到目标位置
					el.style.webkitTransform = 'translate3d(0,0,0)';
					el.style.transform = 'translate3d(0,0,0)';
					let inner = el.getElementsByClassName('inner-hook')[0];
					inner.style.webkitTransform = 'translate3d(0,0,0)';
					inner.style.transform = 'translate3d(0,0,0)';

					el.addEventListener("transitionend",done);//Vue为了知道过渡的完成，必须设置相应的事件监听器。
				})
			},
			afterEnter:function(el){
				//此轮动画结束后，从存储下落小球的数组将此次的 ball 取出 ，ball状态重置，，el display:none
				let ball = this.dropBalls.shift();
				if(ball){
					ball.show = false;
					el.style.display = 'none';
				}
			},
			toggleList:function(){
				//console.log(111);
				if(!this.totalCount){
					return;
				}

				this.foldList = !this.foldList;
			},
			//清空购物车
			empty:function(){
				//遍历所有选中的食物，将其数量设置为0
				this.selectfoods.forEach((food) =>{
					food.count = 0;
				});
			},
			//点击透明背景隐藏购物车详情
			hideList:function(){
				this.foldList = true;//foldList一旦变化，就会重新计算执行listShow
			},
			//去结算
			pay:function(){
				if(this.totalPrice<this.minprice){
					return;
				}
				window.alert(`支付${this.totalPrice}元`);
			}
		},
		components:{
			cartcontrol
		}
	};
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../../common/scss/mixin.scss";
	.shopcart{
		position:fixed;
		left:0;
		bottom:0;
		z-index:50;
		width: 100%;
		height:48px;
		.content{
			display:flex;
			background:#141d27;
			font-size: 0;
			.content-left{
				flex:1;
				.logo-wrapper{
					display:inline-block;
					vertical-align: top;
					position:relative;
					top:-10px;
					margin:0 12px;
					padding:6px;
					width:56px;
					height:56px;
					box-sizing: border-box;
					border-radius: 50%;
					background:#141d27;
					.logo{
						width:100%;
						height:100%;
						text-align: center;
						border-radius:50%;
						background:rgba(255,255,255,0.2);
						&.highlight{
							background:rgb(0,160,220);
						}
						.icon-shopping_cart{
							line-height: 44px;
							font-size:24px;
							color:rgba(255,255,255,0.4);
							&.highlight{
								color:#fff;
							}
						}
					}
					.num{
						position:absolute;
						top:0;
						right:0;
						width:24px;
						height:16px;
						line-height:16px;
						text-align:center;
						border-radius:10px;
						font-size:9px;
						font-weight:700;
						color:#fff;
						background:rgb(240,20,20);
						box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
					}
				}
				.price{
					display:inline-block;
					vertical-align:top;
					line-height:24px;
					margin-top:12px;
					padding-right:12px;
					box-sizing: border-box;
					border-right:1px solid rgba(255,255,255,0.1);
					font-size:16px;
					font-weight: 700;
					color:rgba(255,255,255,0.4);
					&.highlight{
						color:#fff;
					}
				}
				.desc{
					display:inline-block;
					vertical-align:top;
					line-height:24px;
					margin:12px 0 0 12px;
					font-size:10px;
					color:rgba(255,255,255,0.4);
				}
			}
			.content-right{
				flex:0 0 105px;
				width:105px;
				.pay{
					height:48px;
					line-height:48px;
					text-align:center;
					color:rgba(255,255,255,0.4);
					font-weight:700;
					font-size:12px;
					background:#2b333b;
					&.not-enough{
						background:#2b333b;
					}
					&.enough{
						background:#00b43c;
						color:#fff;
					}
				}
			}
		}
		.ball-container{
			.ball{
				position:fixed;
				left:32px;
				bottom:22px;
				z-index:200;
				transition:all 0.5s cubic-bezier(0.49, -0.29, 0.75, 0.41);
				.inner{
					width:16px;
					height:16px;
					border-radius: 50%;
					background: rgb(0,160,220);
					//x 轴只需要线性缓动
					transition:all 0.5s linear;
				}
			}
		}
		.shopcart-list{
			position:absolute;
			top:0;
			left:0;
			z-index:-1;
			width:100%;
			transform :translate3d(0,-100%,0);
			&.fold-enter-active, &.fold-leave-active{
				transition:all 0.5s linear;
			}
			&.fold-enter,&.fold-leave-to{
				transform :translate3d(0,0,0);
			}
			.list-header{
				height:40px;
				line-height:40px;
				padding: 0 18px;
				background:#f3f5f7;
				border-bottom:1px solid rgba(7,17,27,0.1);
				.title{
					float:left;
					font-size:14px;
					color:rgb(7,17,27);
				}
				.empty{
					float:right;
					font-size:12px;
					color:rgb(0,160,220);
				}
			}
			.list-content{
				padding:0 18px;
				max-height:217px;
				overflow: hidden;
				background:#fff;
				.food{
					position:relative;
					padding:12px 0;
					box-sizing:border-box;
					@include border-1px-bottom(rgba(7,17,27,0.1));
					.name{
						line-height: 24px;
						font-size:14px;
						color:rgb(7,17,27);
					}
					.price{
						position:absolute;
						right:90px;
						bottom:12px;
						line-height:24px;
						font-weight:700;
						color: rgb(240,20,20);
					}
					.cartcontrol-wrapper{
						position:absolute;
						right:0px;
						bottom:6px;
					}
				}
			}
		}
	}
	.list-mask{
		position:fixed;
		top:0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index:40;
		backdrop-filter:blur(10px);
		background: rgba(7,17,27,0.6);
		&.fade-enter-active,&.fade-leave-active{
			transition:opacity 0.5s;	
		}
		&.fade-enter,&.fade-leave-to{
			opacity:0;
		}
	}
</style>