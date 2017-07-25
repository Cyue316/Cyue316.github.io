// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from "./components/goods/goods";
import ratings from "./components/ratings/ratings";
import seller from "./components/seller/seller";

import "./common/scss/index.scss";

Vue.use(VueRouter);
Vue.use(VueResource);

Vue.config.productionTip = false;

const routes = [{
		path: '/goods',
		component: goods
	}, {
		path: '/ratings',
		component: ratings
	}, {
		path: '/seller',
		component: seller
	}, {
		path: '/',
		redirect: '/goods'
	} // 跳转路由，默认显示路由页面
];

const router = new VueRouter({
	routes: routes,
	linkActiveClass: 'active'
});

const app = new Vue({
	router: router,
	render: h => h(App)
}).$mount('#app');

//第一次默认进入得页面
//router.push("/goods");