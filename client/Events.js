import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { HTTP } from 'meteor/http'
import './Router.js';
import './Helpers.js';
import './main.html';
import '/imports/MongoDBCollection.js'

var H_window = "";
var MeteorEach = [];

// 日報表
	Template.DailyReport.events({
		'click .BtnDailyReport':(evt,tmp) => {
			evt.preventDefault();
			const _textContent = evt.target.textContent;
			const objid = evt.currentTarget.dataset.value;
			
		},
	});

	Template.DailyReport.helpers({
		DailyReportList(){
			MeteorEach = [];

			for(let i=0;i<40;i++){
				MeteorEach.push({
					index:i
				});
			};

			return MeteorEach;
		},
	});

// 購物金
	Template.ShoppingMoney.events({
		'click .BtnShoppingMoney':(evt,tmp) => {
			evt.preventDefault();
			const Index  = evt.currentTarget.dataset.value;
			const UserId = $('[name=UserId' + Index + ']').val();
			const Usermail = $('[name=Usermail' + Index + ']').val();
			const Usertoken = $('[name=Usertoken' + Index + ']').val();

			Meteor.call('UpShoppingMoney', UserId, Usertoken, (err, res) => {
				if(res){
					alert("請將五十元購物金給予 " + Usermail);
				};
			});
		},
	});

	Template.ShoppingMoney.helpers({
		ShoppingMoneyList(){
			MeteorEach = [];
			const UIF = Mongo_UserInfo.find({
				'notifi': {
					$elemMatch: {
						user_notifi_id:'5b1dbf52570d5bc42d35d27f',
						check: 0
					}
				}
			}).fetch();
			UIF.forEach((UIFElem, UIFIndex)=>{
				MeteorEach.push({
					index: (UIFIndex + 1),
					id: UIFElem._id,
					mail: UIFElem.user_school_mail_id,
					phone: UIFElem.import.phone,
					tpyetoken: ((UIFElem.import.token == "")?"0":"1"),
					token: UIFElem.import.token
				});
				
			});
			return MeteorEach;
		},
	});

