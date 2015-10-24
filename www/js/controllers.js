angular.module('starter.controllers', [])
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('ComCtrl', function($scope, $rootScope,$ionicModal, $state, Cropper, ComSrvc, NotificationService, Chats){
  $scope.imgHost = 'http://7xnrw2.com2.z0.glb.qiniucdn.com/';
  $rootScope.notification = {
			typehood: "",
			icon: "",
			message: "",
			show: false
	};
  $scope.regInfo = function() {
    // // 七牛上传图片返回地址
    // var imgName = ComSrvc.genImgName($scope.reg.image);
    // console.log(imgName);
    // ComSrvc.qiniuGetUpToken(imgName)
    //   .then(function(upTokenInfo){
    //     ComSrvc.qiniuUpload($scope.cbCardInfo.submitInfo.image, upTokenInfo["uptoken"], upTokenInfo["SaveKey"])
    //       .then(function(rsUp){
    ComSrvc.regInfo($scope.reg).then(function(msg){
      // bind user uid
      ComSrvc.usrUid = $scope.reg.uid;
      ComSrvc.usrEnterRoom('sf-2015', ComSrvc.usrUid).then(function(enterMsg){
        // 更新登录状态（编辑状态）
        $scope.login.status = true;
        NotificationService.set(enterMsg, "success");
        $state.go('tab.chats');
        $scope.modal.hide();
      },function(enterMsg){
        NotificationService.set(enterMsg, "warning");
      });
    },function(msg){
      NotificationService.set(msg, "warning");
    });
  };

  $scope.upInfo = function(pureEdit) {
    // // 七牛上传图片返回地址
    // var imgName = ComSrvc.genImgName($scope.reg.image);
    // console.log(imgName);
    // ComSrvc.qiniuGetUpToken(imgName)
    //   .then(function(upTokenInfo){
    //     ComSrvc.qiniuUpload($scope.cbCardInfo.submitInfo.image, upTokenInfo["uptoken"], upTokenInfo["SaveKey"])
    //       .then(function(rsUp){
    ComSrvc.upInfo($scope.reg).then(function(msg){
      // bind user uid
      ComSrvc.usrUid = $scope.reg.uid;
      ComSrvc.usrEnterRoom('sf-2015', ComSrvc.usrUid).then(function(enterMsg){
        NotificationService.set(enterMsg, "success");
        if(!pureEdit){
          $state.go('tab.chats');          
        };
        $scope.modal.hide();
      },function(enterMsg){
        NotificationService.set(enterMsg, "warning");
      })
    },function(msg){
      NotificationService.set(msg, "warning");
    });
  };
  $ionicModal.fromTemplateUrl('templates/modal-edit.html', {
   scope: $scope,
   animation: 'slide-in-up'
 }).then(function(modal) {
   $scope.modal = modal;
 });
 $scope.openModal = function(fromState, roomId) {
  if(fromState == "entry"){
    ComSrvc.enterRoom(roomId).then(function(rsEntry){
     $scope.reg = ComSrvc.deepCopy(regPrototype);
     $scope.login = ComSrvc.deepCopy(loginPrototype);
     $scope.modal.show();
    },function(rsEntry){
      // 全局提示
      NotificationService.set(rsEntry, "warning");
    })
  }else if(fromState == "account"){
    $scope.login.pureEdit = true;
   $scope.modal.show();
  }
 };
 $scope.closeModal = function() {
   $scope.modal.hide();
 };
 //Cleanup the modal when we're done with it!
 $scope.$on('$destroy', function() {
   $scope.modal.remove();
 });
 // Execute action on hide modal
 $scope.$on('modal.hidden', function() {
   // Execute action
 });
 // Execute action on remove modal
 $scope.$on('modal.removed', function() {
   // Execute action
 });
 /* 图片 ----------------------------------------------------------------------*/
var dPIC = "img/logo.png"
var regPrototype = {
  image: dPIC,
  name: '',
  title: '',
  info: '',
  location: '',
  uid: '',
};
 $scope.reg = ComSrvc.deepCopy(regPrototype);
var loginPrototype = {
  usrUid: '',
  getUsrInfo: function(){
    ComSrvc.usrUid = this.usrUid;
    Chats.getAChat(ComSrvc.usrUid).then(function(chat){
      // 如果有信息把按钮变成修改按钮
      $scope.login.status = true;
      $scope.reg = chat;
    },function(chat){
     $scope.reg = ComSrvc.deepCopy(regPrototype);
      console.log(chat);
    });
  },
  status: false, // false 为注册按钮，true 为修改按钮
  pureEdit: false
};
// 取回信息
 $scope.login = ComSrvc.deepCopy(loginPrototype);

 $scope.sPIC = function() {
   angular.element('#srPIC').trigger("click");
 };
 $scope.onFile = function(blob) {
   if (blob) {
     Cropper.encode((file = blob)).then(function(dataUrl) {
       $scope.reg.image = dataUrl;
     });
   } else {
    $scope.reg.image = dPIC;
   };
 };
 /* 通知 ----------------------------------------------------------------------*/

})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('EnterCtrl', function($scope, $ionicModal, $state) {

  $scope.roomInfo = {
    roomId: ''
  };

})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('ChatsCtrl', function($scope, $state, Chats, ComSrvc) {
  var getAllChats = function(){
    Chats.allChats().then(function(chats){
      // 静态
      // $scope.chats = Chats.chats;
      // 动态
      $scope.chats = chats;
    },function(chats){
      console.log(chats);
    });
  };
  getAllChats();
  $scope.doRefresh = function(){
    getAllChats();
    $scope.$broadcast('scroll.refreshComplete');
  };
  $scope.poke = function(pokeId) {
    Chats.poke(ComSrvc.usrUid, pokeId);
  };
})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  Chats.getAChat($stateParams.chatId).then(function(chat){
    $scope.chat = chat;
  },function(chat){
    console.log(chat);
  });
})
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('AccountCtrl', function($scope, $state, Chats, ComSrvc, NotificationService) {

  console.log("AccountCtrl: ", ComSrvc.usrUid);

  $scope.pl = [
    { name: 'HAHA',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    },
    { name: 'HAHA',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    },
    { name: 'HAHA',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    },
    { name: 'HAHA',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    },
    { name: 'HAHA',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    },
    { name: 'HAHA',
      image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
    }
  ];

  Chats.getAChat(ComSrvc.usrUid).then(function(chat){
    $scope.usrInfo = chat;
  },function(chat){
    console.log(chat);
  });
  $scope.ex = function() {
    ComSrvc.usrExRoom('sf-2015', ComSrvc.usrUid).then(function(msg){
      $state.go('enter');
    },function(msg){
      $state.go('enter');
      NotificationService.set(msg, "warning");
    });
  };
});
