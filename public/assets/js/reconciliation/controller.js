(function() {
    var reconciliationController = angular.module('reconciliation-controller', []);

    reconciliationController.controller("reconciliationController", ['$scope', function(scope) {

    	scope.monthToProcess=201501;

    	var previewTemplate =
            '   <div class="item">'+
            '       <div class="right floated compact ui orange tiny button cancel">Cancel</div>'+
            '       <div class="right floated compact ui blue tiny button start">Start</div>'+
            '       <div class="right floated compact ui red tiny button delete" style="display:none">Delete</div>'+
            '       <div class="right floated compact ui teal progress upload-progress-bar">'+
            '           <div class="bar">'+
            '               <div class="progress"></div>'+
            '           </div>'+
            '       </div>'+
            '       <div class="right floated compact" data-dz-size></div>'+
            '       <img class="ui mini circular image" data-dz-thumbnail >'+
            '       <div class="content">'+
            '           <div class="header" data-dz-name></div>'+
            '           <strong class="upload-error" data-dz-errormessage></strong>'+
            '       </div>'+
            '   </div>'
        ;
        
        scope.dropzoneObj = new Dropzone("#upload-area",{ 
            url: 'reconciliation/upload',
            parallelUploads: 1,
            previewTemplate: previewTemplate,
            autoQueue: false,
            previewsContainer: "#preview-area",
            clickable: ".upload-button"
        });

        scope.dropzoneObj.on("addedfile", function(file) {
            file.previewElement.querySelector(".start").onclick = function() { scope.dropzoneObj.enqueueFile(file); };
            $(file.previewElement).find(".upload-progress-bar").progress();
        });

        scope.dropzoneObj.on("sending", function(file, xhrObj, formDataObj) {
        	//console.log(xhrObj);
        	//console.log(formDataObj);
        	formDataObj.append('monthToProcess', scope.monthToProcess);
            file.previewElement.querySelector(".start").setAttribute("disabled", "disabled");
        });

        scope.dropzoneObj.on("complete", function(file) {
            file.previewElement.querySelector(".start").style.display="none";
            file.previewElement.querySelector(".cancel").style.display="none";
            file.previewElement.querySelector(".delete").style.display="block";
        });

        scope.dropzoneObj.on("uploadprogress", function(file, progress) {
        	
            $(file.previewElement).find(".upload-progress-bar").progress({
			  	percent: progress
			});

        });


    }]);

    reconciliationController.controller("reconciliationPageController", ['$scope', 'globalService', function(scope, globalService) {

        scope.recordsLoaded=false;

        globalService.ajaxGetData('reconciliation/for-process-list').then(function(result){
            scope.forProcessList = result;
            scope.recordsLoaded=true;
        });

    }]);

    reconciliationController.controller("postReconciliationController", ['$scope', 'globalService', 'postReconciliationService', function(scope, globalService, postReconciliationService) {

        scope.recordsLoaded=false;

        globalService.ajaxGetData('reconciliation/processed-list').then(function(result){
            scope.processedList = result;
            scope.recordsLoaded=true;
        });

        scope.postReconciliationShowSummaryModal = postReconciliationService.getSummaryModalWatch;
        scope.postReconciliationShowSummaryContent = postReconciliationService.getSummaryModalContent();
        scope.postReconciliationShowSummarySettings = postReconciliationService.getSummaryModalSettings();

        scope.postReconciliationShowDetailsModal = postReconciliationService.getDetailsModalWatch;
        scope.postReconciliationShowDetailsContent = postReconciliationService.getDetailsModalContent();
        scope.postReconciliationShowDetailsSettings = postReconciliationService.getDetailsModalSettings();


    }]);

    reconciliationController.controller("completedFilesController", ['$scope', 'globalService', function(scope, globalService) {

        scope.recordsLoaded=false;

        globalService.ajaxGetData('reconciliation/completed-list').then(function(result){
            scope.completedList = result;
            scope.recordsLoaded = true;
        });

    }]);

    reconciliationController.controller("postReconciliationSummaryController", ['$scope', 'postReconciliationService', function(scope, postReconciliationService) {

        //scope.summaryList = postReconciliationService.getSummaryList();

        scope.$watch(postReconciliationService.getSummaryList, function(summaryList) {
                //console.log(summaryList);
                scope.summaryList = summaryList;
            }
        )

    }]);

    reconciliationController.controller("postReconciliationDetailsController", ['$scope', 'postReconciliationService', function(scope, postReconciliationService) {

        scope.postReconciliationDetailsColumns = [

            {
                header: 'Supplier Confirmation',
                model: 'PRDSupplierConfirmation',
                search_type: 'text',
                width: '30%'
            },
            {
                header: 'Currency Code',
                model: 'PRDCurrencyCode',
                search_type: 'text',
                width: '15%'
            },
            {
                header: 'Commission Cost',
                model: 'PRDCommissionCost',
                search_type: 'text',
                width: '15%'
            },
            {
                header: 'Commission Cost Expected',
                model: 'PRDCommissionCostExpected',
                search_type: 'text',
                width: '15%'
            },
            {
                header: 'Difference',
                model: 'PRDDifference',
                search_type: 'text',
                width: '15%'
            }

        ];

        //scope.summaryList = postReconciliationService.getSummaryList();

        /*
        scope.$watch(postReconciliationService.getSummaryList, function(summaryList) {
                //console.log(summaryList);
                scope.summaryList = summaryList;
            }
        )
        */
    }]);

})();