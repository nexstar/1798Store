import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './Helpers.js';

// 日報表
	Router.route('/DailyReport', {
		name: 'post.dailyreport',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '日報表',
			};
			 
			Meteor.subscribe('Shop');
			return obj;
		},
		yieldRegions: {
			'DailyReport': {to: 'plugin'},
		},
	});

// 購物金
	Router.route('/ShoppingMoney', {
		name: 'post.shoppingmoney',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '購物金',
			};
			 
			Meteor.subscribe('UserInfo');
			
			return obj;
		},
		yieldRegions: {
			'ShoppingMoney': {to: 'plugin'},
		},
	});

// 尚未受理
	Router.route('/NotAccepted', {
		name: 'post.notaccepted',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '尚未受理',
			};
			Meteor.subscribe('Shop');
			Meteor.subscribe('UserInfo');
			Meteor.subscribe('UserOrder');
			return obj;
		},
		yieldRegions: {
			'NotAccepted': {to: 'plugin'},
		},
	});

// 尚未受理之修正訂單
	Router.route('/NotAccepteDetail', {
		name: 'post.NotAcceptedetail',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '尚未受理之修正訂單',
				_id: this.params.query.id
			};
			Meteor.subscribe('UserOrder');
			Meteor.subscribe('ShopSingleFood');
			Meteor.subscribe('FoodSauce');
			return obj;
		},
		yieldRegions: {
			'NotAccepteDetail': {to: 'plugin'},
		},
	});



// 烹飪中
	Router.route('/Ving', {
		name: 'post.ving',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '烹飪中',
			};
			Meteor.subscribe('Shop');
			Meteor.subscribe('UserInfo');
			Meteor.subscribe('UserOrder');
			return obj;
		},
		yieldRegions: {
			'Ving': {to: 'plugin'},
		},
	});

// 烹飪中修正
	Router.route('/VingDetail', {
		name: 'post.vingdetail',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '烹飪中修正訂單',
				id: this.params.query.id
			};
			Meteor.subscribe('Shop');
			Meteor.subscribe('UserInfo');
			Meteor.subscribe('UserOrder');
			return obj;
		},
		yieldRegions: {
			'VingDetail': {to: 'plugin'},
		},
	});

// 待取餐
	Router.route('/GotFood', {
		name: 'post.gotfood',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '待取餐',
			};
			Meteor.subscribe('Shop');
			Meteor.subscribe('UserInfo');
			Meteor.subscribe('UserOrder');
			return obj;
		},
		yieldRegions: {
			'GotFood': {to: 'plugin'},
		},
	});

// 結帳中
	Router.route('/GotFoodDetail', {
		name: 'post.gotfooddetail',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '結帳中',
				orderid: this.params.query.id
			};
			Meteor.subscribe('UserInfo');
			Meteor.subscribe('UserOrder');
			Meteor.subscribe('ShopSingleMenu');
			Meteor.subscribe('ShopSingleFood');
			Meteor.subscribe('FoodSauce');
			Meteor.subscribe('ShopDoubleFood');
			return obj;
		},
		yieldRegions: {
			'GotFoodDetail': {to: 'plugin'},
		},
	});


// 口味
	Router.route('/Taste', {
		name: 'post.taste',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '口味',
			};
			Meteor.subscribe('FoodSauce');
			return obj;
		},
		yieldRegions: {
			'Taste': {to: 'plugin'},
		},
	});

// 食物口味修正
	Router.route('/SurplusDetail', {
		name: 'post.surplusdetail',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: "食物口味修正",
				_id: this.params.query.id
			};
			// Meteor.subscribe('Shop');
			return obj;
		},
		yieldRegions: {
			'SurplusDetail': {to: 'plugin'},
		},
	});

// 食物
	Router.route('/Surplus', {
		name: 'post.surplus',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '食物',
			};
			 
			Meteor.subscribe('ShopSingleFood');
			Meteor.subscribe('FoodSauce');
			
			return obj;
		},
		yieldRegions: {
			'Surplus': {to: 'plugin'},
		},
	});

// 資訊
	Router.route('/Info', {
		name: 'post.info',
		layoutTemplate: 'MainTmp',
		data: function () {
			const obj = {
				title: '商家資訊',
			};
			 
			Meteor.subscribe('Shop');
			return obj;
		},
		yieldRegions: {
			'Info': {to: 'plugin'},
		},
	});

// 註冊
	Router.route('/RegisterOfPhone', {
		name: 'post.RegisterOfPhone',
		layoutTemplate: 'MainTmp',
		data: {
			title: '註冊',
			check: 'ROP',
		},
		yieldRegions: {
			'RegisterOfPhone': {to: 'plugin'},
		},
	});

// 根路徑
	Router.route('/', {
		name: 'post.MainTmp',
		layoutTemplate: 'MainTmp',
		data: {
			title: '卡利亞里',
			check: 'HOME',
		},
		yieldRegions: {
			'shopplugin': {to: 'plugin'},
			// 'accountplugin': {to: 'ftplugin'}
		},
	});

// 登入
	Router.route('/login', {
		name: 'post.login',
		layoutTemplate: 'MainTmp',
		data:{
			title: '1798商家端',
			check: 'LOGIN',
		},
	});


