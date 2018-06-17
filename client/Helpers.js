import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './Router.js';
import './Events.js';
import './main.html';

var _UserID = "";
Template.MainTmp.helpers({
	BackDailyReportDetail(title){
		switch(title){
			case "日報表詳細":
				return 1;
			break;
		};
	},
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

// 日報表詳細
	var rdjson = new ReactiveVar('');
	Template.DailyReportDetail.helpers({
		DailyReportDetailList(){
			
			const _array = (this.array).split(',');
			let FoodTmpArray  = [];
			let FoodSauceTmpArray  = [];
			for(let i=0; i<(_array.length); i++){
				const UO = Mongo_UserOrder.find({'_id': _array[i]}).fetch();
				UO.forEach((UOElem, UOIndex)=>{
					const foodlist = UOElem.foodlist;
					foodlist.forEach((foodlistElem, foodlistIndex)=>{
						if( (foodlistElem.type) == "single" ){
							FoodTmpArray.push(foodlistElem.foodid);
							const SingleSplit = (foodlistElem.foodsauceid).split(',');
							SingleSplit.forEach((SingleSplitElem, SingleSplitIndex)=>{
								FoodSauceTmpArray.push(SingleSplitElem);
							});
						}else{
							const SDF = Mongo_ShopDoubleFood.find({
											'_id': foodlistElem.df.objid
										}).fetch();
							SDF.forEach((SDFElem, SDFIndex)=>{
								FoodTmpArray.push(SDFElem.Sigleid);
								FoodSauceTmpArray.push(foodlistElem.df.sauceid);
								
								FoodTmpArray.push(foodlistElem.dv.dvobjid);
								FoodSauceTmpArray.push(foodlistElem.dv.sauceid);
								
								FoodTmpArray.push(foodlistElem.dd.singlefoodid)
							});
							const st = foodlistElem.st;
							st.forEach((stElem, stIndex)=>{
								FoodSauceTmpArray.push(stElem.sauceid);
							});
						};
					});
				});
			};

			const FoodResult = FoodTmpArray.reduce(
				(obj, item) => {
			    	obj[item] = obj[item] ? obj[item] + 1 : 1;
			    	return obj;
				}, {}
			);

			const FoodSauceResult = FoodSauceTmpArray.reduce(
				(obj, item) => {
			    	obj[item] = obj[item] ? obj[item] + 1 : 1;
			    	return obj;
				}, {}
			);

			MeteorEach = [];

			_.each(FoodResult, (key, value, list)=>{
				const SSF = Mongo_ShopSingleFood.find({
								'_id': value
							}).fetch();
				SSF.forEach((SSFElem, SSFIndex)=>{
					MeteorEach.push({
						zh: SSFElem.zh,
						count: key
					});
				});
			});

			_.each(FoodSauceResult, (key, value, list)=>{
				const SSF = Mongo_FoodSauce.find({
								'_id': value
							}).fetch();
				SSF.forEach((SSFElem, SSFIndex)=>{
					MeteorEach.push({
						zh: SSFElem.zh,
						count: key
					});
				});
			});

			MeteorEach.sort(function (a, b) {
              return b.count - a.count;
            });

			rdjson.set(encodeURI(JSON.stringify(MeteorEach)));
			return MeteorEach;
		},
		DRJson(){
			return rdjson.get();
		},
		date(){
			return this.date;
		},
		money(){
			return this.money;
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
