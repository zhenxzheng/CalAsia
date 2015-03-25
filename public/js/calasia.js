'use strict';
angular.module('calasia',['ngRoute'])
	.config(["$routeProvider", "$locationProvider", "$interpolateProvider", function ($routeProvider, $locationProvider, $interpolateProvider){
		$routeProvider
			.when('/',{
				templateUrl: 'partials/home'
			})
			.when('/programs',{
				templateUrl: 'partials/programs'
			})
			.when('/calendar',{
				templateUrl: 'partials/calendar',
				controller:"calendarCtrl"
			})
			.when('/login',{
				templateUrl: 'partials/login'
			})
			.when('/admin',{
				templateUrl: 'partials/admin',
				controller: 'adminCtrl'
			})
			.when('/addEvent',{
				templateUrl: 'partials/addEvent',
				controller:"addEventCtrl"
			})
			.when('/editEvent/:id',{
				templateUrl:'partials/addEvent',
				controller:"editEventCtrl"
			})
			.otherwise({
		      redirectTo: '/'
		    });
		$locationProvider.html5Mode(true);
		$interpolateProvider.startSymbol('[[');
  		$interpolateProvider.endSymbol(']]');
	}])
	.controller("calendarCtrl",function ($scope, $http){
		$http.get("/api/events").success(function(data, status, headers, config){
			$scope.events = data;
		})
	})
	.controller("addEventCtrl",function ($scope, $http, $location){
		$scope.form = {};
		$scope.form.date = {};
		$scope.form.eventTime = {};
		$scope.form.registration = {};
		(function(){
		    $scope.form.date.full = new Date();
		    $scope.form.registration.date = new Date();
		})();
		$scope.submitEvent = function () {
			$scope.form.eventType = $('input[name=eventType]:checked', 'form').val();
			if($scope.form.date.full){
				var monthArr = ["January","February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				$scope.form.date.string = weekdayArr[$scope.form.date.full.getDay()] +", "+monthArr[$scope.form.date.full.getMonth()]+" "+$scope.form.date.full.getDate()+", "+$scope.form.date.full.getFullYear();
			}
			if($scope.form.images!=undefined) $scope.form.images = $scope.form.images.split(/, */);
			if($scope.form.speakers!=undefined) $scope.form.speakers = $scope.form.speakers.split(/, */);
			if($scope.form.sponsors!=undefined) $scope.form.sponsors = $scope.form.sponsors.split(/, */);

			if ($scope.form.description===undefined){
				alert("Empty body");
				return;
			}
			else{
				$scope.form.description = $scope.form.description.match(/^.+/mg);
			}
			if ($scope.form.schedule===undefined){
				alert("Empty body");
				return;
			}
			else{
				$scope.form.schedule = $scope.form.schedule.match(/^.+/mg);
			}
			if($scope.form.eventTime.full){
				var hours = $scope.form.eventTime.full.getHours();
				var minutes = $scope.form.eventTime.full.getMinutes();
				var AMPM = hours >= 12 ? 'PM' : 'AM';
				hours = hours % 12;
				hours = hours ? hours : 12;
				minutes = minutes < 10 ? '0'+minutes : minutes;
				$scope.form.eventTime.string = hours + ':' + minutes + ' ' + AMPM;
			}
			$scope.form.past = new Date > $scope.form.date.full;
			$http.post('/api/events/new', $scope.form).
			  success(function(data) {
			  	alert("event added");
			  	$location.path('/admin');
			  });
		};
	})
	.controller("editEventCtrl", function ($scope, $http, $location, $routeParams){
		$scope.form = {};
		$http.get('/api/event/' + $routeParams.id).
		success(function(data) {
			$scope.form = data.event;
			$scope.form.description = $scope.form.description.join("\r\r");
			$scope.form.schedule = $scope.form.schedule.join("\r\r");
			if($scope.form.speakers!=undefined) $scope.form.speakers = $scope.form.speakers.join(", ");
			if($scope.form.sponsors!=undefined) $scope.form.sponsors = $scope.form.sponsors.join(", ");
			if($scope.form.image!=undefined) $scope.form.image = $scope.form.image.join(", ");
			$scope.form.date.full = new Date($scope.form.date.full);
			$scope.form.eventTime.full = new Date($scope.form.eventTime.full);
			$scope.form.registration.date = new Date($scope.form.registration.date);
			$(':radio[value='+$scope.form.eventType+']').attr('checked',true);
		});

		$scope.submitEvent = function () {
			$scope.form.eventType = $('input[name=eventType]:checked', 'form').val();
			if($scope.form.date.full){
				var monthArr = ["January","February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				$scope.form.date.string = weekdayArr[$scope.form.date.full.getDay()] +", "+monthArr[$scope.form.date.full.getMonth()]+" "+$scope.form.date.full.getDate()+", "+$scope.form.date.full.getFullYear();
			}
			if($scope.form.images!=undefined) $scope.form.images = $scope.form.images.split(/, */);
			if($scope.form.speakers!=undefined) $scope.form.speakers = $scope.form.speakers.split(/, */);
			if($scope.form.sponsors!=undefined) $scope.form.sponsors = $scope.form.sponsors.split(/, */);

			if ($scope.form.description===undefined){
				alert("Empty body");
				return;
			}
			else{
				$scope.form.description = $scope.form.description.match(/^.+/mg);
			}
			if ($scope.form.schedule===undefined){
				alert("Empty Schedule");
				return;
			}
			else{
				$scope.form.schedule = $scope.form.schedule.match(/^.+/mg);
			}
			if($scope.form.eventTime.full){
				var hours = $scope.form.eventTime.full.getHours();
				var minutes = $scope.form.eventTime.full.getMinutes();
				var AMPM = hours >= 12 ? 'PM' : 'AM';
				hours = hours % 12;
				hours = hours ? hours : 12;
				minutes = minutes < 10 ? '0'+minutes : minutes;
				$scope.form.eventTime.string = hours + ':' + minutes + ' ' + AMPM;
			}
			$scope.form.past = new Date > $scope.form.date.full;
			$http.put('/api/event/' + $routeParams.id, $scope.form).
				success(function(data) {
					$location.url('/admin');
				});
		};
	})
	.controller("adminCtrl", function ($scope, $http, $timeout){
		$http.get('/api/events').success(function(data, status, headers, config){
			var monthArr = ["January","February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
			var weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
			$scope.events = data;
			$scope.count = $scope.events.length;
			$scope.events.forEach(function(item, i){
				item.sponsors = item.sponsors.join(", ");
				item.registration.date = new Date(item.registration.date);
				item.registration.date = weekdayArr[item.registration.date.getDay()] +", "+monthArr[item.registration.date.getMonth()]+" "+item.registration.date.getDate()+", "+item.registration.date.getFullYear()
			})
		})
		$scope.deleteEvent = function(id){
		    var current = "#"+id;
		    if(confirm("Are you sure you want to delete this event?")==true){
		      $http.delete('api/events/'+id)
		        .success(function(data){
		          $(current).fadeOut("fast");
		          $scope.count--;
		        })
		    }
		}
	})
Date.prototype.formatDate = function () {
  var monthArr = ["January","February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return weekdayArr[this.getDay()] +", "+monthArr[this.getMonth()]+" "+this.getDate()+", "+this.getFullYear();
}

Date.prototype.convertDate = function(){
  var month = (this.getMonth()+1).toString();
  var date = this.getDate().toString();
  return this.getFullYear() + "-" + (month.length==2?month:"0"+month[0])+"-"+(date.length==2?date:"0"+date[0]);
}

function getDateObj(dateString){
  // var data = dateString.split("-");
  // var month = (parseInt(data[1])-1).toString();
  return  new Date(dateString);
}