// 結帳中
	const _SingleOrDouble = ['單點','套餐'];
	var GotFoodMoney = new ReactiveVar(0);
	var Identity  = new ReactiveVar(0);
	var Timestamp = new ReactiveVar(0);
	var Mail  = new ReactiveVar(0);
	var Phone = new ReactiveVar(0);
	var Token = new ReactiveVar(0);

	Template.GotFoodDetail.helpers({
		GotFoodList(objid){
			MeteorEach = [];
			let TotalMoney = 0;
			let CartCount  = 0;
			const UserOrder = Mongo_UserOrder.find({'_id': objid}).fetch();
			UserOrder.forEach((UserOrderElem, UserOrderIndex)=>{
				const _foodlist  = UserOrderElem.foodlist;
				_foodlist.forEach((_foodlistElem, _foodlistIndex)=>{
					CartCount++;
					if(_foodlistElem.type == "single"){
						const SSF = Mongo_ShopSingleFood.find({
										'_id': _foodlistElem.foodid
									}).fetch();

						SSF.forEach(function(SSFelem,SSFindex){
							const SSM = Mongo_ShopSingleMenu.find({
											'_id': SSFelem.SingleMenu_id
										}).fetch();

							SSM.forEach(function(SSMelem,SSMindex){
								const _foodsauceid = _foodlistElem.foodsauceid.split(',');
								let _sauce = "";
								_foodsauceid.forEach(function(FSidelem,FSidindex){
									const FS = Mongo_FoodSauce.find({
													'_id': FSidelem
												}).fetch();

									FS.forEach(function(FSelem,FSindex){
										_sauce += FSelem.zh;
										if(FSidindex < (_foodsauceid.length - 1)){
											_sauce += ',';
										};
									});

								});

								MeteorEach.push({
									SingleOrDouble: 1, // 1=單點 ,0=套餐
									head: CartCount + '.' + _SingleOrDouble[1],
									catena: SSMelem.zh + "系列",
									name: _foodlistElem.foodname,
									sauce: _sauce,
									money: "NT$ " + SSFelem.money
								});

								TotalMoney += parseInt(SSFelem.money);
							});
						});
					}else{
						const _elem0_df = _foodlistElem.df; // 主餐
						const _elem0_dv = _foodlistElem.dv; // 副餐
						const _elem0_dd = _foodlistElem.dd; // 飲品 濃湯
						const _elem0_st = _foodlistElem.st; // 原味 糖 冰塊

						// 主食 主食甜品 價錢 
						const First_SDF = Mongo_ShopDoubleFood.find({
												'_id': _elem0_df.objid
											}).fetch();
												
						First_SDF.forEach(function(FSDFelem,FSDFindex){
							const First_SSF = Mongo_ShopSingleFood.find({
												'_id': FSDFelem.Sigleid
											}).fetch();

							First_SSF.forEach(function(FSSFelem,FSSFindex){
								const First_SSM = Mongo_ShopSingleMenu.find({
											'_id': FSSFelem.SingleMenu_id
										}).fetch();

								First_SSM.forEach(function(FSSMelem,FSSMindex){
									// 副餐
									const Second_SSF = Mongo_ShopSingleFood.find({
														'_id': _elem0_dv.dvobjid
													}).fetch();

									Second_SSF.forEach(function(SSSFelem,SSSFindex){
										const Second_FS = Mongo_FoodSauce.find({
														'_id': _elem0_dv.sauceid
													}).fetch();

										Second_FS.forEach(function(SFSelem,SFSindex){
											// 飲品
											const dirnkName = Mongo_ShopSingleFood.find({
																'_id': _elem0_dd.singlefoodid
															}).fetch();

											dirnkName.forEach(function(DNelem,DNindex){
												let TmpSauce = " (";
												
												_elem0_st.forEach(function(STelem,STindex){
													const drink_sauce = Mongo_FoodSauce.find({
																			'_id': STelem.sauceid
																		}).fetch();

													drink_sauce.forEach(function(Dselem,Dsindex){
														TmpSauce += Dselem.zh;
														if(STindex < (_elem0_st.length - 1)){
															TmpSauce += ',';
														};
													});
												});

												TmpSauce += ')';

												MeteorEach.push({
													SingleOrDouble: 0, // 1=單點 ,0=套餐
													head: CartCount + '.' + _SingleOrDouble[0],
													meal: _elem0_df.title,
													first: FSSFelem.zh + '('+ _elem0_df.sauce +')',
													second: SSSFelem.zh + '('+ SFSelem.zh +')',
													drink: DNelem.zh + TmpSauce,
													money: "NT$ " + _elem0_df.money
												});

												TotalMoney += parseInt(_elem0_df.money);
											});
										});
									});
								});
							});
						});
					}
				});
				const UserInfo = Mongo_UserInfo.find({'order': {
									$elemMatch: {
										'user_order_id': objid
									}}
								});
				UserInfo.forEach((UserInfoElem, UserInfoIndex)=>{
					Mail.set(UserInfoElem.user_school_mail_id);
					Identity.set(UserInfoElem.user_school_identity);
					Phone.set(UserInfoElem.import.phone);
					Token.set(UserInfoElem.import.token);
					let _date = ResolveTime(UserOrderElem.timestamp);
						_date = (_date[0] + '-' + _date[1] + '-' + _date[2] + ' ' + _date[3] + ':' + _date[4].substr(-2));
					Timestamp.set(_date);
				});
			});
			GotFoodMoney.set(TotalMoney);
			return MeteorEach;
		},
		GotFoodtoken(){
			return Token.get()
		},
		GotFoodIdentity(){
			return Identity.get();
		},
		GotFoodPhone(){
			return Phone.get();
		},
		GotFoodEmail(){
			return Mail.get();
		},
		GotFoodDate(){
			return Timestamp.get();
		},
		IFSingleOrDouble(open){
			return open;
		},
		GotFoodMoney(){
			return GotFoodMoney.get();
		},
		ColorType(){
			return GotFoodColorType.get();
		},
		ForCustomer(){
			return ForCustomer.get();
		},
	});
	var GotFoodColorType = new ReactiveVar('red');
	var ForCustomer = new ReactiveVar(0);
	Template.GotFoodDetail.events({
		'click [name=BtnDeal]':(evt,tmp)=>{
			evt.preventDefault();
			if(GotFoodColorType.get() == "red"){
				alert("無法交易....");
			}else{
				const OrderId  = $('[name=GotFoodOrderId]').val();
				const paymoney = $('[name=paymoney]').val();
				const token = $('[name=GotFoodDetailtoken]').val();
				const Shop = Mongo_Shop.find({
								'user_to_id': Meteor.userId()
							}).fetch();
				let _title  = "";
				const _body = "您的餐點交易完成!! 期待您下次使用＾＾";
				Shop.forEach((ShopElem, ShopIndex)=>{
					_title = ShopElem.shopname;
				});
				if(paymoney != ""){
					if( confirm("準備進行交易!!!!") ){
						Meteor.call('BusinessDeal', OrderId, token, _title, _body, (err,res)=>{
							if(res){
								alert("已經完成交易");
								GotFoodColorType.set('red');
								ForCustomer.set(0);
								Router.go('post.MainTmp');
							};
						});
					};
				}else{
					alert("支付金不能為空!!!");
				};
			};
		},
		'change [name=paymoney]':(evt, tmp)=>{
			const _Money = GotFoodMoney.get();
			const _val = tmp.$('[name=paymoney]').val();
			const number = (_val - _Money);
			if( ( number <= 0 )){
				GotFoodColorType.set('red');
				if( number == 0 ){
					GotFoodColorType.set('green');
				};
			}else{
				GotFoodColorType.set('green');
			}
			ForCustomer.set(number);
		},
	});

