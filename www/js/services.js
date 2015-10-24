angular.module('starter.services', [])

.service('httpService', function(){

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
    // httpService.request(
    //   "GET",
    //   "/rooms/00/users",
    //   {}
    //   ).success(function(data){
    //     if(data.statusCode === "200"){
    //       deferred.resolve(data.result);
    //     }else{
    //       deferred.reject("获取用户列表失败");
    //     }
    //   }).error(function(data){
    //     deferred.reject("暂时无法获取用户列表");
    //   });

    deferred.resolve(chats);

    return deferred.promise
  };

  this.get = function(uid){
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
    // httpService.request(
    //   "GET",
    //   "/users/"+uid,
    //   {}
    //   ).success(function(data){
    //     if(data.statusCode === "200"){
    //       deferred.resolve(data.result);
    //     }else{
    //       deferred.reject("获取用户列表失败");
    //     }
    //   }).error(function(data){
    //     deferred.reject("暂时无法获取用户列表");
    //   });

    return deferred.promise

  };


});
