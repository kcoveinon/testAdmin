(function() {
    var reconciliationService = angular.module('reconciliation-service', []);

    reconciliationService.service('postReconciliationService', [function() {
    	var _summaryList = {};
    	var _summaryModal = {
    		watch:false,
    		content:{
	            body:{
	                link:'views/get/pages.reconciliation.postReconciliationSummary',
	            },
	            actions:{
	                close:{show:true,name:"Close",class:"red small"},
	            }
	        },
	        settings:{
	        	onHide:function(){
	        		_summaryModal.watch = false;
	        	},
	            detachable:false,
	            closable: false,
	        },
    	};

    	var _detailsModal = {
    		watch:false,
    		content:{
	            body:{},
	            actions:{
	                close:{show:true,name:"Close",class:"red small"},
	            }
	        },
	        settings:{
	        	onHide:function(){
	        		_detailsModal.watch = false;
	        	},
	            detachable:false,
	            closable: false,
	        },
    	};





    	this.getSummaryList = function(){
    		return _summaryList;
    	};

    	this.setSummaryList = function(summaryList){
    		_summaryList = summaryList;
    		//console.log(_summaryList);
    	};

    	this.getSummaryModalWatch = function(){
    		return _summaryModal.watch;
    	};

    	this.getSummaryModalContent = function(){
    		return _summaryModal.content;
    	};

    	this.getSummaryModalSettings = function(){
    		return _summaryModal.settings;
    	};

    	this.setSummaryModalWatch = function(summaryModalWatch){
    		_summaryModal.watch = summaryModalWatch;
    	};

    	this.setSummaryModalTitle = function(summaryModalTitle){
    		_summaryModal.content.title = summaryModalTitle;
    	};






		this.getDetailsList = function(){
    		return _detailsList;
    	};

    	this.setDetailsList = function(detailsList){
    		_detailsList = detailsList;
    		//console.log(_detailsList);
    	};

    	this.getDetailsModalWatch = function(){
    		return _detailsModal.watch;
    	};

    	this.getDetailsModalContent = function(){
    		return _detailsModal.content;
    	};

    	this.getDetailsModalSettings = function(){
    		return _detailsModal.settings;
    	};

    	this.setDetailsModalWatch = function(detailsModalWatch){
    		_detailsModal.watch = detailsModalWatch;
    	};

    	this.setDetailsModalTitle = function(detailsModalTitle){
    		_detailsModal.content.title = detailsModalTitle;
    	};

        this.setDetailsModalBody = function(detailsModalBody){
            _detailsModal.content.body = {
                link:detailsModalBody
            };
        };

    }]);


})();