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

  // var bbHost = "";
  // local
  // var bbHost = "http://10.2.200.203:8080/api/";
  // release
  // var bbHost = "/api/";
  var bbHost = "http://bb.introme.so/api/";


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
    // deferred.resolve(roomId);
    // httpSrvc.request(
    //   "GET",
    //   // "http://10.2.200.203:8080/api/try",
    //   "http://sf-2015.bitinn.net/api/try",
    //   {}
    //   ).success(function(data){
    //     console.log("tryApi success: ", data);
    //   }).error(function(data){
    //     console.log("tryApi error: ", data);
    //   });

    httpSrvc.request(
      "POST",
      "rooms/sf-2015/verify",
      "code=" + roomId
      ).success(function(data){
        if(data.code === 200){
          console.log("verify: ", data);
          deferred.resolve("验证成功");
        }else{
          console.log("verify: ", data);
          deferred.reject("验证房间失败");
        }
      }).error(function(data){
        console.log("verify: ", data);
        deferred.reject("暂时无法验证房间");
      });
    return deferred.promise
  };

  var stringParams = function(infoDict){
    var str = [];
    for(i in infoDict){
      str.push(i+"="+infoDict[i]);
    }
    console.log(str.join("&"));
    return str.join("&")
  };

  this.regInfo = function(info){
    var deferred = $q.defer();
    httpSrvc.request(
      "POST",
      "users",
      stringParams(info)
      ).success(function(data){
        if(data.code === 200){
          console.log("regInfo: ", data);
          deferred.resolve(data.data);
        }else{
          console.log("regInfo: ", data);
          deferred.reject("注册失败");
        }
      }).error(function(data){
        if(data.code === 409){
          deferred.reject("已经注册，请取回")
        }else{
          console.log("regInfo: ", data);
          deferred.reject("暂时无法注册");
        };
      });
    return deferred.promise
  };

  this.upInfo = function(info){
    var deferred = $q.defer();
    httpSrvc.request(
      "PUT",
      "users/"+info.uid,
      stringParams(info)
      ).success(function(data){
        console.log("upInfo: ", data);
        if(data.code === 200){
          deferred.resolve(data.data);
        }else{
          console.log(data);
          deferred.reject("修改失败");
        }
      }).error(function(data){
        console.log("upInfo: ", data);
        deferred.reject("暂时无法修改");
      });
    return deferred.promise
  };

  this.usrEnterRoom = function(roomId, usrUid){
    var deferred = $q.defer();
    httpSrvc.request(
      "PUT",
      "rooms/"+roomId+"/users/"+usrUid,
      {}
      ).success(function(data){
        console.log("usrEnterRoom: ", data);
        if(data.code === 200){
          deferred.resolve("进入房间成功");
        }else{
          console.log(data);
          deferred.reject("进入房间失败");
        };
      }).error(function(data){
         if(data.code === 409){
            deferred.resolve("进入房间成功");
         }else{
          console.log("usrEnterRoom: ", data);
          deferred.reject("暂时无法进入房间");          
         };
      });
    return deferred.promise
  };

  this.usrExRoom = function(roomId, usrUid){
    var deferred = $q.defer();
    httpSrvc.request(
      "DELETE",
      "rooms/"+roomId+"/users/"+usrUid,
      {}
      ).success(function(data){
        console.log("usrExRoom: ", data);
        if(data.code === 200){
          deferred.resolve("退出房间成功");
        }else{
          console.log(data);
          deferred.reject("退出房间失败");
        }
      }).error(function(data){
        console.log("usrExRoom: ", data);
        deferred.reject("暂时无法退出房间");
      });
    return deferred.promise
  };


  // 取出 base64 格式的图片中的图片格式
  this.getImgExtention = function(base64Img){
    var picExt = base64Img.match(/^data:image\/([A-Za-z]+);base64,/)[1];
    if(picExt){
      // 图片格式在 picExt index 1
      return "." + picExt
    }else{
      return ".png"
    };
  };

  // 生成图片名字
  this.genImgName = function(base64Img){
    var imgTime = new Date();
    return CbAuthService.getUserCid()+"_"+imgTime.getTime()+this.getImgExtention(base64Img)
  };

  this.qiniuGetUpToken = function(imgName){
    var deferred = $q.defer();
    httpService.request(
      "POST",
      "qntokenPost",
      {
        imgName: imgName
      }
      ).success(function(data){
        if(data.msg === 200){
          console.log("SCC qn UpTokenInfo: ", data);
          deferred.resolve(data.result);
        }else{
          console.log(data);
          deferred.reject("获取七牛 token 失败！")
        }

      }).error(function(data){
        deferred.reject("暂时无法获取七牛 token！");
      });
    return deferred.promise
  };

  this.qiniuUpload = function(base64Img, upToken, imgNameBase64){
    indexOfComma = base64Img.search(/[,]/);
    base64Img = base64Img.slice(indexOfComma+1, -1);
    var deferred = $q.defer();
    // 七牛 base64 图片上传接口说明 http://kb.qiniu.com/5rroxdgb
    // POST /putb64/<Fsize>/key/<EncodedKey>/mimeType/<EncodedMimeType>/crc32/<Crc32>/x:user-var/<EncodedUserVarVal>
    // url "http://up.qiniu.com/putb64/-1/key/"+imgNameBase64
    // put64/ 后面跟图片大小，可以用 -1 直接用 request body 的大小
    // key/ 后面跟图片名字的 urlsave_base64
    httpService.requestQiniu(
      "POST",
      "http://up.qiniu.com/putb64/-1/key/"+imgNameBase64,
      base64Img,
      upToken
      ).success(function(data){
        deferred.resolve(data);
      }).error(function(data){
        console.log("FA qnUpload: ", data);
        deferred.reject(data);
      });
    return deferred.promise

  };

  this.deepCopy= function(source) {
    var result;
    if (Object.prototype.toString.call(source) === '[object Array]'){
      result=[];
    }else{
      result={};
    }
    for (var key in source) {
          result[key] = typeof source[key]==='object'? deepCopyToNew(source[key]):source[key];
    }
    return result;
  };



})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.service('Chats', function($q, httpSrvc) {
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
    httpSrvc.request(
      "GET",
      "rooms/sf-2015/users",
      {}
      ).success(function(data){
        console.log("allChats: ", data);
        if(data.code === 200){
          deferred.resolve(data.data);
        }else{
          console.log(data.message);
          deferred.reject("获取用户列表失败");
        }
      }).error(function(data){
        console.log("allChats: ", data);
        deferred.reject("暂时无法获取用户列表");
      });
    return deferred.promise
  };

  this.getAChat = function(uid){
    var deferred = $q.defer();

    // // 静态
    // var rs = {}
    // this.chats.forEach(function(chat){
    //   if(chat.uid == uid){
    //     rs = chat;
    //   };
    // });
    // deferred.resolve(rs);

    // 拉后台
    httpSrvc.request(
      "GET",
      "users/"+uid,
      {}
      ).success(function(data){
        console.log("getAChat: ", data);
        if(data.code === 200){
          deferred.resolve(data.data);
        }else{
          console.log(data.message);
          deferred.reject("获取用户列表失败");
        }
      }).error(function(data){
        if(data.code === 409){
          console.log(data);
        }
        console.log("getAChat: ", data);
        deferred.reject("暂时无法获取用户列表");
      });

    return deferred.promise

  };

  this.poke = function(usrUid, pokeId){

    var deferred = $q.defer();
    httpSrvc.request(
      "PUT",
      "users/"+usrUid+"/pokes/"+pokeId,
      {}
      ).success(function(data){
        console.log("poke: ", data);
        if(data.code === 200){
          deferred.resolve("捅成功");
        }else{
          console.log(data);
          deferred.reject("捅失败");
        };
      }).error(function(data){
         if(data.code === 409){
            deferred.reject("已经捅过了");
         }else{
          console.log("poke: ", data);
          deferred.reject("暂时无法捅");          
         };
      });
    return deferred.promise
  };

  this.getPokes = function(usrUid){
    var deferred = $q.defer();
    httpSrvc.request(
      "GET",
      "users/"+usrUid+"/pokes",
      {}
      ).success(function(data){
        console.log("getPokes: ", data);
        if(data.code === 200){
          deferred.resolve(data.data);
        }else{
          console.log(data.message);
          deferred.reject("获取被捅列表失败");
        }
      }).error(function(data){
        console.log("getPokes: ", data);
        deferred.reject("暂时无法获取被捅列表");
      });
    return deferred.promise
  };

});
