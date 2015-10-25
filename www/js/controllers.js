angular.module('starter.controllers', [])
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('ComCtrl', function($scope, $rootScope,$ionicModal, $state, ComSrvc, NotificationService, Chats, localStorageService){
  $scope.iH = 'http://7xnrw2.com2.z0.glb.qiniucdn.com/';
  $rootScope.notification = {
			typehood: "",
			icon: "",
			message: "",
			show: false
	};
  $scope.regInfo = function() {
    ComSrvc.regInfo($scope.reg).then(function(msg){
      // bind user uid
      // ComSrvc.usrUid = $scope.reg.uid;
      localStorageService.set("usrUid", $scope.reg.uid);
      ComSrvc.usrEnterRoom('sf-2015', ComSrvc.usrUid()).then(function(enterMsg){
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
    ComSrvc.upInfo($scope.reg).then(function(msg){
      if(!pureEdit){
        // bind user uid
        // ComSrvc.usrUid = $scope.reg.uid;
        localStorageService.set("usrUid", $scope.reg.uid);
        ComSrvc.usrEnterRoom('sf-2015', ComSrvc.usrUid()).then(function(enterMsg){
          NotificationService.set(enterMsg, "success");
          $state.go('tab.chats');
          $scope.modal.hide();
        },function(enterMsg){
          NotificationService.set(enterMsg, "warning");
        });
      }else{
          NotificationService.set("修改成功", "success");
          $rootScope.$broadcast('updateAccount');
          $scope.modal.hide();
      };
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
var dPIC = $scope.iH + (parseInt(Math.random()*100)%20+1) + ".png";
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
    // ComSrvc.usrUid = this.usrUid;
    localStorageService.set("usrUid", this.usrUid);
    Chats.getAChat(ComSrvc.usrUid()).then(function(chat){
      NotificationService.set("取回成功", "success");
      // 如果有信息把按钮变成修改按钮
      $scope.login.status = true;
      $scope.reg = chat;
    },function(chat){
      NotificationService.set("没有该用户", "warning");
     $scope.reg = ComSrvc.deepCopy(regPrototype);
    });
  },
  status: false, // false 为注册按钮，true 为修改按钮
  pureEdit: false
};
// 取回信息
 $scope.login = ComSrvc.deepCopy(loginPrototype);
 $scope.sPIC = function() {
   $scope.reg.image = $scope.iH + (parseInt(Math.random()*100)%20+1) + ".png";
 };
 /* 通知 ----------------------------------------------------------------------*/

 $scope.poke = function(pokeId) {
   Chats.poke(ComSrvc.usrUid(), pokeId).then(function(pMsg){
     NotificationService.set(pMsg, "success");
   },function(pMsg){
     NotificationService.set(pMsg, "warning");
   })
 };

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
.controller('ChatsCtrl', function($scope, $state, Chats, ComSrvc, NotificationService) {
  var getAllChats = function(){
    Chats.allChats(ComSrvc.usrUid()).then(function(chats){
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
.controller('AccountCtrl', function($rootScope, $scope, $state, Chats, ComSrvc, NotificationService) {

  var getAChat = function(){
    Chats.getAChat(ComSrvc.usrUid()).then(function(chat){
      $scope.usrInfo = chat;
    },function(chat){
      console.log(chat);
    });    
  };
  getAChat();
  $rootScope.$on('updateAccount', function(){
    getAChat();
  });

  Chats.getPokes(ComSrvc.usrUid()).then(function(mPokes){
    $scope.pl = mPokes;
  },function(mPokes){
    NotificationService.set(mPokes, "warning");
  })

  $scope.ex = function() {
    ComSrvc.usrExRoom('sf-2015', ComSrvc.usrUid()).then(function(msg){
      $state.go('enter');
    },function(msg){
      $state.go('enter');
      NotificationService.set(msg, "warning");
    });
  };
});
