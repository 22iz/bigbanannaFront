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
  $scope.regInfo = function() {
    // // 七牛上传图片返回地址
    // var imgName = ComSrvc.genImgName($scope.reg.image);
    // console.log(imgName);
    // ComSrvc.qiniuGetUpToken(imgName)
    //   .then(function(upTokenInfo){
    //     ComSrvc.qiniuUpload($scope.cbCardInfo.submitInfo.image, upTokenInfo["uptoken"], upTokenInfo["SaveKey"])
    //       .then(function(rsUp){
    $scope.reg.image = "13700000000_42700000000000.png";
    ComSrvc.regInfo($scope.reg).then(function(msg){
      // bind user uid
      ComSrvc.usrUid = $scope.reg.uid;
      // 更新登录状态（编辑状态）
      $scope.login.status = true;
      NotificationService.set(msg, "warning");
      $state.go('tab.chats');
      $scope.modal.hide();
    },function(msg){
      NotificationService.set(msg, "warning");
    });
  };

  $scope.upInfo = function() {
    // // 七牛上传图片返回地址
    // var imgName = ComSrvc.genImgName($scope.reg.image);
    // console.log(imgName);
    // ComSrvc.qiniuGetUpToken(imgName)
    //   .then(function(upTokenInfo){
    //     ComSrvc.qiniuUpload($scope.cbCardInfo.submitInfo.image, upTokenInfo["uptoken"], upTokenInfo["SaveKey"])
    //       .then(function(rsUp){
    ComSrvc.upInfo($scope.reg).then(function(msg){
      NotificationService.set(msg, "warning");
      $state.go('tab.chats');
      $scope.modal.hide();
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
// 取回信息
 $scope.login = {
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
    // 静态
    // $scope.chats = Chats.chats;
    // 动态
    $scope.chats = chats;
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
  console.log("AccountCtrl: ", ComSrvc.usrUid);
  Chats.getAChat(ComSrvc.usrUid).then(function(chat){
    $scope.usrInfo = chat;
  },function(chat){
    console.log(chat);
  });
  $scope.ex = function() {
    $state.go('enter');
  };
});
