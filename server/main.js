import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email'
import { HTTP } from 'meteor/http'
import { check } from 'meteor/check'
import '/imports/MongoDBCollection.js';

Meteor.startup(function () {
	var mqtt = require('mqtt');
    var PORT = "1919";
    var userName = 'jnadtechmqtt';
    var userPasswd = 's123';
    var options = {
        port: PORT,
        username: userName,
        password: userPasswd,
    }
	// client call Server
    Meteor.methods({
    	// Sms
    	GetSms:()=>{
    		HTTP.call('GET', 'http://api.every8d.com/API21/HTTP/getCredit.ashx', {
		    	params: { 
		    		UID: "0972153032",
		    		PWD: "5a33",
		    	}
		    }, (err, res)=>{
		    	Mongo_Shop.update({'_id':'Dbn45YndpH4w3JhNL'},{ 
				   	$set: {
				   		"sms" : res.content
				    }
				});
		    });
		    return 1;
    	},
    	// 修改尚未受理Order
    	NotAccepteMdy:(_token, orderid, _hub, _money)=>{
    		Mongo_UserOrder.update({ '_id': orderid },{
	            $set: {
	              foodlist: _hub,
	              money: _money
	            }
	        });
	        const _title = "卡利亞里";
			const _body  = "您已經訂單已修正";
			if(_token !== ""){
				const result = HTTP.call('GET', 'http://203.67.248.85:9484/Ving', {
			    	params: { 
			    		title: _title,
			    		body: _body,
			    		token: _token,
			    		route: 'Notifi',
			    		alertsay: _body
			    	}
			    });
			};
    		return 1;
    	},
    	// 給予購物金
    	UpShoppingMoney:(objid, _token)=>{
    		Mongo_UserInfo.update({
    			'_id': objid,
		    	'notifi': {
					$elemMatch: {
						user_notifi_id:'5b1dbf52570d5bc42d35d27f'
					}
				}
			},{ 
			   	$set: {
			   		"notifi.$.check" : 1
			    }
			});
			const _title = "卡利亞里";
			const _body  = "您已經獲得購物金伍拾元整";
			if(_token !== ""){
				const result = HTTP.call('GET', 'http://203.67.248.85:9484/Ving', {
			    	params: { 
			    		title: _title,
			    		body: _body,
			    		token: _token,
			    		route: 'Notifi',
			    		alertsay: _body
			    	}
			    });
			};
			return 1;
    	},
    	// 取消訂單至尚未受理
    	UpdateInfoTypeRmMove:(objid, _token, _title, _body)=>{
    		Mongo_UserInfo.update({
		    	'order': {
					$elemMatch: {
						'user_order_id': objid
					}
				}
			},{ 
			   	$set: {
			   		"order.$.type" : 3
			    }
			});
			if(_token !== ""){
				const result = HTTP.call('GET', 'http://203.67.248.85:9484/Ving', {
			    	params: { 
			    		title: _title,
			    		body: _body,
			    		token: _token,
			    		route: 'Record',
			    		alertsay: _body
			    	}
			    });
			};
			return 1;
    	},
    	// 成功交易
    	BusinessDeal:(objid, _token, _title, _body)=>{
    		Mongo_UserInfo.update({
		    	'order': {
					$elemMatch: {
						'user_order_id': objid
					}
				}
			},{ 
			   	$set: {
			   		"order.$.type" : 1
			    }
			});
			if(_token !== ""){
				const result = HTTP.call('GET', 'http://203.67.248.85:9484/Ving', {
			    	params: { 
			    		title: _title,
			    		body: _body,
			    		token: _token,
			    		route: 'MainTmp',
			    		alertsay: _body
			    	}
			    });
			};
			return 1;
    	},
    	// 更新至烹飪中/待取餐
    	UpdateInfoTypeVing:(objid, _token, _title, _body, _type)=>{
    		Mongo_UserInfo.update({
		    	'order': {
					$elemMatch: {
						'user_order_id': objid
					}
				}
			},{
			   	$set: {
			   		"order.$.type" : _type
			    }
			});

			if(_token !== ""){
				const result = HTTP.call('GET', 'http://203.67.248.85:9484/Ving', {
			    	params: { 
			    		title: _title,
			    		body: _body,
			    		token: _token,
			    		route: 'Record',
			    		alertsay: _body
			    	}
			    });
			};

			// const client = mqtt.connect('mqtt://jnadtechmqtt.com', options);
			// client.on('connect', function () {
			//   	client.publish('Im1798', objid);
			//   	console.log('MQTT');
			// });
			return 1;
    	},
    	// 更新食物份量
    	UpdateFoodSurplus:(objid, Hub)=>{
    		Mongo_ShopSingleFood.update({'_id': objid},{
	            $set: {
	              surplus : Hub
	            }
	        });

    		return 1;
    	},
    	// 閉店開店時間
    	OpenClose:(objid, type, Time)=>{
    		Mongo_Shop.update({'user_to_id': objid},{
	            $set: {
	              [type] : Time
	            }
	        });
    		return 1;
    	},
    	// 開關門
    	DoorOpenClose:(objid, change)=>{
    		Mongo_Shop.update({'user_to_id': objid},{
	            $set: {
	              'type': change
	            }
	        });
    		return 1;
    	},
    	// 口味
    	UpdateFoodSauce:(tasteid, change)=>{
    		Mongo_FoodSauce.update({'_id': tasteid},{
	            $set: {
	              'status': change
	            }
	        });
    		return 1;
    	},
    	// 商家Info
    	CreateShopInfo:(obj, Usersid,)=>{
    		Mongo_Shop.insert(obj);
    		return 1;
    	},
    	// SERVER See Log 
		ShowLog:(vlog)=>{
	        console.log(vlog);
	    },
    });

    // publish
	    // UserInfo
	      Meteor.publish('UserInfo', function () {
	          return [ Mongo_UserInfo.find()];
	      });
	    // UserNotifi
	      Meteor.publish('UserNotifi', function () {
	          return [Mongo_UserNotifi.find()];
	      });
	    // UserOrder
	      Meteor.publish('UserOrder', function () {
	          return [Mongo_UserOrder.find()];
	      });
	    // Shop
	      Meteor.publish('Shop', function () {
	          return [Mongo_Shop.find()];
	      });
	    // ShopSingleFood
	      Meteor.publish('ShopSingleFood', function () {
	          return [Mongo_ShopSingleFood.find()];
	      });
	    // ShopSingleMenu
	      Meteor.publish('ShopSingleMenu', function () {
	          return [Mongo_ShopSingleMenu.find()];
	      });
	    // ShopDoubleFood
	      Meteor.publish('ShopDoubleFood', function () {
	          return [Mongo_ShopDoubleFood.find()];
	      });
	    // FoodSauce
	      Meteor.publish('FoodSauce', function () {
	          return [Mongo_FoodSauce.find()];
	      });
	    // Downtown
	      Meteor.publish('Downtown', function () {
	          return [Mongo_Downtown.find()];
	      });
	    // City
	      Meteor.publish('City', function () {
	          return [Mongo_City.find()];
	      });

});