// 待取餐
	Template.GotFood.events({});

	Template.GotFood.helpers({
		GotFoodList(){
			MeteorEach = [];
			
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			
			Shop.forEach((ShopElem, ShopIndex)=>{
				const UIF = Mongo_UserInfo.find({order: { $elemMatch: {
					        $and:[{
				            	timestamp: { 
				              		$gte: ShopElem.TimeStampOpen
				            	}
				          	},{
				            	timestamp: { 
				            		$lte: ShopElem.TimeStampClose
				          		}
				        	}]}}}).fetch();
				UIF.forEach((UIFElem, UIFIndex)=>{
					const _order = UIFElem.order;
					_order.forEach((_orderElem, _orderIndex)=>{
						if ( ((_orderElem.timestamp >= ShopElem.TimeStampOpen) && 
							 (_orderElem.timestamp <= ShopElem.TimeStampClose)) ){

							if( ((_orderElem.type == 4) && 
								 (_orderElem.shopid == ShopElem._id)) ){
								let _date = ResolveTime(_orderElem.timestamp);
									_date = (_date[0] + '-' + _date[1] + '-' + _date[2] + ' ' + _date[3] + ':' + _date[4].substr(-2));
								const UO = Mongo_UserOrder.find({
												'_id': _orderElem.user_order_id
											}).fetch();
								UO.forEach((UOElem, UOIndex)=>{
									MeteorEach.push({
										name: (UIFElem.user_school_identity),
										email: UIFElem.user_school_mail_id,
										phone: UIFElem.import.phone,
										tokentype: ((UIFElem.import.token == "")?"0":"1"),
										date: _date,
										timestamp: _orderElem.timestamp,
										money: UOElem.money,
										orderid: _orderElem.user_order_id
									});
								});
							};
						};
					});
				});
			});
			
			MeteorEach.sort(function (a, b) {
              return a.timestamp - b.timestamp;
            });

			return MeteorEach;
		},
	});

