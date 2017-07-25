<template>
    <div>
		<div class="goods">
			<div class="menu-wrapper" ref="menuwrapper">
				<ul>
					<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex === index}" @click="selectMenu(index,$event)">
						<span class="text border-1px-bottom">
							<span v-show="item.type>0" class="icon" :class="classArray[item.type]"></span>{{item.name}}
						</span>
					</li>
				</ul>
			</div>
			<div class="foods-wrapper" ref="foodswrapper">
				<ul>
					<li v-for="(item,index) in goods" class="foods-list foods-list-hook">
						<h1 class="title">{{item.name}}</h1>
						<ul>
							<li @click="selectFood(food,$event)" v-for="(food,index) in item.foods" class="foods-item border-1px-bottom">
								<div class="icon">
									<img width="57" height="57" :src="food.icon">
								</div>
								<div class="content">
									<h2 class="name">{{food.name}}</h2>
									<p class="desc" v-show="food.description">{{food.description}}</p>
									<div class="extra">
										<span class="count">月售{{food.sellCount}}</span><span>好评率{{food.rating}}</span>
									</div>
									<div class="price">
										<span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">{{food.oldPrice}}</span>
									</div>
									<div class="cartcontrol-wrapper">
									<!-- add自定义事件用于派发当前点击的dom元素，add为子组件方法，cartAdd为父组件方法 -->
										<cartcontrol :foods="food" @add="cartAdd"></cartcontrol>
									</div>
								</div>
							</li>
						</ul>
					</li>
				</ul>
			</div>
			<shopcart ref="shopcart" :selectfoods="selectFoods" :deliveryprice="seller.deliveryPrice" :minprice="seller.minPrice"></shopcart>
		</div>
		<food @add="addFood" :food="selectedFood" ref="food"></food>
    </div>
</template>

