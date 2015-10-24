angular.module('starter.services', [])
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// 通知服务
.factory('NotificationService', function($rootScope, $timeout){
  return {
    set: function(message, typehood){
      $rootScope.notification.typehood = "notification-"+typehood;
      switch (typehood) {
        case "success":
          $rootScope.notification.icon = "ion-checkmark-circled";
          break;
        case "warning":
          $rootScope.notification.icon = "ion-information-circled";
          break;
        case "danger":
          $rootScope.notification.icon = "ion-minus-circled";
          break;
        default:
          $rootScope.notification.icon = "ion-alert-circled";
      }
      $rootScope.notification.message = message;
      $rootScope.notification.show = true;
      $timeout(function () {
        $rootScope.notification.show = false;
        if (window.StatusBar) {
          StatusBar.show();
        }
      }, 2000);
    }
  };
})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.service('httpSrvc', function($http){

  var bbHost = ""

  this.request = function(method, url, data) {
    console.log("httpRequest: ", data);
    return $http({
      url: bbHost + url,
      method: method,
      headers: {
        "Content-Type":"application/x-www-form-urlencoded"
      },
      data: data,
    });
  };

})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.service('ComSrvc', function($q, httpSrvc){

  this.usrUid = 0;

  this.enterRoom = function(roomId){
    console.log("roomId: ", roomId);
    var deferred = $q.defer();
    // 静态
    deferred.reject(roomId);
    // httpSrvc.request(
    //   "GET",
    //   "http://10.2.200.203:8080/api/try",
    //   {}
    //   ).success(function(data){
    //     console.log("tryApi success: ", data);
    //   }).error(function(data){
    //     console.log("tryApi error: ", data);
    //   });

    // httpSrvc.request(
    //   "POST",
    //   "/rooms/00/verify",
    //   {
    //     code: roomId
    //   }
    //   ).success(function(data){
    //     if(data.code === "200"){
    //       deferred.resolve(data.data);
    //     }else{
    //       console.log(data.message);
    //       deferred.reject("验证房间失败");
    //     }
    //   }).error(function(data){
    //     deferred.reject("暂时无法验证房间");
    //   });
    return deferred.promise
  }

})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.service('Chats', function($q) {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  this.chats = [{
      uid: 0,
      name: 'Ben Sparrow',
      title: "ceo",
      info: 'You on your way?',
      location: '13700000000',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }, {
      uid: 1,
      name: 'Max Lynx',
      title: "ceo",
      info: 'Hey, it\'s me',
      location: '13700000000',
      image: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
    }, {
      uid: 2,
      name: 'Adam Bradleyson',
      title: "ceo",
      info: 'I should buy a boat',
      location: '13700000000',
      image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
    }, {
      uid: 3,
      name: 'Perry Governor',
      title: "ceo",
      info: 'Look at my mukluks!',
      location: '13700000000',
      image: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
    }, {
      uid: 4,
      name: 'Mike Harrington',
      title: "ceo",
      info: 'This is wicked good ice cream.',
      location: '13700000000',
      image: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
    }];

  this.allChats = function(){
    var deferred = $q.defer();
    // httpSrvc.request(
    //   "GET",
    //   "/rooms/00/users",
    //   {}
    //   ).success(function(data){
    //     if(data.code === "200"){
    //       deferred.resolve(data.data);
    //     }else{
    //       console.log(data.message);
    //       deferred.reject("获取用户列表失败");
    //     }
    //   }).error(function(data){
    //     deferred.reject("暂时无法获取用户列表");
    //   });

    deferred.resolve(this.chats);

    return deferred.promise
  };

  this.getAChat = function(uid){
    var deferred = $q.defer();

    // 静态
    var rs = {}
    this.chats.forEach(function(chat){
      if(chat.uid == uid){
        rs = chat;
      };
    });
    deferred.resolve(rs);

    // // 拉后台
    // httpSrvc.request(
    //   "GET",
    //   "/users/"+uid,
    //   {}
    //   ).success(function(data){
    //     if(data.code === "200"){
    //       deferred.resolve(data.data);
    //     }else{
    //       console.log(data.message);
    //       deferred.reject("获取用户列表失败");
    //     }
    //   }).error(function(data){
    //     deferred.reject("暂时无法获取用户列表");
    //   });

    return deferred.promise

  };


});
