angular.module('starter.controllers', [])
.controller('ComCtrl', function($scope, $ionicModal, $state, Cropper){
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
 $scope.openModal = function() {
   $scope.modal.show();
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
 /* 图片 ---------------------------------------------------------------------*/
var dPIC = "img/logo.png"
 $scope.reg = {
   pic: dPIC,
 }
 $scope.sPIC = function() {
   angular.element('#srPIC').trigger("click");
 };
 $scope.onFile = function(blob) {
   if (blob) {
     Cropper.encode((file = blob)).then(function(dataUrl) {
       $scope.reg.pic = dataUrl;
     });
   };
 };
})
.controller('EnterCtrl', function($scope, $ionicModal, $state) {
})
.controller('ChatsCtrl', function($scope, $state, Chats) {
  $scope.chats = Chats.chats;
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  Chats.get($stateParams.chatId).then(function(chat){
    $scope.chat = chat;
  },function(chat){
    console.log(chat);
  });
  // $scope.chat = Chats.get($stateParams.chatId);
  // $scope.chat = {
  //     uid: 0,
  //     name: 'Ben Sparrow',
  //     title: "ceo",
  //     info: 'You on your way?',
  //     location: '13700000000',
  //     image: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
  //   };
})
.controller('AccountCtrl', function($scope, $state) {
  $scope.ex = function() {
    $state.go('enter');
  };
});
