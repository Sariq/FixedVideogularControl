//angular.module("vc.templates", []).run(["$templateCache", function($templateCache)
//    {$templateCache.put("media/annotation.html","<div class=annotation ng-class={marked:state.isMarked}><div class=\"annotation_mark active\"></div><!--<div class=\"annotation_mark none\"></div>--><span class=timestamp>{{ annotation.timestamp |timestamp }}</span> <span class=from title=\"{{ annotation.fromUser }}\">{{ annotation.fromUser.length > 20? annotation.fromUser.substring(0,18)+\'..\': annotation.fromUser }}</span> <span ng-hide=state.$editable class=comment>{{ annotation.comment }}</span> <span ng-show=state.$editable class=comment><textarea rows=3 placeholder=\"Write your comment here\" ng-model=annotation.comment></textarea></span><div class=annotationButtons ng-show=usernameIsSet()><button ng-hide=state.$editable ng-disabled=replyDisabled ng-click=addReply() class=\"appBtn green reply annotation_comment\" title=\"Click to add a reply comment\"></button> <button ng-hide=state.$editable ng-disabled=\"!userHasWritten(annotation) && !userIsProjectOwner\" ng-click=\"\" class=\"appBtn reply annotate_reply\" title=\"Click to reply comment\"></button> <button ng-hide=state.$editable ng-disabled=\"!userHasWritten(annotation) && !userIsProjectOwner\" ng-click=annotation.delete() class=\"appBtn delete annotate_delete\" title=\"Click to delete comment\"></button> <button ng-hide=state.$editable ng-disabled=\"!userHasWritten(annotation) && !userIsProjectOwner\" ng-click=\"\" class=\"appBtn annotate_flag_red\" title=\"Click to reply comment\"></button><!--<button ng-hide=\"state.$editable\" ng-disabled=\"!userHasWritten(annotation) && !userIsProjectOwner \"\n ng-click=\"annotation.delete()\" class=\"appBtn delete\" title=\"Click to Delete comment\">\n <span><i class=\"fa-trash-o fa\"></i></span>\n </button>\n\n <button ng-hide=\"state.$editable\" ng-disabled=\"replyDisabled\"\n ng-click=\"addReply()\" class=\"appBtn green reply\"\n title=\"Click to add a reply comment\">\n <span><i class=\"fa fa-reply\"></i></span> </span>\n </button>--><!--<button ng-hide=\"state.$editable\" ng-if=\"userIsProjectOwner\" ng-click=\"annotation.hide()\" class=\"hide\"--><!--title=\"Click to hide\">--><!--<span><i class=\"fa fa-eye-slash\"></i></span>--><!--</button>--><!--<button ng-hide=\"state.$editable\" ng-if=\"userIsProjectOwner && annotation.isHidden\" ng-click=\"annotation.show()\"--><!--class=\"show\"--><!--title=\"Click to show\">--><!--<span><i class=\"fa fa-eye\"></i></span>--><!--</button>--><!--<button ng-hide=\"state.$editable || !annotation.userCanVote()\" ng-click=\"annotation.voteUp()\"\n class=\" appBtn blue voteUp\"\n title=\"Click to vote up for comment\">\n <span>{{ annotation.votes.up }}<i class=\"fa fa-chevron-up\"></i></span>\n </button>\n\n <button ng-hide=\"state.$editable || !annotation.userCanVote()\" ng-click=\"annotation.voteDown()\"\n class=\"appBtn red voteDown\"\n title=\"Click to vote down for comment\">\n <span>{{ annotation.votes.down }}<i class=\"fa fa-chevron-down\"></i></span>\n </button>--><!--<button ng-show=\"state.$editable\" ng-click=\"cancelSave()\" class=\"appBtn cancel\"\n title=\"Click to remove comment\">\n <span><i class=\"fa fa-times\"></i></span>\n </button>\n\n <button ng-show=\"state.$editable\" ng-click=\"save()\" class=\"appBtn green\" title=\"Click to save comment\">\n <span><i class=\"fa-save fa\"></i> </span>\n </button>--></div><div ng-if=annotation.children.length class=annotationReplyList><vc-reply-annotation data-annotation=child ng-repeat=\"child in annotation.children\"></vc-reply-annotation></div></div>");
//$templateCache.put("media/annotationsDialog.html","<div id=annotations-module ng-cloak=\"\" title=Annotate ng-controller=vc.annotationsController annotation-list=annotationList ng-mousemove=onResizeWidth($event) ng-mouseup=onStopResize() ng-mouseleave=onStopResize() ng-class=\"{\'resizecursor\':resizeFlag==true, \'initialcursor\': resizeFlag==false}\"><h4 class=viewTitle>{{ (allowAnnotate) ? \'Annotate\' : \'View\'}}</h4><div class=\"video_part clearfix\" id=video-part><vc-media-video-container annotation-markers=annotations media-time=mediaTime data-file=file></vc-media-video-container></div><div class=fit_layer_width ng-mousedown=onStartResize() ng-show=resizediv_flag></div><div id=annotations_data><div id=filter_area><div ng-if=\"!$root.userData.name && !publicView\" class=show_name><p>Enter your name to annotate, or <a vc-href=user/login>Login</a></p><h3>Who are you?</h3><div><input type=text ng-model=$root.userChosenName></div><div><button class=\"btn annotator_choose\" ng-click=setUserName()>Start Annotating</button></div></div><div ng-if=\"!$root.userData.name && publicView\" class=show_name_public><h3>What\'s your name?</h3><div><input type=text ng-model=$root.userChosenName></div><div><button class=\"btn annotator_choose\" ng-click=setUserName()>Start Annotating <i class=vcArrow></i></button></div></div><div class=infoAnnoWrapper ng-if=\"$root.userData.name && allowAnnotate\"><div class=infoAnno><div class=info_anno_label>Video name</div><!--<span ng-class=\"{saved_message_warning:!areAllAdded}\">{{ areAllAdded? \"All Changes Saved\" :\"Some Annotations were not saved\"}} </span>--><!--<button ng-click=\"addAnnotation()\" class=\"btn annotation_add\" ng-disabled=\"addDisabled\">Add Annotation\n </button>--><div class=annotationsStats><div class=\"annotation_mark active\"></div><div class=annotation_count>{{annotations.length}} annotations</div></div><div ng-if=contributors.length class=contributorsPart><div class=contributor_length><span class=num_cons>{{contributors.length}}</span> Contributors:</div><div class=contributorsList><div>Filter by ></div><ul><li ng-repeat=\"contrib in contributors\" class=\"contributor repeatAnimation\"><span ng-click=filter.filterToggle(contrib.name) ng-class={strikeThrough:filter.checkFilter(contrib.name),red:contrib.hasNew}>{{ contrib.name}}</span></li></ul><div class=filterControls><a ng-click=filter.showAll()>Show All</a> / <a ng-click=filter.hideAll()>Hide All</a></div></div></div></div></div></div><div class=annotations_list_wrap><div id=annotations_list ng-style={height:annoPartHeight} ng-if=allowAnnotate><vc-media-annotation data-annotation=annotation class=repeatAnimation ng-repeat=\"annotation in annotations| filter : filter.checkAnnotationUserNotInFilter | orderObjectBy:\'timestamp\' track by $index\"></vc-media-annotation></div></div></div></div>");
//$templateCache.put("media/replyAnnotation.html","<div class=\"annotation reply\" ng-class={marked:state.isMarked}><span class=from>{{ annotation.fromUser }}</span> <span ng-hide=state.$editable class=comment>{{ annotation.comment }}</span> <span ng-show=state.$editable class=comment><textarea rows=3 placeholder=\"Write your comment here\" ng-model=annotation.comment></textarea></span><div class=annotationButtons><button class=\"appBtn green reply annotation_comment\" title=\"Click to add a reply comment\"></button> <button class=\"appBtn reply annotate_reply\" title=\"Click to reply comment\"></button> <button class=\"appBtn delete annotate_delete\" title=\"Click to Delete comment\"></button> <button class=\"appBtn annotate_flag_red\" title=\"Click to reply comment\"></button><!--<button ng-hide=\"state.$editable || (!userIsProjectOwner && !userHasWritten(annotation)) \"\n ng-click=\"annotation.delete()\" class=\"appBtn delete annotate_delete\" title=\"Click to Delete comment\">\n <span><i class=\"fa-trash-o fa\"></i></span>\n </button>--><!--<button ng-hide=\"state.$editable\" ng-if=\"userIsProjectOwner\" ng-click=\"annotation.hide()\" class=\"hide\"--><!--title=\"Click to hide\">--><!--<span><i class=\"fa fa-eye-slash\"></i></span>--><!--</button>--><!--<button ng-hide=\"state.$editable\" ng-if=\"userIsProjectOwner && annotation.isHidden\" ng-click=\"annotation.show()\"--><!--class=\"show\"--><!--title=\"Click to show\">--><!--<span><i class=\"fa fa-eye\"></i></span>--><!--</button>--><!--<button ng-hide=\"state.$editable || !annotation.userCanVote()\" ng-click=\"annotation.voteUp()\" class=\" appBtn blue voteUp\"\n title=\"Click to vote up for comment\">\n <span>{{ annotation.votes.up }}<i class=\"fa fa-chevron-up\"></i></span>\n </button>\n\n <button ng-hide=\"state.$editable || !annotation.userCanVote()\" ng-click=\"annotation.voteDown()\" class=\"appBtn red voteDown\"\n title=\"Click to vote down for comment\">\n <span>{{ annotation.votes.down }}<i class=\"fa fa-chevron-down\"></i></span>\n </button>\n\n <button ng-show=\"state.$editable\" ng-click=\"cancelSave()\" class=\"appBtn cancel\"\n title=\"Click to remove comment\">\n <span><i class=\"fa fa-times\"></i></span>\n </button>\n\n <button ng-show=\"state.$editable\" ng-click=\"save()\" class=\"appBtn green\" title=\"Click to save comment\">\n <span><i class=\"fa-save fa\"></i> </span>\n </button>--></div></div>");
//$templateCache.put("media/videoContainer.html","<div class=videoContainer><videogular vg-stretch=config.stretch vg-responsive=config.responsive vg-autoplay=config.autoPlay vg-width=config.width vg-height=config.height vg-theme=config.theme.url><vg-media vg-src=config.media vg-native-controls=false></vg-media><vg-overlay-play></vg-overlay-play><api-connector></api-connector><vg-poster vg-url=config.poster.url></vg-poster></videogular><div class=video-action-control><div class=video-playing-bar></div><div class=video-action-btns><div class=play-btn ng-click=API.play();></div><div class=music-btn></div><div class=settings-btn></div><div class=lock-btn></div><div class=bright-btn></div><!--<div class=\"video-timing\">\n <div class=\"video-timing-content\">7:28/8:34</div>\n </div>--><div class=add-annot-btn>+</div></div></div></div>");}]);