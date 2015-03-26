!function(){"use strict";var t=angular.module("vc.video",["com.2fdevs.videogular","com.2fdevs.videogular.plugins.controls","com.2fdevs.videogular.plugins.poster","com.2fdevs.videogular.plugins.buffering","com.2fdevs.videogular.plugins.overlayplay","info.vietnamcode.nampnq.videogular.plugins.flash"]);t.directive("apiConnector",function(){return{restrict:"E",require:["^vcMediaVideoContainer","^videogular"],link:function(t,n,e,o){o[0].setAPI(o[1])}}}),t.directive("vcMediaVideoContainer",["$sce","$timeout",function(t,n){return{restrict:"E",scope:{file:"=",mediaTime:"="},replace:!0,templateUrl:"../app/views/media/videoContainer.html",controller:["$scope","$element","$attrs",function(t){t.config={media:[],responsive:!0,stretch:"fit",poster:{url:""},theme:{url:"http://www.videogular.com/styles/themes/default/latest/videogular.css"},autoHide:!1,autoPlay:!1},t.doSthonPlay=function(){console.log("clicked"),t.API.play()},this.setAPI=function(n){console.log(n+" setting API"),t.API=n},t.decodeEntities=function(t){for(var n=[["amp","&"]],e=0,o=n.length;o>e;++e)t=t.replace(new RegExp("&"+n[e][0]+";","g"),n[e][1]);return t}}],link:function(e){"undefined"==typeof e.mediaTime&&(e.mediaTime={}),e.$on("onVgUpdateTime",function(t,n){e.mediaTime.current=n[0],e.mediaTime.total=n[1]});var o=!1;if(e.$on("onVgPlayerReady",function(){o=!0}),e.$on("videoSeekTime",function(t,n){e.API&&!isNaN(n)&&o&&e.API.seekTime(n)}),e.$on("videoPause",function(){e.API&&e.API.pause()}),e.$on("videoPlay",function(){e.API&&e.API.play()}),e.$on("onVgPlayerReady",function(){n(function(){e.API&&e.API.pause(),e.$broadcast("showPoster")},70)}),e.file&&e.file.dl_link){var i={src:t.trustAsResourceUrl(e.decodeEntities(e.file.dl_link)),type:"video/mp4"};e.config.media.push(i),e.config.poster.url=t.trustAsResourceUrl(e.file.thumbnail)}}}}])}(),function(){"use strict";var t=angular.module("vc.annotations",[]);t.factory("annotationSvc",["$http","$rootScope","logSvc","$q","userData",function(t,n,e,o,i){function a(t){d.call(this,t);var n=this;n.children=[],a.prototype.addChild=function(t){this instanceof r||this.children.push(t instanceof r?t:new r(t))},angular.forEach(t.children,function(t){n.addChild(t)})}function r(t){d.call(this,t),this.parentId=t.parentId||null}var s=n.siteUrl+"video",c=[],d=function(t){this.timestamp=parseInt(t.timestamp)||0,this.mediaId=t.mediaId,this.fromUser=t.fromUser||t.from,this.id=t.id,this.comment=t.comment||"",this.userId=t.userId||t.user_id,this.isHidden=t.isHidden||t.is_hidden||!1,this.votes={down:t.votes?t.votes.down:Math.abs(t.votes_down)||0,up:t.votes?t.votes.up:t.votes_up||0},this.flag=t.flag};a.prototype=Object.create(d.prototype),r.prototype=Object.create(d.prototype),d.prototype.save=function(){var t=this;f.save(this).then(function(n){var e=parseInt(n.data.replace(/"/g,""));e>0&&(t.id=e)},function(t){f.log("error saving annotation"+(t.message||t))})},d.prototype["delete"]=function(){f["delete"](this)},d.prototype.userCanVote=function(){var t=!0;return i&&i.id?i.id==this.userId&&(t=!1):t=!1,t};var l={up:"down",down:"up"};d.prototype.dealWithVoteResponse=function(t,n){switch(n){case 1:this.votes[t]++;break;case 0:this.votes[l[t]]--;break;case-2:break;case-1:f.log("got "+n.data+"while   voting to annotation ")}},d.prototype.voteUp=function(){var t=this,n=f.vote("up",t.id);n.then(function(n){t.dealWithVoteResponse("up",parseInt(n.data))})},d.prototype.voteDown=function(){var t=this,n=f.vote("down",t.id);n.then(function(n){t.dealWithVoteResponse("down",parseInt(n.data))})},d.prototype.hide=function(){var t=this,n=f.hideShow("hide",t.id);n.then(function(n){1==n.data&&(t.isHidden=!0)})},d.prototype.show=function(){var t=this,n=f.hideShow("show",t.id);n.then(function(n){1==n.data&&(t.isHidden=!1)})};var u=function(n){return t.get(s+"/getannotations/"+n)},f={getList:function(t){var n=o.defer();return u(t).then(function(e){if(e.data.annotations){var o=e.data.annotations;c=[],angular.forEach(o,function(n){n.mediaId=t;for(var e in n.children){var o=n.children[e];o.parentId=o.parent_id}c.push(new a(n))}),n.resolve(c)}else f.log("failed to get annotations list for media"+t),n.reject(!1)}),n.promise},create:function(t,n){var e;return e=n?new r(t):new a(t)},save:function(n){var e={media_id:n.mediaId,comment:n.comment,time:n.timestamp,username:n.fromUser,user_id:n.userId};return n.parentId&&(e.parent_id=n.parentId),t.post(s+"/saveannotations",e)},"delete":function(n){var e=function(t){var n;if(t instanceof r){var e=t.parentId;n=c.filter(function(t){return t.id==e?t:!1}),n.length>0?n[0].children.splice([n[0].children.indexOf(t)],1):f.log("unable to remove annotation "+t.id+"from parent "+t.parentId)}else t instanceof a?(n=c.indexOf(t),-1!=n?c.splice(n,1):f.log("unable to remove annotation "+t.id)):f.log("annotation delete failed , could not verify annotation type")};if(n.id){var o=t.get(s+"/deleteannotation/"+n.id+"/"+n.userId);return o.then(function(t){1==t.data?e(n):f.log("unable to remove annotation "+n.id)}),o}e(n)},vote:function(n,e){return t.get(s+"/vote/"+n+"/"+e)},hideShow:function(n,e){return t.get(s+"/"+n+"_annotation/"+e)},log:function(t){return e.log("Annotations Service Log:"+t)}};return f}])}(),function(){"use strict";function t(t,n){var e=t[0],o=t[1];1==e.annotation.flag&&o.addClass("new"),e.state={$editable:!1,isMarked:!1},e.mark=function(t){o.parent().animate({scrollTop:o.parent().scrollTop()+(o.position().top-o.parent().position().top)},700),e.state.isMarked=!0,t||(e.$root.$broadcast("videoSeekTime",e.annotation.timestamp),e.$digest())},e.dismissOnPlayWatcher=null,e.save=function(){"function"==typeof e.dismissOnPlayWatcher&&e.dismissOnPlayWatcher(),console.log("linking inside1"),e.annotation.save(),e.annotation.is_me=!0,n.listScope.$broadcast("enableAdd"),e.$root.$broadcast("videoPlay"),e.$root.$broadcast("annotationChanged")},e.cancelSave=function(){console.log("linking inside2"),n.listScope.$broadcast("enableAdd"),e.annotation["delete"](),e.$root.$broadcast("annotationChanged"),e.$root.$broadcast("videoPlay")},e.userHasWritten=function(t){return t.is_me?!0:t.userId&&e.$root.userData?e.$root.userData.id==t.userId:void 0},e.usernameIsSet=function(){return e.$root.usernameIsSet()}}function n(t,n){var e=t[0],o=t[1];e.$emit("AnnotationAdded",[e,o]),o.click(function(t){"BUTTON"!=t.target.tagName&&n.listScope.$broadcast("markAnnotation",{id:e.annotation.id})}),e.$watch(function(){return e.$parent.mediaTime?Math.floor(e.$parent.mediaTime.current):void 0},function(t){t===parseInt(e.annotation.timestamp)&&n.listScope.$broadcast("markAnnotation",{id:e.annotation.id,opts:!0})}),e.$on("markAnnotation",function(t,n){n.id==e.annotation.id?e.mark(n.opts):e.state.isMarked=!1}),e.$watch("state.$editable",function(t){t&&(o.find(".comment textarea").focus(),e.dismissOnPlayWatcher=e.$root.$on("onVgPlay",function(){e.dismissOnPlayWatcher(),e.cancelSave()}))}),e.$watch("annotation.id",function(t){e.state.$editable=t?!1:!0})}var e=angular.module("vc.annotations");e.directive("annotationMarkers",["$compile",function(t){return{restrict:"A",link:function(n,e){var o=e.find("#annotation-markers-wrapper");e.parent().bind("mouseenter",function(){n.$apply(function(){n.hovering=!0})}),e.parent().bind("mouseleave",function(){n.$apply(function(){n.hovering=!1})}),n.allowAnnotate&&n.$watchCollection("annotations",function(e){o.children().remove(),angular.forEach(e,function(e){var i=n.$new(!0);i.$watch(function(){return n.hovering},function(t){i.pinShow=t}),i.annotation=e;var a=angular.element('<annotation-marker data-timestamp="{{ annotation.timestamp }}"></annotation-marker>'),r=t(a)(i);o.append(r)})})}}}]),e.directive("annotationList",["annotationSvc",function(t){return{restrict:"A",link:function(n){t.listScope=n}}}]),e.directive("annotationMarker",["annotationSvc",function(t){return{restrict:"E",replace:!0,template:'<span class="annotation-marker"><i class="fa fa-circle simpleShowAni" ng-show="pinShow" ></i></span>',controller:["$scope","$element","$attrs",function(t,n,e){t.setTimePosition=function(t){if(e.timestamp>0){var o=e.timestamp/t*100;n.css("margin-left",o.toFixed(4)+"%")}},t.pinShow=!1}],link:function(n,e){1==n.annotation.flag&&e.addClass("new");var o=n.$root.$on("onVgUpdateTime",function(t,e){isNaN(e[1])||o(),n.setTimePosition(e[1])});t.listScope.$on("markAnnotation",function(t,e){n.showPin=e.id==n.annotation.id?!0:!1}),e.click(function(){t.listScope.$broadcast("markAnnotation",{id:n.annotation.id})}),t.listScope&&t.listScope.mediaTime&&n.setTimePosition(t.listScope.mediaTime.total)}}}]),e.directive("vcReplyAnnotation",["annotationSvc",function(e){return{restrict:"E",replace:!0,scope:{annotation:"="},templateUrl:"../app/views/media/replyAnnotation.html",controller:["$scope","$element","$attrs",function(){t.call(this,arguments,e)}],link:function(){n.call(this,arguments,e)}}}]),e.directive("vcMediaAnnotation",["annotationSvc",function(e){return{restrict:"E",replace:!0,scope:{annotation:"="},templateUrl:"../app/views/media/annotation.html",controller:["$scope","$element","$attrs",function(){t.call(this,arguments,e)}],link:function(t,o){n.call(this,arguments,e),t.replyDisabled=!1,t.$on("enableAdd",function(){t.replyDisabled=!1}),t.$on("disableAdd",function(){t.replyDisabled=!0}),t.addReply=function(){t.$root.$broadcast("videoPause"),e.listScope.$broadcast("disableAdd");var n=e.create({parentId:t.annotation.id,mediaId:t.annotation.mediaId,timestamp:t.annotation.timestamp,fromUser:t.$root.userData.name,userId:t.$root.userData.id,flag:0},!0);t.annotation.addChild(n),o.parent().animate({scrollTop:o.parent().scrollTop()+(o.position().top-o.parent().position().top)},700)}}}}])}(),function(){"use strict";var t=angular.module("vc.annotations");t.controller("vc.annotationsController",["$scope","$element","annotationSvc","$filter",function(t,n,e,o){t.annotations=[],t.contributors=[],t.areAllAdded=!0,t.resizeFlag=!1,t.video_width=-1,t.container_width=0,t.container_height=0,t.video_ratio=1.5626,t.resizediv_flag=!0,console.log(window.innerWidth),t.resizediv_flag=window.innerWidth>1079?!0:!1,t.onStartResize=function(){t.resizeFlag=!0,t.video_width=document.getElementById("video-part").clientWidth,t.container_width=document.getElementById("annotations-module").clientWidth,t.container_height=document.getElementById("annotations-module").clientHeight},t.onResizeWidth=function(n){if(t.resizeFlag===!0){var e=(window.innerWidth,n.clientX);e-=document.getElementById("video-part").getBoundingClientRect().left;var o=t.container_width-e-9,i=e/t.video_ratio;if(100>e||e>1079||200>o||i>t.container_height-50)return;document.getElementById("video-part").style.width=e+"px",document.getElementById("video-part").style.height=i+"px",document.getElementById("annotations_data").style.width=o+"px"}},t.onStopResize=function(){t.resizeFlag=!1},t.filter={filterToggle:function(n){t.filter.checkFilter(n)?t.filter.filteredAuthors.splice(t.filter.filteredAuthors.indexOf(n),1):t.filter.filteredAuthors.push(n)},filteredAuthors:[],checkFilter:function(n){return-1!==$.inArray(n,t.filter.filteredAuthors)},checkAnnotationUserNotInFilter:function(n){return angular.isObject(n)&&n.fromUser?-1===$.inArray(n.fromUser,t.filter.filteredAuthors):void 0},showAll:function(){t.filter.filteredAuthors=[]},hideAll:function(){var n=[];angular.forEach(t.contributors,function(t){n.push(t.name)}),t.filter.filteredAuthors=angular.copy(n)}},t.$watchCollection("annotations",function(n){var e=[];angular.forEach(n,function(t){if(null===o("getByProperty")("name",t.fromUser,e)){var n={name:t.fromUser,hasNew:!1};1==t.flag&&(n.hasNew=!0),e.push(n)}if(1==t.flag){var i=o("getByProperty")("name",t.fromUser,e);i&&(i.hasNew=!0)}}),t.contributors=e}),t.mediaId=t.file.file_id,e.getList(t.mediaId).then(function(n){t.annotations=n}),t.mediaTime={duration:null,current:null},t.$on("annotationChanged",function(){for(var n in t.annotations)n.id<=0&&(t.areAllAdded=!1);t.areAllAdded=!0}),t.$on("enableAdd",function(){t.addDisabled=!1}),t.$on("disableAdd",function(){t.addDisabled=!0}),t.addDisabled=!1,t.addAnnotation=function(){t.$broadcast("disableAdd");var n=e.create({timestamp:t.mediaTime.current,fromUser:t.$root.userData.name,userId:t.$root.userData.id,mediaId:t.mediaId,flag:0}),o=t.$on("AnnotationAdded",function(t,e){if(e[0].annotation==n){o();var i=e[1];$("#annotations_list").animate({"scr}ollTop":i.position().top+i.height()},700)}});t.annotations.push(n),t.areAllAdded=!1,setTimeout(function(){t.$root.$broadcast("videoPause")},20)}}])}(),function(){"use strict";var t=angular.module("vc.generalDirectives",[]);t.directive("vcHref",["$rootScope",function(t){return{link:function(n,e,o){e.attr("href",t.baseUrl+o.vcHref)}}}]),t.directive("setWidthBy",["$window",function(t){return{link:function(n,e,o){var i=function(){e.css("width",$(o.setWidthBy).width())};$(o.setWidthBy).length>0&&i(),n.$on("onVgPlayerReady",function(){i()});var a=null;$(t).resize(function(){a&&clearTimeout(a),a=setTimeout(function(){i()},20)})}}}])}(),function(){"use strict";var t=angular.module("vc.generalFilters",[]);t.filter("timestamp",[function(){return function(t){var n="";t>3600&&(n=Math.floor(t/3600)<10?"0"+Math.floor(t/3600):Math.floor(t/3600),n+=":",t-=3600*n);var e=Math.floor(t/60)<10?"0"+Math.floor(t/60):Math.floor(t/60),o=Math.floor(t-60*e)<10?"0"+Math.floor(t-60*e):Math.floor(t-60*e),i=n+""+e+":"+o;return i}}]),t.filter("getByProperty",function(){return function(t,n,e){for(var o=0,i=e.length;i>o;o++)if(e[o][t]==n)return e[o];return null}}).filter("orderObjectBy",function(){return function(t,n,e){var o=[];return angular.forEach(t,function(t){o.push(t)}),o.sort(function(t,e){return t[n]>e[n]?1:-1}),e&&o.reverse(),o}})}(),function(){"use strict";var t=angular.module("vc.generalServices",[]);t.factory("userData",["$http","logSvc",function(t,n){return t.get(vc.siteUrl+"user/get_current_data").error(function(t){n.log("failed to get user data "+t)})}]),t.factory("logSvc",function(){return{log:function(t){"function"==typeof console.log&&console.log(t)}}})}(),function(){"use strict";var t=angular.module("vc",["ngGrid","vc.generalDirectives","vc.generalServices","vc.generalFilters","ngResource","ngAnimate","ngDialog"]);t.config(["$httpProvider",function(t){t.defaults.xsrfCookieName="vc_csrf_cookie_name",t.defaults.xsrfHeaderName="vc_csrf_test_name",t.defaults.transformRequest.unshift(function(t){return t&&angular.extend(t,vc.csrf),t})}]),t.run(["$rootScope","userData",function(t,n){t.usernameIsSet=function(){var n=!1;return t.userData&&"undefined"!=typeof t.userData.name&&t.userData.name.length>0&&(n=!0),n},"undefined"!=typeof vc&&(t.baseUrl=vc.baseUrl,t.siteUrl=vc.siteUrl),n.success(function(n){t.userData=n||{}})}])}(),function(){"use strict";var t=angular.module("vc.clipView",["vc","vc.video","vc.annotations"]);t.run(["userData","clipData","$rootScope",function(t,n,e){console.log("a"),e.windowHeight=$(window).height(),e.tvHeight=0,$(".tvInner").length?(e.tvHeight=$(".tvInner").height(),console.log("tcheight:"+e.tvHeight+" windowHeight:"+e.windowHeight),e.annoPartHeight=e.tvHeight-Math.min(e.windowHeight/2,350),console.log("Height should be :"+e.annoPartHeight)):e.annoPartHeight=e.windowHeight/2-64,e.file=n,t.then(function(){console.log("b"),e.userChosenName="",e.setUserName=function(){e.userChosenName.length>2&&(e.userData.name=e.userChosenName)}})}])}();