<script>
	import BScroll from "better-scroll";
	import shopcart from "../shopcart/shopcart.vue";
	import cartcontrol from "../cartcontrol/cartcontrol.vue";
	import food from "../food/food.vue";
	
	const ERR_OK = 0;
	
	export default{
		props:{
			seller:{
				type:Object
			}
		},
		data(){
			return {
				goods:[],
				listHeight:[],
				scrollY:0,
				selectedFood:{}
			};
		},
		created(){
			this.$http.get("https://www.easy-mock.com/mock/59734844a1d30433d83a7a3c/api/goods").then( (res) => {
				res = res.body;
				//if( res.errno === ERR_OK ){
					this.goods = res.goods;
				//	console.log(this.goods);
					//dom结构加载结束
					this.$nextTick( () => {
						this._initScroll();
						//计算高度
						this._calculateHeight();
					})
			//	}
			});

			this.classArray = ['decrease','discount','guarantee','invoice','special'];

		},
		computed:{
			currentIndex:function(){
				for(let i=0; i<this.listHeight.length;i++){
					//判断当currentIndex在height1和height2之间的时候显示
					let height1 = this.listHeight[i];
					let height2 = this.listHeight[i+1];
					//console.log(this.scrollY);
					//console.log('height1:'+height1+','+'height2:'+height2);
					//判断scrollY是否在范围内
					//最后一个区间没有height2
					if(!height2 || (this.scrollY>=height1&&this.scrollY<height2)){
						return i;
					}
				}

				return 0;
			},
			selectFoods: function(){
				let foods = [];
				this.goods.forEach((good) => {
					good.foods.forEach((food) => {
						if(food.count){
							foods.push(food);
						}
					});
				});
				return foods;
			}
		},
		methods: {
			//初始化better-scroll
			_initScroll: function(){
				this.menuScroll = new BScroll(this.$refs.menuwrapper,{
					click: true
				});
				this.foodScroll = new BScroll(this.$refs.foodswrapper,{
					//派发click事件
					click: true,
					//探针作用，实时监测滚动位置
					probeType:3
				});
				//设置监听滚动位置
				this.foodScroll.on('scroll',(pos) => {
					//scrollY接收变量
					this.scrollY = Math.abs(Math.round(pos.y));
					//console.log(this.scrollY);
				})
			},
			//计算每一个分类的高度
			_calculateHeight: function(){
				let foodsList = this.$refs.foodswrapper.getElementsByClassName('foods-list-hook');
				let height = 0;
				//把第一个高度push到高度数组里
				this.listHeight.push(height);
				//通过循环foodList下的dom结构，将每一个li的高度依次送入数组
				for(let i=0; i<foodsList.length; i++){
					let item = foodsList[i];
					height += item.clientHeight;
					//console.log(height);
					this.listHeight.push(height);
				}
				//console.log(this.listHeight);
			},
			//左侧菜单实现左右联动
			selectMenu:function(index,event){
				//      自己默认派发事件时候(BScroll),_constructed被置为true,但是浏览器原生并没有这个属性
				if(!event._constructed){
					return;
				}
				//console.log(index);
				//获取到所有的列表
				let foodsList = this.$refs.foodswrapper.getElementsByClassName('foods-list-hook');
				//获取对应元素的列表
				let el = foodsList[index];
				//运用BScroll接口，滚动到相应位置
				this.foodScroll.scrollToElement(el,300);
			},
			//商品详情
			selectFood:function(food,event){
				if(!event._constructed){
					return;
				}
				this.selectedFood = food;
				this.$refs.food.show();
			},
			//food子组件派发来的事件
			addFood:function(target){
				this._drop(target);
			},
			//cartcontrol子组件$emit派发而来的事件
			cartAdd:function(target){
				this._drop(target);
			},
			_drop:function(target){
				// 体验优化,异步执行下落动画
            	this.$nextTick(() => {
	            //调用 shopcar 组件中的 drop 方法，向 shopcar组件 传入当前点击的 dom 对象
	                this.$refs.shopcart.drop(target);
	            });
			}
		},
		components :{
			shopcart,cartcontrol,food
		}
	};
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../../common/scss/mixin.scss";

	.goods{
		display: flex;
		position:absolute;
		top:174px;
		bottom:46px;
		width:100%;
		overflow:hidden;
		.menu-wrapper{
			flex:0 0 80px;
			width:80px;
			background:#f3f5f7;
			.menu-item{
				display:table;
				height:54px;
				width:56px;
				line-height: 14px;
				padding:0 12px;
				&.current{
					position:relative;
					z-index:10;
					margin-top:-1px;
					background:#fff;
					font-weight:700;
					.text{
						@include border-none();
					}
				}
				.icon{
					display:inline-block;
					vertical-align:top;
					width:12px;
					height:12px;
					margin-right: 2px;
					background-size:cover;
					background-repeat:no-repeat;
					&.decrease{
						@include bg-image('decrease_3');
					}
					&.discount{
						@include bg-image('discount_3');
					}
					&.guarantee{
						@include bg-image('guarantee_3');
					}
					&.invoice{
						@include bg-image('invoice_3');
					}
					&.special{
						@include bg-image('special_3');
					}
				}
				.text{
					display:table-cell;
					width:56px;
					vertical-align:middle;
					@include border-1px-bottom(rgba(7,17,27,0.1));
					font-size: 12px;
				}
			}
		}
		.foods-wrapper{
			flex:1;
			.title{
				padding-left:14px;
				height:26px;
				line-height:26px;
				border-left:2px solid #d9dde1;
				font-size:12px;
				color:rgb(147,153,159);
				background:#f3f5f7;
			}
			.foods-item{
				display:flex;
				margin:18px;
				padding-bottom:18px;
				@include border-1px-bottom(rgba(7,17,27,0.1));
				&.last-child{
					@include border-none();
					margin-bottom:0;
				}
				.icon{
					flex:0 0 57px;
					width:57px;
					margin-right:10px;
				}
				.content{
					flex:1;
					.name{
						margin:2px 0 8px;
						height:14px;
						line-height:14px;
						font-size:14px;
						color:rgb(7,17,27);
					}
					.desc,.extra{
						line-height:10px;
						font-size:10px;
						color:rgb(147,153,159);
					}
					.desc{
						margin-bottom:8px;
					}
					.extra{
						.count{
							margin-right:12px;
						}
					}
					.price{
						font-weight: 700;
						line-height:24px;
						.now{
							margin-right:8px;
							font-size:14px;
							color:rgb(240,20,20);
						}
						.old{
							text-decoration: line-through;
							font-size:10px;
							color:rgb(147,153,159);
						}
					}
					.cartcontrol-wrapper{
						position:absolute;
						right:0;
						bottom:12px;
					}
				}
			}
		}
	}
</style>