// 烹飪中
	Template.Ving.events({
		'click .BtnVing':(evt,tmp) => {
			evt.preventDefault();
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			const Index = evt.currentTarget.dataset.value;
			const Orderid = $('[name=VingOrderid' + Index + ']').val();
			const token = $('[name=Vingtoken' + Index + ']').val();
			let _title  = "";
			const _body = "您的餐點已完成，請在餐點賞味時最佳取餐(15分鐘內)...";
			Shop.forEach((ShopElem, ShopIndex)=>{
				_title = ShopElem.shopname;
			});
			Meteor.call('UpdateInfoTypeVing', Orderid, token, _title, _body, 4,
				(err,res)=>{
					if(res){
						alert("已進入下一階段...");
					}
				}
			);
		},
		'click .BtnRmVing':(evt,tmp)=>{
			evt.preventDefault();
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			const Index = evt.currentTarget.dataset.value;
			const Orderid = $('[name=VingOrderid' + Index + ']').val();
			const token = $('[name=Vingtoken' + Index + ']').val();
			let _title  = "";
			const _body = "您的訂單已取消!!!";
			Shop.forEach((ShopElem, ShopIndex)=>{
				_title = ShopElem.shopname;
			});
			Meteor.call('UpdateInfoTypeRmMove', Orderid, token, _title, _body, (err,res) => {
					if(res){
						alert("已取消訂單...");
					}
				}
			);	
		},
	});
	Template.Ving.helpers({
		VingList(){
			MeteorEach = [];
			
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			
			Shop.forEach((ShopElem, ShopIndex)=>{
				const UIF = Mongo_UserInfo.find({order: { $elemMatch: {
					        $and:[{
				            	timestamp: { 
				              		$gte: ShopElem.TimeStampOpen
				            	}
				          	},{
				            	timestamp: { 
				            		$lte: ShopElem.TimeStampClose
				          		}
				        	}]}}}).fetch();
				let Index = 0;
				UIF.forEach((UIFElem, UIFIndex)=>{
					const _order = UIFElem.order;
					_order.forEach((_orderElem, _orderIndex)=>{
						if ( ((_orderElem.timestamp >= ShopElem.TimeStampOpen) && 
							 (_orderElem.timestamp <= ShopElem.TimeStampClose)) ){

							if( ((_orderElem.type == 2) && 
								 (_orderElem.shopid == ShopElem._id)) ){
								let _date = ResolveTime(_orderElem.timestamp);
									_date = (_date[0] + '-' + _date[1] + '-' + _date[2] + ' ' + _date[3] + ':' + _date[4].substr(-2));
								const UO = Mongo_UserOrder.find({
												'_id': _orderElem.user_order_id
											}).fetch();
								UO.forEach((UOElem, UOIndex)=>{
									MeteorEach.push({
										index: Index,
										name: (UIFElem.user_school_identity),
										objid: UIFElem.users_to_id,
										email: UIFElem.user_school_mail_id,
										phone: UIFElem.import.phone,
										tokentype: ((UIFElem.import.token == "")?"0":"1"),
										token: UIFElem.import.token,
										date: _date,
										timestamp: _orderElem.timestamp,
										money: UOElem.money,
										orderid: _orderElem.user_order_id
									});
									Index++;
								});
							};
						};
					});
				});
			});
			
			MeteorEach.sort(function (a, b) {
              return a.timestamp - b.timestamp;
            });

			return MeteorEach;
		},
	});

