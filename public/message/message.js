function messageDirective() {
  return {
    restrict: 'E',
    templateUrl: function(elem, attr){
      return 'message/message.html';
    }
  };
}