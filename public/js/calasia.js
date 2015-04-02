'use strict';
angular.module('calasia',['ngRoute','ngSanitize'])
	.config(["$routeProvider", "$locationProvider", "$interpolateProvider", function ($routeProvider, $locationProvider, $interpolateProvider){
		$routeProvider
			.when('/',{
				templateUrl: 'partials/home',
				controller: "homeCtrl"
			})
			.when('/programs',{
				templateUrl: 'partials/programs',
				controller:"programsCtrl"
			})
			.when('/programs/:year',{
				templateUrl: 'partials/programs',
				controller: "programsCtrl"
			})
			.when('/calendar',{
				templateUrl: 'partials/calendar',
				controller:"calendarCtrl"
			})
			.when('/resources',{
				templateUrl: 'partials/resources',
				controller:"resourcesCtrl"
			})
			.when('/resources/:country',{
				templateUrl: 'partials/resources',
				controller:"resourcesCtrl"
			})
			.when('/membership', {
				templateUrl: 'partials/membership',
				controller:"membershipCtrl"
			})
			.when('/contact',{
				templateUrl: 'partials/contact'
			})
			.when('/about',{
				templateUrl: 'partials/about',
				controller: 'aboutCtrl'
			})
			.when('/internship',{
				templateUrl: 'partials/internship'
			})
			.when('/login',{
				templateUrl: 'partials/login',
				controller: 'loginCtrl'
			})
			.when('/admin',{
				templateUrl: 'partials/admin',
				controller: 'adminCtrl',
				resolve:{
					auth: function ($q, authenticationService, $location){
						var userInfo = authenticationService.getUserInfo();
						if (userInfo) {
							return $q.when(userInfo);
						}
						else{
							$location.path('/login');
							return $q.reject({authenticated:false});
						}
					}
				}
			})
			.when('/addEvent',{
				templateUrl: 'partials/addEvent',
				controller:"addEventCtrl",
				resolve:{
					auth: function ($q, authenticationService, $location){
						var userInfo = authenticationService.getUserInfo();
						if (userInfo) {
							return $q.when(userInfo);
						}
						else{
							$location.path('/login');
							return $q.reject({authenticated:false});
						}
					}
				}
			})
			.when('/editEvent/:id',{
				templateUrl:'partials/addEvent',
				controller:"editEventCtrl",
				resolve:{
					auth: function ($q, authenticationService){
						var userInfo = authenticationService.getUserInfo();
						if (userInfo) {
							return $q.when(userInfo);
						}
						else{
							return $q.reject({authenticated:false});
						}
					}
				}
			})
			.otherwise({
		      redirectTo: '/'
		    });
		$locationProvider.html5Mode(true);
		$interpolateProvider.startSymbol('[[');
  		$interpolateProvider.endSymbol(']]');
	}])
	.controller("programsCtrl",function ($scope, $http, $routeParams){
		if($routeParams.year==undefined){
			$http.get("/api/events/2015").success(function(data, status, headers, config){
				if(data.length==0){
					data.push({name:"No Events"});
				}
				$scope.events = data;
				// $scope.events.forEach(function(item, i){
				// 	console.log(item);
				// 	item.description.forEach(function (paragraph){
				// 		console.log(paragraph);
				// 		paragraph = $.parseHTML(paragraph);
				// 	})
				// })
			})
		}
		else{
			var year = $routeParams.year;
			$http.get("/api/events/"+year).success(function(data, status, headers, config){
				if(data.length==0){
					data.push({name:"No Events in "+year});
				}
				$scope.events = data;
			})
		}
		$scope.showModal = function (id){
			var selector = "#"+id;
			$(selector).modal('show');
		}
	})
	.controller("homeCtrl",function ($scope, $http){
		$http.get("/api/upcomingEvents").success(function(data, status, headers, config){
			if(data.length==0){
				data.push({name:"No Upcoming Events"});
			}
			$scope.upcomingEvents = data.slice(0,2);
		})
		$scope.showModal = function (id){
			var selector = "#"+id;
			$(selector).modal('show');
		}
	})
	.controller("aboutCtrl", function(){
		$('#toggle-view li h3, #toggle-view li strong').click(function () {
	        var text = $(this).parent().children('div.panel');
	        if (text.is(':hidden')) {
	            text.slideDown('200');
	            $(this).children('span').html('-');        
	        } else {
	            text.slideUp('200');
	            $(this).children('span').html('+');        
	        }
	        
	    });
	})
	.controller("membershipCtrl", function(){
		$('#toggle-view li h3, #toggle-view li strong').click(function () {
	        var text = $(this).parent().children('div.panel');
	        if (text.is(':hidden')) {
	            text.slideDown('200');
	            $(this).children('span').html('-');        
	        } else {
	            text.slideUp('200');
	            $(this).children('span').html('+');        
	        }
	        
	    });
	})
	.controller("calendarCtrl",function ($scope, $http){
		$http.get("/api/upcomingInternalEvents").success(function(data, status, headers, config){
			if(data.length==0){
				data.push({name:"No Upcoming Internal Events"});
			}
			$scope.internalEvents = data;
		})
		$http.get("/api/upcomingExternalEvents").success(function(data, status, headers, config){
			if(data.length==0){
				data.push({name:"No Upcoming External Events"});
			}
			$scope.externalEvents = data;
		})
		$scope.showModal = function (id){
			var selector = "#"+id;
			$(selector).modal('show');
		}
	})
	.controller("resourcesCtrl",function ($scope, $routeParams){
		$(".menubox").hide();

		$(".menuitem").click(function(event) {
			event.preventDefault();
			$(".menubox").hide();
			var relatedDivID = $(this).attr('href');

			$("" + relatedDivID).fadeToggle("fast", "linear");

		});
		$(".nav-tabs li").click(function(event){
			event.preventDefault();
			var tabID = $(this).attr('href');
			$(""+tabID).tab('show');
		})
		if($routeParams.country != undefined){
			$('html,body').animate({scrollTop: $('#economyMenu').offset().top},1000);
			var country = $routeParams.country;
			$('#'+country).fadeToggle("fast", "linear");
		}
	})
	.controller("addEventCtrl",function ($scope, $http, $location){
		$scope.form = {};
		$scope.form.date = {};
		$scope.form.eventTime = {};
		$scope.form.registration = {};
		$scope.form.registration.date = {};
		if($('#external').prop('checked') == true) $('#externalLink').prop('disabled', false);
	    else $('#externalLink').prop('disabled', true);
		(function(){
		    $scope.form.date.full = new Date();
		    $scope.form.registration.date.full = new Date();
		})();
		$('#internal, #external').click(function(){
			if($('#external').prop('checked') == true) $('#externalLink').prop('disabled', false);
		    else $('#externalLink').prop('disabled', true);
		})
		$scope.submitEvent = function () {
			$scope.form.eventType = $('input[name=eventType]:checked', 'form').val();
			if ($scope.form.eventType == "internal"){
				$scope.form.externalLink = "";
			}
			if($scope.form.date.full || $scope.form.registration.date.full){
				var monthArr = ["January","February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				if($scope.form.date.full){
					$scope.form.date.string = weekdayArr[$scope.form.date.full.getDay()] +", "+monthArr[$scope.form.date.full.getMonth()]+" "+$scope.form.date.full.getDate()+", "+$scope.form.date.full.getFullYear();
					$scope.form.year = $scope.form.date.full.getFullYear();
				}
				if($scope.form.registration.date.full){
					$scope.form.registration.date.string = weekdayArr[$scope.form.registration.date.full.getDay()] +", "+monthArr[$scope.form.registration.date.full.getMonth()]+" "+$scope.form.registration.date.full.getDate()+", "+$scope.form.registration.date.full.getFullYear();	
				}
			}
			if($scope.form.registration.url != undefined){
				if ($scope.form.registration.url.substring(0,4) != "http") $scope.form.registration.url = "http://"+$scope.form.registration.url;
			}
			if($scope.form.images!=undefined) $scope.form.images = $scope.form.images.split(/, */);
			if($scope.form.speakers!=undefined) $scope.form.speakers = $scope.form.speakers.split(/, */);
			if($scope.form.sponsors!=undefined) $scope.form.sponsors = $scope.form.sponsors.split(/, */);

			if ($scope.form.description!=undefined){
				$scope.form.description = $scope.form.description.match(/^.+/mg);
			}
			if ($scope.form.schedule!=undefined){
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
		$('#internal, #external').click(function(){
			if($('#external').prop('checked') == true) $('#externalLink').prop('disabled', false);
		    else $('#externalLink').prop('disabled', true);
		})
		$scope.form = {};
		$scope.form.date = {};
		$scope.form.eventTime = {};
		$scope.form.registration = {};
		$scope.form.registration.date = {};
		$http.get('/api/event/' + $routeParams.id).
		success(function(data) {
			$scope.form = data.event;
			if($scope.form.description != undefined) $scope.form.description = $scope.form.description.join("\r\r");
			if($scope.form.schedule != undefined) $scope.form.schedule = $scope.form.schedule.join("\r\r");
			if($scope.form.speakers!=undefined) $scope.form.speakers = $scope.form.speakers.join(", ");
			if($scope.form.sponsors!=undefined) $scope.form.sponsors = $scope.form.sponsors.join(", ");
			if($scope.form.image!=undefined) $scope.form.image = $scope.form.image.join(", ");
			if($scope.form.date != undefined) $scope.form.date.full = new Date($scope.form.date.full);
			else $scope.form.date = {};
			if($scope.form.eventTime != undefined) $scope.form.eventTime.full = new Date($scope.form.eventTime.full);
			else $scope.form.eventTime = {};
			if($scope.form.registration !=undefined) $scope.form.registration.date.full = new Date($scope.form.registration.date.full);
			else $scope.form.registration = {};
			$(':radio[value='+$scope.form.eventType+']').prop('checked',true);
			if($('#external').prop('checked') == true) $('#externalLink').prop('disabled', false);
	    	else $('#externalLink').prop('disabled', true);
		});
		
		$scope.submitEvent = function () {
			$scope.form.eventType = $('input[name=eventType]:checked', 'form').val();
			if ($scope.form.eventType == "internal"){
				$scope.form.externalLink = "";
			}
			if($scope.form.date.full || $scope.form.registration.date.full){
				var monthArr = ["January","February","March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				var weekdayArr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
				if($scope.form.date.full){
					$scope.form.date.string = weekdayArr[$scope.form.date.full.getDay()] +", "+monthArr[$scope.form.date.full.getMonth()]+" "+$scope.form.date.full.getDate()+", "+$scope.form.date.full.getFullYear();
					$scope.form.year = $scope.form.date.full.getFullYear();
				}
				if($scope.form.registration.date.full){
					$scope.form.registration.date.string = weekdayArr[$scope.form.registration.date.full.getDay()] +", "+monthArr[$scope.form.registration.date.full.getMonth()]+" "+$scope.form.registration.date.full.getDate()+", "+$scope.form.registration.date.full.getFullYear();	
				}
			}
			if($scope.form.registration.url != undefined){
				if ($scope.form.registration.url.substring(0,4) != "http") $scope.form.registration.url = "http://"+$scope.form.registration.url;
			}
			if($scope.form.images!=undefined) $scope.form.images = $scope.form.images.split(/, */);
			if($scope.form.speakers!=undefined) $scope.form.speakers = $scope.form.speakers.split(/, */);
			if($scope.form.sponsors!=undefined) $scope.form.sponsors = $scope.form.sponsors.split(/, */);

			if ($scope.form.description!=undefined){
				$scope.form.description = $scope.form.description.match(/^.+/mg);
			}
			if ($scope.form.schedule!=undefined){
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
	.controller("adminCtrl", function ($scope, $http, $timeout, $location, authenticationService){
		$http.get('/api/events').success(function(data, status, headers, config){
			$scope.events = data;
			$scope.count = $scope.events.length;
		})
		$scope.showModal = function (id){
			var selector = "#"+id;
			$(selector).modal('show');
		}
		$scope.deleteEvent = function(id){
		    var current = "."+id;
		    if(confirm("Are you sure you want to delete this event?")==true){
		      $http.delete('api/events/'+id)
		        .success(function(data){
		          $(current).fadeOut("fast");
		          $scope.count--;
		        })
		    }
		}
		$scope.logout = function() {
	    authenticationService.logout()
	      .then(function (result) {
	        $scope.userInfo = null;
	        $location.path("/login");
	      }, function (error) {
	        console.log(error);
	      });
	  }
	})
	.controller("loginCtrl", function ($scope,$location,$window,authenticationService){
		$scope.userInfo = null;
		$scope.login = function () {
			authenticationService.login($scope.userName, $scope.password)
			.then(function (result) {
				$scope.userInfo = result;
				$location.path("/admin");
			}, function (error) {
				console.log(error);
				$window.alert("Invalid Credentials");
				console.log(error);
				});
		};
		$scope.clear = function(){
			$scope.userName = "";
			$scope.password = "";
		};
	})
	.factory("authenticationService", function ($http, $q, $window){
		var userInfo;
		function login(userName, password){
			var deferred = $q.defer();
			$http.post("/api/login", {
				userName:userName,
				password:password
			}).then(function(result){
				userInfo={
					accessToken: result.data.access_token,
					userName:result.data.userName
				};
				$window.sessionStorage["userInfo"]=JSON.stringify(userInfo);
				deferred.resolve(userInfo);
			}, function (error){
				deferred.reject(error);
			});
			return deferred.promise;
		};
		function logout(){
			var deferred = $q.defer();
			$http({
				method:"POST",
				url:"/api/logout",
				headers:{
					"access_token": userInfo.accessToken
				}
			}).then(function(result) {
				$window.sessionStorage["userInfo"] = null;
				userInfo = null;
				deferred.resolve(result);
			}, function (error) {
				deferred.reject(error);
			});
			return deferred.promise;
		}

		function getUserInfo() {
			return userInfo;
		}
		function init(){
			if ($window.sessionStorage["userInfo"]) {
				userInfo = JSON.parse($window.sessionStorage["userInfo"]);
			}
		}
		init();
		return {
			login: login,
			logout: logout,
			getUserInfo: getUserInfo
		};
	})
	.run(["$rootScope", "$location", function ($rootScope, $location) {
	  $rootScope.$on("$routeChangeSuccess", function(userInfo) {
	    // console.log(userInfo);
	  });
	 
	  $rootScope.$on("$routeChangeError", function (event, current, previous, eventObj) {
	    if (eventObj.authenticated === false) {
	      $location.path("/login");
	    }
	  });
	}]);
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
	/* var data = dateString.split("-");
	var month = (parseInt(data[1])-1).toString();*/
  return  new Date(dateString);
}

$('.extLink').find('span').css('opacity', 0);
$('.extLink').hover(function(){
	$(this).find('span').css('opacity', 1);
}, function(){
	$(this).find('span').css('opacity', 0);
})