// 尚未受理
	Template.NotAccepted.events({
		'click .BtnNotAccepted':(evt,tmp) => {
			evt.preventDefault();
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			const Index = evt.currentTarget.dataset.value;
			const userid  = $('[name=NotAccepteduserid' + Index + ']').val();
			const Orderid = $('[name=NotAcceptedOrderid' + Index + ']').val();
			const token = $('[name=NotAcceptedtoken' + Index + ']').val();
			let _title  = "";
			const _body = "您的餐點已經受理！請暢通網路等待取餐通知";
			Shop.forEach((ShopElem, ShopIndex)=>{
				_title = ShopElem.shopname;
			});
			Meteor.call('UpdateInfoTypeVing', Orderid, token, _title, _body, 2,
				(err,res)=>{
					if(res){
						alert("已進入下一階段...");
					}
				}
			);
		},
		'click .BtnRmMove':(evt,tmp) => {
			evt.preventDefault();
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			const Index = evt.currentTarget.dataset.value;
			const Orderid = $('[name=NotAcceptedOrderid' + Index + ']').val();
			const token = $('[name=NotAcceptedtoken' + Index + ']').val();
			let _title  = "";
			const _body = "您的訂單已取消!!!";
			Shop.forEach((ShopElem, ShopIndex)=>{
				_title = ShopElem.shopname;
			});
			Meteor.call('UpdateInfoTypeRmMove', Orderid, token,  _title, _body, (err,res) => {
					if(res){
						alert("已取消訂單...");
					}
				}
			);	
		},
	});
	// 解析記錄時間
	function ResolveTime(_time){
		let TmpArray = [];
		const dt = new Date( (_time * 1000) );
		TmpArray[0] = dt.getFullYear();
		TmpArray[1] = (dt.getMonth() + 1);
		TmpArray[2] = dt.getDate();
		TmpArray[3] = dt.getHours();
		TmpArray[4] = "0" + dt.getMinutes();
		return TmpArray;
	};

	Template.NotAccepted.helpers({
		NotAcceptedList(){
			MeteorEach = [];
			
			const Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()}).fetch();
			
			Shop.forEach((ShopElem, ShopIndex)=>{
				const UIF = Mongo_UserInfo.find({order: { $elemMatch: {
					        $and:[{
				            	timestamp: { 
				              		$gte: ShopElem.TimeStampOpen
				            	}
				          	},{
				            	timestamp: { 
				            		$lte: ShopElem.TimeStampClose
				          		}
				        	}]}}}).fetch();
				let Index = 0;
				UIF.forEach((UIFElem, UIFIndex)=>{
					const _order = UIFElem.order;
					_order.forEach((_orderElem, _orderIndex)=>{
						if ( ((_orderElem.timestamp >= ShopElem.TimeStampOpen) && 
							 (_orderElem.timestamp <= ShopElem.TimeStampClose)) ){

							if( ((_orderElem.type == 0) && 
								 (_orderElem.shopid == ShopElem._id)) ){
								let _date = ResolveTime(_orderElem.timestamp);
									_date = (_date[0] + '-' + _date[1] + '-' + _date[2] + ' ' + _date[3] + ':' + _date[4].substr(-2));
								const UO = Mongo_UserOrder.find({
												'_id': _orderElem.user_order_id
											}).fetch();
								UO.forEach((UOElem, UOIndex)=>{
									MeteorEach.push({
										index: Index,
										name: (UIFElem.user_school_identity),
										objid: UIFElem.users_to_id,
										email: UIFElem.user_school_mail_id,
										phone: UIFElem.import.phone,
										tokentype: ((UIFElem.import.token == "")?"0":"1"),
										token: UIFElem.import.token,
										date: _date,
										timestamp: _orderElem.timestamp,
										money: UOElem.money,
										orderid: _orderElem.user_order_id
									});
									Index++;
								});
							};
						};
					});
				});
			});
			
			MeteorEach.sort(function (a, b) {
              return a.timestamp - b.timestamp;
            });

			return MeteorEach;
		},
	});

// 口味
	Template.Taste.events({
		'click .BtnTaste':(evt,tmp) => {
			evt.preventDefault();
			const Index = evt.currentTarget.dataset.value;
			const tasteid = $('[name=tasteid' + Index + ']').val();
			const tastetype = parseInt($('[name=tastetype' + Index + ']').val());
			const tastename = $('[name=tastename' + Index + ']').val();
			let change = 1;
			if(tastetype){
				change = 0;
			};
			Meteor.call('UpdateFoodSauce', tasteid, change, (err,res)=>{
				if(res){
					alert(tastename + "已更新");
				};
			});
		},
	});
	Template.Taste.helpers({
		TasteList(){
			MeteorEach = [];
			
			const MFS = Mongo_FoodSauce.find({}).fetch();
			
			MFS.forEach((MFSElem, MFSIndex)=>{
				let _Type  = "關閉";
				let _Class = "danger";
				if( (MFSElem.status==0) ){
					_Type  = "開啟";
					_Class = "success";
				};
				MeteorEach.push({
					index: (MFSIndex + 1),
					objid: MFSElem._id,
					name: MFSElem.zh,
					Class: _Class,
					Type: _Type,
					Status: MFSElem.status
				});
			});

			return MeteorEach;
		},
	});

