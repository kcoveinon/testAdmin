(function() {
    var reconciliationDirective = angular.module('reconciliation-directive', []);

    reconciliationDirective.directive('uploadArea', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

            	
                /*
                dropzoneObj.on("totaluploadprogress", function(progress) {
                    document.querySelector("#total-progress .progress-bar").style.width = progress + "%";
                });
                */

            }
        };
    }]);

    reconciliationDirective.directive('monthToProcess', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.datepicker({
                    changeMonth: true,
                    changeYear: true,
                    showButtonPanel: true,
                    dateFormat: 'MM yy',
                    onClose: function(dateText, inst) { 
                        var month = $("#ui-datepicker-div .ui-datepicker-month :selected").val();
                        var year = $("#ui-datepicker-div .ui-datepicker-year :selected").val();
                        $(this).datepicker('setDate', new Date(year, month, 1));
                        scope.monthToProcess = parseInt(year+('0'+(parseInt(month)+1)).slice(-2));
                        console.log(scope.monthToProcess);
                    }
                });

            }
        };
    }]);

    reconciliationDirective.directive('uploadProgressBar', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.progress();


            }
        };
    }]);

    reconciliationDirective.directive('startMultipleUpload', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.click(function(){
                    scope.dropzoneObj.enqueueFiles(scope.dropzoneObj.getFilesWithStatus(Dropzone.ADDED));
                });
                
            }
        };
    }]);

    reconciliationDirective.directive('startMultipleCancel', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.click(function(){
                    scope.dropzoneObj.removeAllFiles(true);
                });

            }
        };
    }]);

    reconciliationDirective.directive('reconciliationPage', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.click(function(){
                    //console.log(scope.contentLink);
                    
                    scope.$apply(function(){
                        scope.$parent.contentLink = 'views/get/pages.reconciliation.reconciliationPage';
                    });
                    //globalService.setContentLink('views/get/pages.reconciliation.reconciliationPage');
                    
                    
                });

            }
        };
    }]);

    reconciliationDirective.directive('foldersAccordion', [function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
                    element.accordion();
                });
                

            }
        };
    }]);
    
    reconciliationDirective.directive('foldersAccordionFinishRender', ['$timeout', function (timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    timeout(function () {
                        scope.$emit('ngRepeatFinished');
                    });
                }
            }
        }
    }]);

    reconciliationDirective.directive('processFile', ['globalService', '$compile', function (globalService, compile) {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
                element.click(function(){
                    
                    element.prop( "disabled", true );
                    element.addClass('loading');
                    /*
                    element.html(
                        '<p>Processing</p>'+
                        '<div class="ui active inverted dimmer">'+
                        '    <div class="ui loader"></div>'+
                        '</div>'
                    );

                    compile(element.contents())(scope);
                    */

                    var fileDetails = {
                        fileID:parseInt(attrs.processFileId),
                        fileCode:attrs.processFileCode,
                        processMonth:attrs.processMonth
                    };

                    //console.log(fileDetails);

                    
                    globalService.ajaxPostData('reconciliation/process-file', fileDetails).then(function(result){
                        //scope.forProcessList = result;
                        element.removeClass('loading');
                        element.addClass('disabled');
                        element.html('Processed');
                        //compile(element.contents())(scope);
                        
                    });
                    
                    
                });
                
            }
        }
    }]);
    
    reconciliationDirective.directive('postProcessFile', ['globalService', function(globalService) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                element.click(function(){ 

                    var fileDetails = {
                        fileID:parseInt(attrs.processedFileId),
                        action:attrs.postProcessFile
                    };

                    element.parent().find('[post-process-file*="'+(fileDetails.action == 'Save' ? 'Delete' : 'Save')+'"]').css('display','none');

                    element.addClass('loading');
                    
                    globalService.ajaxPostData('reconciliation/post-process-file', fileDetails).then(function(result){
                        element.removeClass('loading');
                        element.addClass('disabled');
                        element.html(fileDetails.action+'d');
                    }); 
                    
                });

            }
        };
    }]);

    reconciliationDirective.directive('postReconciliationShowSummary', ['globalService', 'postReconciliationService', function(globalService, postReconciliationService) {
        return {
            restrict: 'A',
            scope: {
                fileID:"=postReconciliationShowSummary",
            },
            link: function(scope, element, attrs) {

                element.click(function(){
                    //console.log(scope.modal);
                    globalService.ajaxPostData('reconciliation/post-reconciliation-show-summary', {fileID:scope.fileID}).then(function(summary){
                        
                        //console.log(summary);

                        postReconciliationService.setSummaryList(summary);

                        postReconciliationService.setSummaryModalTitle(summary.fileName + ' Summary');

                        postReconciliationService.setSummaryModalWatch(true);
                        
                        //postReconciliationService.setSummaryModalWatch(false);
                        //scope.modal = true;
                        //console.log(scope.modal);
                    });

                });

            }
        };
    }]);

    reconciliationDirective.directive('postReconciliationShowDetails', ['globalService', 'postReconciliationService', function(globalService, postReconciliationService) {
        return {
            restrict: 'A',
            scope: {
                fileID:"=postReconciliationShowDetails",
            },
            link: function(scope, element, attrs) {

                element.click(function(){
                    //console.log(scope.modal);
                    postReconciliationService.setDetailsModalBody('reconciliation/post-reconciliation-details-view/'+scope.fileID);

                    globalService.ajaxPostData('reconciliation/post-reconciliation-show-details', {fileID:scope.fileID}).then(function(fileName){
                        
                        //console.log(summary);

                        postReconciliationService.setDetailsModalTitle(fileName.fileName + ' Details');

                        postReconciliationService.setDetailsModalWatch(true);
                        
                        //postReconciliationService.setSummaryModalWatch(false);
                        //scope.modal = true;
                        //console.log(scope.modal);
                    });

                });

            }
        };
    }]);

    
    
})();