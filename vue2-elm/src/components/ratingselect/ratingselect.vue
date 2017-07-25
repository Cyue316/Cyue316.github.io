<template>
	<div class="ratingselect">
		<div class="rating-type border-1px-bottom">
			<span class="block positive" :class="{'active':selectType === 2}">{{desc.all}}<span class="count">54</span></span>
			<span class="block positive"  :class="{'active':selectType === 0}">{{desc.positive}}<span class="count">50</span></span>
			<span class="block negative"  :class="{'active':selectType === 1}">{{desc.negative}}<span class="count">4</span></span>
		</div>
		<div class="switch border-1px-bottom" :class="{'on':onlyContent}">
			<i class="icon-check_circle"></i>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE =1;
	const ALL = 2;

	export default {
		//定义外部可以传入的变量
		props:{
			ratings:{
				type:Array,
				default(){
					return [];
				}
			},
			selectType:{
				type:Number,
				default:ALL
			},
			onlyContent:{
				type:Boolean,
				default:false
			},
			desc:{
				type:Object,
				default(){
					return{
						//默认返回
						all:'全部',
						positive:'满意',
						negative:'不满意'
					};
				}
			}
		}
	};
</script>

<style lang="scss" rel="stylesheet/scss">
	@import "../../common/scss/mixin.scss";

	.ratingselect{
		.rating-type{
			padding: 18px 0;
			margin: 0 18px;
			@include border-1px-bottom(rgba(7,17,27,0.1));
			.block{
				display: inline-block;
				padding:8px 12px;
				margin-right:8px;
				border-radius: 1px;
				color: rgb(77,89,53);
				font-size: 14px;
				&.active{
					color :#fff;
				}
				&.count{
					font-size :8px;
					margin-right :2px;
				}
				&.positive{
					background:rgba(0,160,220,0.2);
					&.active{
						background:rgb(0,160,220);
					}
				}
				&.negative{
					background:rgba(77,85,93,0.2);
					&.active{
						background:rgb(77,85,93);
					}
				}
			}
		}
		.switch{
			padding :12px 18px;
			color :rgb(147,153,159);
			line-height :24px;
			@include border-1px-bottom(rgb(147,153,159));
			&.on {
				.icon-check_circle {
					color: #00c850;
				}
			}
			.icon-check_circle{
				display :inline-block;
				font-size :24px;
				vertical-align :middle;
			}
			.text{
				display :inline-block;
				font-size :12px;
			}
		}
	}
</style>