// 增加食物份量
	Template.Surplus.events({
		'click .BtnSurplus':(evt,tmp) => {
			evt.preventDefault();
			MeteorEach = [];
			const Index = evt.currentTarget.dataset.value;
			const surplusobjid = $('[name=surplusobjid' + Index + ']').val();
			const surplusname = $('[name=surplusname' + Index + ']').val();
			const FoodValue = parseInt(prompt("請輸入--" + surplusname + "--需要增加的量"));
			if( String(FoodValue) === "NaN"){
				alert("輸入錯誤....");
			}else{
				const YesNo = confirm("確定增加--" + FoodValue + 
									  "--這個份量至--" + surplusname + 
									  "--身上");
				if(YesNo){
					for(let i=0;i<FoodValue;i++){
						MeteorEach.push({
							count:1
						});
					};
					Meteor.call('UpdateFoodSurplus', surplusobjid, MeteorEach, 
						(err,res)=>{
						if(res){
							alert(surplusname + " 已增加 " + FoodValue + " 份量");
						};
					});
				};
			};
		},
	});

	Template.Surplus.helpers({
		SurplusList(){
			MeteorEach = [];
			
			const SSF = Mongo_ShopSingleFood.find({}).fetch();
			
			SSF.forEach((SSFElem, SSFIndex)=>{
				MeteorEach.push({
					index: (SSFIndex + 1),
					objid: SSFElem._id,
					name: SSFElem.zh,
					type: SSFElem.type,
					count: (SSFElem.surplus).length,
					money: SSFElem.money,
					Sauce: SSFElem.sauce
				});
			});

			MeteorEach.sort(function (a, b) {
              return a.count - b.count;
            });

			return MeteorEach;
		},
		SurplusSauceList(hub){
			MeteorEach = [];
			
			hub.forEach((hubElem, hubIndex)=>{
				if(String(hubElem.sauce) != "undefined"){
					const FS = Mongo_FoodSauce.find({'_id': hubElem.sauce}).fetch();
					FS.forEach((FSElem, FSIndex)=>{
						MeteorEach.push({
							name: FSElem.zh
						});
					});
				}else{
					const _hot  = hubElem.hot;
					const _cool = hubElem.cool;
					
					if( (String(_hot) != "undefined") ){
						_hot.forEach((_hotElem, _hotIndex)=>{
							const FS = Mongo_FoodSauce.find({
											'_id': _hotElem.hot
										}).fetch();
							FS.forEach((FSElem, FSIndex)=>{
								MeteorEach.push({
									name: FSElem.zh
								});
							});	
						});
						MeteorEach.push({
							name: '-----------------'
						});
					};

					if( (String(_cool) != "undefined") ){
						_cool.forEach((_coolElem, _coolIndex)=>{
							const FS = Mongo_FoodSauce.find({
											'_id': _coolElem.cool
										}).fetch();
							FS.forEach((FSElem, FSIndex)=>{
								MeteorEach.push({
									name: FSElem.zh
								});
							});	
						});
					};

				};
			});

			return MeteorEach;
		},
	});

// 食物增加份量
	Template.SurplusDetail.helpers({
		SurplusDetailList(){
			MeteorEach = [];
			console.log(this._id);
			for(let i=0; i<51; i++){
				MeteorEach.push({
					sauceid: '',
					saucename: ''
				});	
			};

			return MeteorEach;
		},
	});

	Template.SurplusDetail.events({

	});


// 商家資訊
	Template.Info.events({
		'click [name=btnphone]':(evt,tmp)=>{
			evt.preventDefault();
			const phone = prompt("請商家手機號碼");
			if(String(phone) != ""){
				Meteor.call('OpenClose', Meteor.userId(), 'phone', phone, (err,res)=>{
					if(res){
						alert("商家手機號碼已修正");
					};
				});	
			};
		},
		'click [name=btnopen]':(evt,tmp)=>{
			evt.preventDefault();
			const Time = parseInt(prompt("請輸入開店時間"));
			if( String(Time) === "NaN"){
				alert("輸入錯誤....");
			}else{
				Meteor.call('OpenClose', Meteor.userId(), 'open', Time, (err,res)=>{
					if(res){
						alert("開店時間已修正");
					};
				});
			};
		},
		'click [name=btnclose]':(evt,tmp)=>{
			evt.preventDefault();
			const Time = parseInt(prompt("請輸入閉店時間"));
			if( String(Time) === "NaN"){
				alert("輸入錯誤....");
			}else{
				Meteor.call('OpenClose', Meteor.userId(), 'close', Time, (err,res)=>{
					if(res){
						alert("閉店時間已修正");
					};
				});
			};
		},
		'click [name=btnstatus]':(evt,tmp)=>{
			evt.preventDefault();
			const _status = parseInt($('[name=InfoStatus]').val());
			let change = 1;
			let name = "開門";
			if(_status){
				change = 0;
				name = "關門";
			};
			Meteor.call('DoorOpenClose', Meteor.userId(), change, (err,res)=>{
				if(res){
					alert(name);
				};
			});
		},
	});
	const btnclass = ['success','danger'];
	Template.Info.helpers({
		InfoEach(){
			MeteorEach = [];
			const _Shop = Mongo_Shop.find({'user_to_id': Meteor.userId()});
			_Shop.forEach((_ShopElem,_ShopIndex)=>{
				MeteorEach.push({
					phone: _ShopElem.phone,
					open: _ShopElem.open,
					close: _ShopElem.close,
					shopstatus: (_ShopElem.type!=0)?"開店":"閉店",
					btnclass: btnclass[_ShopElem.type],
					name: (_ShopElem.type==0)?"開店":"閉店",
					status: _ShopElem.type
				});	
			});
			return MeteorEach;
		},
	});

