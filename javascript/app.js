/* global ; */
window.mobilecheck = function() {
  var check = false;
  (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
  return check;
}

document.body.classList.add(window.mobilecheck() ? 'is-mobile' : 'is-not-mobile');

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

var app = angular.module('app', ['angularRipple', 'angular-carousel', 'hc.marked'], function($interpolateProvider) {
  $interpolateProvider.startSymbol('[[');
  $interpolateProvider.endSymbol(']]');
});

app.config(['markedProvider', function (markedProvider) {
  markedProvider.setOptions({gfm: true});
}]);


app.filter('quotes', function() {
    return function (text) {
        if(text) {
            return text.replaceAll('‘', '\'').replaceAll('“', '\"');    
        }
    };
});

app.filter('noHttp', function() {
    return function (text) {
        if(text) {
            return text.replaceAll('http://', '');    
        }
    };
});

app.controller("SliderController", function($scope, $timeout, $location){
    $scope.index = 0;
    
    var running = false;
    var run = function(){
      running = true;
      setTimeout(function(){
        running = false;    
      },300);
    };
    $scope.prev = function(){
        if($scope.index === 0) return;
        $scope.index--;
        run();  
    }
    $scope.next = function(){
        if($scope.index === $scope.slides.length - 1) return;
        $scope.index++;
        run();
    }
    
    $scope.prevSlide = null;    
    $scope.nextSlide = null;
    
    var setUrl = function(){
        if($scope.slides.length < 2) return;
        $location.path($scope.index + 1);
    };
    
    var getUrl = function(){       
        var pathId = $location.path().substring(1);
        
        if (pathId > $scope.slides.length || pathId < 1) {
            $scope.index = 0;
            $scope.$apply();
        } 
        else {
            $scope.index = pathId - 1;
            $scope.$apply();
        }
    };
    
    

    document.addEventListener("keydown", function(e){      
        if(running || $scope.slides.length < 2) return;
        
        if (e.which == 37) $scope.prev();
        if (e.which == 39) $scope.next();
        
        $scope.$apply();  
    });
    
    $scope.$watch('index', function() {
        if ($scope.slides[$scope.index].theme === "light") {
            document.body.classList.add('theme-light');
        }
        else if (document.body.classList.contains('theme-light')){
            document.body.classList.remove('theme-light');
        }
        
         if ($scope.slides && $scope.slides.length > 1) {
            var prev = $scope.slides[$scope.index - 1];
            var next = $scope.slides[$scope.index + 1];
            
            $scope.prevSlide = prev ? prev : null;    
            $scope.nextSlide = next ? next : null;
        }
        
        $timeout(function(){
            setUrl();
        },10);
    });
    
    window.addEventListener('load', getUrl);
    window.addEventListener('hashchange', getUrl);

})