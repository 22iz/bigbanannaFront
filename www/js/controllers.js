angular.module('starter.controllers', [])
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
// $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
.controller('ComCtrl', function($scope, $rootScope,$ionicModal, $state, Cropper, ComSrvc, NotificationService, Chats){
  $rootScope.notification = {
			typehood: "",
			icon: "",
			message: "",
			show: false
	};
  $scope.er = function() {
    $state.go('tab.chats');
    $scope.modal.hide();
  }
  $ionicModal.fromTemplateUrl('templates/modal-edit.html', {
   scope: $scope,
   animation: 'slide-in-up'
 }).then(function(modal) {
   $scope.modal = modal;
 });
 $scope.openModal = function(fromState, roomId) {
  if(fromState == "entry"){
    ComSrvc.enterRoom(roomId).then(function(rsEntry){
     $scope.modal.show();
    },function(rsEntry){
      // 全局提示
      NotificationService.set(rsEntry, "warning");
    })
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
 $scope.reg = {
   image: dPIC,
   name: '',
   title: '',
   info: '',
   location: '',
 };
// 取回信息
 $scope.login = {
  usrUid: '',
  getUsrInfo: function(){
    ComSrvc.usrUid = this.usrUid;
    Chats.getAChat(ComSrvc.usrUid).then(function(chat){
      $scope.reg = chat;
    },function(chat){
      console.log(chat);
    });
  }
 };

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
.controller('ChatsCtrl', function($scope, $state, Chats) {
  Chats.allChats().then(function(chats){
    $scope.chats = Chats.chats;
  },function(chats){
    console.log(chats);
  });
  $scope.remove = function(chat) {
    Chats.remove(chat);
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
.controller('AccountCtrl', function($scope, $state, Chats, ComSrvc) {
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
  ]
  Chats.getAChat(ComSrvc.usrUid).then(function(chat){
    $scope.usrInfo = chat;
  },function(chat){
    console.log(chat);
  });
  $scope.ex = function() {
    $state.go('enter');
  };
});