// 註冊
	Template.RegisterOfPhone.events({
		'submit form':(evt,tmp)=>{
			evt.preventDefault();
			const target	 = evt.target;
		    const shopname 	 = target.shopname.value;
		    const SchoolSelect = target.SchoolSelect.value;
		    const phone = target.phone.value;
		    const pwd 	= target.pwd.value;
		    const opentime 	 = parseInt(target.opentime.value);
		    const closetime  = parseInt(target.closetime.value);
		    
		    const dateTime 	 = Date.now();
			const _timestamp = Math.floor(dateTime / 1000);
			const InsertObj = {
			    user_to_id : "",
			    shopname : shopname,
			    school : SchoolSelect,
			    phone : phone,
			    pic : "",
			    wait : 0,
			    open : opentime,
			    close : closetime,
		        token : '',
		        uuid : '',
		        platform : '',
		        type: 0,
			    linelist : [],
			    date : new Date()
			};
			if(shopname == ""){
				alert('商家名稱未填寫');
			}else{
				if((SchoolSelect == "--選擇學校--")){
					alert('尚未選學校');
				}else{
					if( phone == ""){
						alert('手機未填寫');
					}else{
						if( pwd == "" ){
							alert('密碼未填寫');
						}else{
							if( (opentime == "") || (closetime == "") ){
								alert('時間未填寫');
							}else{
								Accounts.createUser({
							        email: ((phone + '@jnad1798.com').toLowerCase()),
							        password: pwd,
							        profile: {
							            createDate: new Date()
							        }
							    },(err) => {
							    	// window.plugins.spinnerDialog.show("", "帳戶建立中..");
						        	InsertObj.user_to_id = Meteor.userId();
						        	Meteor.call('CreateShopInfo', InsertObj, Meteor.userId() , 
						        		(err,res)=>{
						        			if(res){
						        				alert('註冊成功，請再次登入...');
						        				Router.go('post.login');
						        			};
						        		}
						        	);
							    });	
							};
						};
					};
				};
			};
		},
	});

// 登入
	Template.login.events({
		'submit form':(evt,tmp)=>{
			evt.preventDefault();
			const target 	 = evt.target;
		    const vUserEmail = target.userphone.value + '@jnad1798.com';
		    const vUserPwd 	 = target.userpwd.value;
			Meteor.loginWithPassword(vUserEmail, vUserPwd, function (err) {
				if(err){
					target.userphone.value = '';
					target.userpwd.value   = '';
					alert("帳號或是密碼有誤");
				}else{
					// FCMPlugin.getToken(function (GetToken){
					// 	const _id = Meteor.userId();
					// 	const _platform = device.platform;
					// 	const _token = GetToken;
					// 	const _uuid  = device.uuid;
						// Meteor.call('UpdateShop', _id, _token, _uuid, _platform,
						// 	(err,res) => {
						// 	if(res){
						// 		target.userphone.value = '';
						// 		target.userpwd.value   = '';
								Router.go('post.MainTmp');
						// 	};
						// });
					// });
				};
			});
		},
		'click #btn_register':(evt,tmp)=>{
			evt.preventDefault();
			Router.go('post.RegisterOfPhone');
		},
	});

