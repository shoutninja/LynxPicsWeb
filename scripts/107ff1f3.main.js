$(document).ready(function(){$(".button-collapse").sideNav({closeOnClick:!0})}),Array.prototype.shuffle=function(){var a,b,c=this.length;if(0==c)return this;for(;--c;)a=Math.floor(Math.random()*(c+1)),b=this[c],this[c]=this[a],this[a]=b;return this};var copyText=function(a){console.log(a),prompt("Copy to clipboard: Ctrl+C, Enter",a)};"undefined"!=typeof cordova&&cordova.plugins&&cordova.plugins.clipboard&&cordova.plugins.clipboard.copy&&(copyText=cordova.plugins.clipboard.copy),angular.module("ninja.shout.lynx.LynxPics",["firebase","ngRoute"]).config(["$routeProvider",function(a){a.when("/home",{templateUrl:"views/home.html",controller:"LynxController"}).when("/feedback",{templateUrl:"views/feedback.html",controller:"FeedbackController"}).when("/about",{templateUrl:"views/about.html"}).when("/new",{templateUrl:"views/new.html",controller:"NewController"}).when("/settings",{templateUrl:"views/settings.html",controller:"SettingsController"}).otherwise({redirectTo:"/home"})}]).constant("IMAGE_PATTERN",".+\\.(jpe?g|gif|png)$").constant("IMAGE_COUNT",15).constant("LOCAL_STORAGE_PREFIX","ninja.shout.lynx.settings").service("URL",function(){this.FIREBASE_BASE="https://eakjb-shout-ninja2.firebaseio.com",this.URL_LYNX=this.FIREBASE_BASE+"/lynx/categories/forum"}).factory("API",["$rootScope","$window","$firebaseArray","UTIL","IMAGE_PATTERN","IMAGE_COUNT","URL","LOCAL_STORAGE_PREFIX",function(a,b,c,d,e,f,g,h){var i={};a.$watch(function(){return b.localStorage.getItem(h+".filterLevel")||"safe"},function(a){i.filterLevel=a}),a.$watch(function(){return"true"===b.localStorage.getItem(h+".showBlockedPosts")},function(a){i.showBlockedPosts=a}),a.$watch(function(){return"true"===b.localStorage.getItem(h+".invertFilter")},function(a){i.invertFilter=a}),i.filterPost=function(a){return"safe"===i.filterLevel?(a.flags||0)<1:"filtered"===i.filterLevel?(a.flags||0)<=(a.unflags||0):!0},i.shouldShowPost=function(a){var b=i.filterPost(a);return i.invertFilter?!b:b};var j=new RegExp(e);return i.lynx=c(new Firebase(g.URL_LYNX)),i.allPosts=[],i.allPostsIndex=0,i.posts=[],i.loaded=!1,i.lynx.$watch(function(a){if("child_added"===a.event){var b=i.lynx.$getRecord(a.key);j.test(b.url)&&i.allPosts.push(b)}}),i.lynx.$loaded(function(){i.allPosts.shuffle(),i.validateAndAddImage=function(){var a=i.allPosts[++i.allPostsIndex];return a?(d.isImage(a.url).then(function(b){if(b)i.posts.push(a);else if(i.allPostsIndex<i.allPosts.length-1)return i.validateAndAddImage()}),!0):!1};for(var a=0;f>a&&i.allPostsIndex<i.allPosts.length;a++)setTimeout(i.validateAndAddImage,0);i.loaded=!0}),i}]).service("UTIL",["$q",function(a){this.isImage=function(b){var c=a.defer(),d=new Image;return d.onerror=function(){c.resolve(!1)},d.onload=function(){c.resolve(!0)},d.src=b,c.promise}}]).controller("NavController",["$scope","$location",function(a,b){a.location=b}]).controller("LynxController",["$scope","API",function(a,b){a.API=b,a.copyText=copyText,a.getGifPath=function(){return"images/loading_gifs/gif"+Math.floor(3*Math.random()+1)+".gif"},b.lynx.$loaded(function(){jQuery(function(a){var c=function(c,d){var e=a(c),f=function(){if(e.scrollTop()+e.innerHeight()+1e3>=document.getElementById(d).scrollHeight){var a=b.validateAndAddImage();a&&setTimeout(f,50)}};f()};a("#scrollable-area").on("scroll",function(){c("#scrollable-area","post-scrollable-area")}),c("#scrollable-area","post-scrollable-area")})})}]).controller("PostController",["$rootScope","$scope","API",function(a,b,c){b.voteClicked=!1,b.flagClicked=!1,b.votePost=function(d){b.voteClicked=!0,d.submissions||(d.submissions=1),d.submissions++,c.lynx.$save(d),setTimeout(function(){a.$apply(function(){b.voteClicked=!1})},300)},b.flagPost=function(d){b.flagClicked=!0,d.flags||(d.flags=0),d.unflags||(d.unflags=0),setTimeout(function(){a.$apply(function(){b.flagClicked=!1,d.flags>d.unflags?d.unflags++:d.flags++,c.lynx.$save(d)})},300)},b.enlarge=function(a){$("#image-modal").openModal()}}]).controller("FeedbackController",["$scope","$rootScope",function(a,b){a.data={},a.sent=!1,a.submitForm=function(){$.ajax({url:"//formspree.io/info@shout.ninja",method:"POST",data:a.data,dataType:"json"}).success(function(){b.$apply(function(){a.sent=!0}),Materialize.toast("Feedback Sent.",1e3)}).error(function(){Materialize.toast("Error Submitting Feedback.",1e3)})}}]).controller("SettingsController",["$scope","$window","LOCAL_STORAGE_PREFIX",function(a,b,c){a.filterLevel=b.localStorage.getItem(c+".filterLevel")||"safe",a.showBlockedPosts="true"===b.localStorage.getItem(c+".showBlockedPosts"),a.invertFilter="true"===b.localStorage.getItem(c+".invertFilter"),a.settingsChanged=function(){b.localStorage.setItem(c+".filterLevel",a.filterLevel),b.localStorage.setItem(c+".showBlockedPosts",a.showBlockedPosts),b.localStorage.setItem(c+".invertFilter",a.invertFilter),a.updateUI()},a.updateUI=function(){var b=90;a.invertFilter?b=0:("unfiltered"===a.filterLevel?b=30:"filtered"===a.filterLevel&&(b=60),a.showBlockedPosts||(b+=10)),a.filterLevelProgressBarStyle={width:b+"%"}},a.updateUI()}]).controller("NewController",["$scope","URL","$firebaseArray",function(a,b,c){var d=new Firebase(b.URL_LYNX),e=c(d);this.allowedPrefixes=["http://","https://"],a.isValid=function(a){var b=!1;return angular.forEach(this.allowedPrefixes,function(c){0==a.indexOf(c)&&(b=!0)}),b},a.validate=function(){var b=[];angular.forEach(e,function(c){var d=c.url;"/"==d.substr(-1)&&(d=d.substr(0,d.length-1)),b.indexOf(d)>0||!a.isValid(d)?e.$remove(c):b.push(d)},this)},a.submit=function(b){for(var c=0;c<e.length;c++)if(e[c].url==b)return this.validate(),!1;return e.$add({url:b,timestamp:Firebase.ServerValue.TIMESTAMP}).then(function(b){Materialize.toast("Submitted!",3e3),console.log("good"),a.url=""}),!0}}]);