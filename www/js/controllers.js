angular.module('starter.controllers', [])
.controller('ComCtrl', function($scope, $ionicModal, $state){
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
})
.controller('EnterCtrl', function($scope, $ionicModal, $state) {
})
.controller('ChatsCtrl', function($scope, $state, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  $scope.chats = Chats.chats;
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})
.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
  console.log($scope.chat);
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
