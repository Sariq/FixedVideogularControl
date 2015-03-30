(function () {
    'use strict';
    var annotationsModule = angular.module('vc.annotations', []);

    annotationsModule.factory('annotationSvc', function ($http, $rootScope, logSvc, $q, userData) {
        
        var baseUrl = $rootScope.siteUrl + 'video';
        var annotationsList = [];


        var AnnotationBaseModel = function (valuesObj) { // valuesObj 2nd default property names are as in the server
            this.timestamp = parseInt(valuesObj.timestamp) || 0; // these are not really needed on reply Object
            this.mediaId = valuesObj.mediaId;// these are not really needed on reply Object
            this.fromUser = valuesObj.fromUser || valuesObj.from;
            this.id = valuesObj.id;
            this.comment = valuesObj.comment || '';
            this.userId = valuesObj.userId || valuesObj.user_id;
            this.isHidden = valuesObj.isHidden || valuesObj.is_hidden || false;
            this.votes = {
                down: (valuesObj.votes) ? valuesObj.votes.down : Math.abs(valuesObj.votes_down) || 0,
                up: (valuesObj.votes) ? valuesObj.votes.up : valuesObj.votes_up || 0};
            this.flag = valuesObj.flag;
        };

        function AnnotationModel(valuesObj) {
          
            AnnotationBaseModel.call(this, valuesObj);
            var self = this;
            self.children = [];
            
            AnnotationModel.prototype.addChild = function (childModel) {
         
                if (!(this instanceof AnnotationReplyModel)) { //verify we are not pushing reply to a reply
                    if (childModel instanceof AnnotationReplyModel) {
                        this.children.push(childModel);
                    } else {
                        this.children.push(new AnnotationReplyModel(childModel));
                     
                    }
                }
            };
            angular.forEach(valuesObj.children, function (child) {
                self.addChild(child);
              
            });

        }

        function AnnotationReplyModel(valuesObj) {
            AnnotationBaseModel.call(this, valuesObj);
            this.parentId = valuesObj.parentId || null;
        }

        AnnotationModel.prototype = Object.create(AnnotationBaseModel.prototype);
        
        AnnotationReplyModel.prototype = Object.create(AnnotationBaseModel.prototype);

        AnnotationBaseModel.prototype.save = function () {

            var self = this;
            annotationSvc.save(this).then(function (response) {
                var responseId = parseInt(response.data.replace(/"/g, ''));
                if (responseId > 0) {
                    self.id = responseId;
                }
            }, function (e) {
                annotationSvc.log('error saving annotation' + (e.message || e));
            });
        };
        AnnotationBaseModel.prototype.delete = function () {
            annotationSvc.delete(this);
        };
        AnnotationBaseModel.prototype.userCanVote = function () {
            var returnVal = true;
            if (userData && userData.id) {
                if (userData.id == this.userId) returnVal = false;
            }//non logged in users can't vote
            else returnVal =false;
            return returnVal;
        };
        var opposites = {up: 'down', down: 'up'};
        AnnotationBaseModel.prototype.dealWithVoteResponse = function (direction, response) {
            switch (response) {
                case 1:
                {
                    this.votes[direction]++;
                    break;
                }
                case 0 :
                {
                    this.votes[opposites[direction]]--;
                    break;
                }
                case -2:
                {
                    break;
                }
                case -1 :

                {
                    annotationSvc.log('got ' + response.data + 'while   voting to annotation ');
                    break;
                }
            }
        };
        AnnotationBaseModel.prototype.voteUp = function () {
            var self = this;
            var apiRes = annotationSvc.vote('up', self.id);
            apiRes.then(function (response) {
                self.dealWithVoteResponse('up', parseInt(response.data));
            });
        };
        AnnotationBaseModel.prototype.voteDown = function () {
            var self = this;
            var apiRes = annotationSvc.vote('down', self.id);
            apiRes.then(function (response) {
                self.dealWithVoteResponse('down', parseInt(response.data));
            });
        };
        AnnotationBaseModel.prototype.hide = function () {
            var self = this;
            var apiRes = annotationSvc.hideShow('hide', self.id);
            apiRes.then(function (response) {
                if (response.data == 1) {
                    self.isHidden = true;
                }
            });
        };
        AnnotationBaseModel.prototype.show = function () {
            var self = this;
            var apiRes = annotationSvc.hideShow('show', self.id);
            apiRes.then(function (response) {
                if (response.data == 1) {
                    self.isHidden = false;
                }
            });
        };

        var getAll = function (mediaId) {
                return $http.get(baseUrl + '/getannotations/' + mediaId);
           
        };

        var annotationSvc = {
            //Sari 
            //set AnnotationsList
            setList: function (annotations) {
                annotationsList = annotations;
            },
            //get AnnotationsListFromSvc
            getListFromSvc: function () {
                return annotationsList;
            } ,
            //Sari 
            getList: function (mediaId) {
                var q = $q.defer();
                getAll(mediaId).then(function (response) {
                    if (response.data.annotations) {
                        var dataAnnotations = response.data.annotations;
                        annotationsList = [];//reset the list;
                        angular.forEach(dataAnnotations, function (annotation) {

                            annotation.mediaId = mediaId;
                            //parentId allows deletion later -so fixing it at this point
                            for (var index in annotation.children) {
                                var childAnnotation = annotation.children[index];
                                childAnnotation.parentId = childAnnotation.parent_id;
                            }
                            annotationsList.push(new AnnotationModel(annotation));
                        });
                        q.resolve(annotationsList);
                    }
                    else {
                        annotationSvc.log('failed to get annotations list for media' + mediaId);
                        q.reject(false);
                    }
                });
                return q.promise;
            },
            create: function (dataObj, child) {
               
                var newObj;
                if (!child) {
                    newObj = new AnnotationModel(dataObj);
                }
                else {
                    newObj = new AnnotationReplyModel(dataObj);
                }
             
                return newObj;
            },
            save: function (annotationModel) {
                var dataObj = {
                    media_id: annotationModel.mediaId,
                    comment: annotationModel.comment,
                    time: annotationModel.timestamp,
                    username: annotationModel.fromUser,
                    user_id: annotationModel.userId
                };
                if (annotationModel.parentId) {
                    dataObj.parent_id = annotationModel.parentId;
                }

                return $http.post(baseUrl + '/saveannotations', dataObj);
            },
            delete: function (annotation) {
                var removeFromList = function (annotation) {
                    var found;
                    if (annotation instanceof AnnotationReplyModel) {
                        var parent = annotation.parentId;
                        found = annotationsList.filter(function (anno) {
                            if (anno.id == parent) return anno;
                            else return false;
                        });
                        if (found.length > 0) {
                            found[0].children.splice([found[0].children.indexOf(annotation)], 1);
                        }
                        else {
                            annotationSvc.log('unable to remove annotation ' + annotation.id + 'from parent ' + annotation.parentId);
                        }
                    }
                    else if (annotation instanceof AnnotationModel) {
                        found = annotationsList.indexOf(annotation);
                        if (found != -1) {
                            annotationsList.splice(found, 1);
                        }
                        else {
                            annotationSvc.log('unable to remove annotation ' + annotation.id);
                        }
                    }
                    else {
                        annotationSvc.log('annotation delete failed , could not verify annotation type');
                    }
                };
                if (annotation.id) {
                    var request = $http.get(baseUrl + '/deleteannotation/' + annotation.id + '/' + annotation.userId);
                    request.then(function (response) {
                        if (response.data == 1) {
                            removeFromList(annotation);
                        }
                        else {
                            annotationSvc.log('unable to remove annotation ' + annotation.id);
                        }
                    });
                    return request;
                }
                else {
                    removeFromList(annotation);
                }
            },
            vote: function (direction, annoId) {
                return $http.get(baseUrl + '/vote/' + direction + '/' + annoId);
            },
            hideShow: function (action, annoId) {
                return $http.get(baseUrl + '/' + action + '_annotation' + '/' + annoId);
            },
            log: function (thing) {
                return logSvc.log('Annotations Service Log:' + thing);
            }

        };
        return annotationSvc;
    });

}());