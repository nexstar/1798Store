import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './Router.js';
import './Events.js';
import './main.html';

var _UserID = "";
Template.MainTmp.helpers({
	BackGotFoodDetail(title){
		switch(title){
			case "結帳中":
				return 1;
			break;
		};
	},
	BackVing(title){
		switch(title){
			case "烹飪中修正訂單":
				return 1;
			break;
		};
	},
	BackNotAccepted(title){
		switch(title){
			case "尚未受理之修正訂單":
				return 1;
			break;
		};
	},
	BackSurplus(title){
		switch(title){
			case "食物口味修正":
				return 1;
			break;
		};
	},
	BackMainTmp(title){
		switch(title){
			case "商家資訊":
			case "尚未受理":
			case "烹飪中":
			case "待取餐":
			case "購物金":
			case "日報表":
			case "口味":
			case "食物":
				return 1;
			break;
		};
	},
	AutoLoginOut(check){
		// Meteor.logout();
		_UserID = Meteor.userId();
		if( (String(_UserID) == "null") && 
			((check == "HOME") || (check == "LOGIN")) ) {
			Router.go('post.login');
		};
	},
	OneBar(check){
		switch(check){
			case "ROP":
				return 1;
			break;
		};
	},
	Login(check){
		if(check == "LOGIN"){
			return 1;
		};
	},
});


// 城市.大學
	Template.TempSchool.onRendered(function () {
		  Meteor.subscribe('City');
		  Meteor.subscribe('Downtown');
	});

	Template.TempSchool.helpers({
		City(){
			MeteorEach = [];
			const _Mongo_City = Mongo_City.find({}).fetch();
			_Mongo_City.forEach(function(elem){
				MeteorEach.push({
					'id': elem._id,
					'title': elem.name
				});
			});
			return MeteorEach;
		},
		School($id){
			MeteorEach = [];
			const _Mongo_Downtown = Mongo_Downtown.find({'cityid': $id}).fetch();
			_Mongo_Downtown.forEach(function(elem){
				MeteorEach.push({
					'zip': elem._id,
					'title': elem.name
				});
			});
			return MeteorEach;
		},
	});
