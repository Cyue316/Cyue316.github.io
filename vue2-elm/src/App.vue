<template>
  <div id="app">
    <v-header v-bind:seller="seller"></v-header>
    <div class="tab border-1px-bottom">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>
    <!-- 路由出口 -->
    <!-- 路由匹配到的组件将渲染在这里 -->
    <router-view :seller="seller"></router-view>
  </div>
</template>

<script>
  import header from './components/header/header.vue';

  const ERR_OK = 0;

  export default{
    data() {
      return{
        seller: {}
      }
    },
    mounted: function() {
      this.$nextTick( () => {
        this.$http.get('https://www.easy-mock.com/mock/59734844a1d30433d83a7a3c/api/seller').then((res) => {
           //  console.log(res.body);
             res = res.body;
             //if( res.errno === ERR_OK ){
                this.seller = res.seller;
              //  console.log(this.seller);
             //}
          });
        })
    },
    components:{
      'v-header':header
    }
  }
</script>

<style lang="scss" text="text/css">
  @import "./common/scss/mixin.scss";

  #app{
    .tab{
      display:flex;
      width:100%;
      height:40px;
      line-height:40px;
      @include border-1px-bottom(rgba(7,17,27,0.1));
      .tab-item{
        flex:1;
        text-align:center;
        &>a{
          display:block;
          font-size:14px;
          color:rgb(77,85,93);
          &.active{
            color:rgb(240,20,20);
          }
        }
      }
    }
  }
</style>
