(function() {
    var managePartnersService = angular.module('manage-partners-service', []);

    managePartnersService.service('managePartnersService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
            this.getForm = function(id) {
                var dfd = q.defer();
                var urlToUse = '';
                
                if(id != null) {
                    urlToUse = rootScope.baseUrl + '/company/company-register/'+id;
                }else{
                    urlToUse = rootScope.baseUrl + '/company/company-register';
                }
                
                http({
                    url: urlToUse,
                    method: 'GET',
                    dataType: 'JSON'
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
            
            this.registerCompanyInformation = function(cInfo) {
                var dfd = q.defer();
                var companyInformation = JSON.stringify(cInfo);
                http({
                    url: rootScope.baseUrl + '/company/company-registration',
                    method: 'POST',
                    dataType: 'JSON',
                    data: companyInformation
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
            
            this.updateCompanyInformation = function(cInfo) {
                var dfd = q.defer();
                var companyInformation = JSON.stringify(cInfo);
                http({
                    url: rootScope.baseUrl + '/company/edit-company-registration',
                    method: 'POST',
                    dataType: 'JSON',
                    data: companyInformation
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
            
            this.getCompanies = function() {
                var dfd = q.defer();
                
                http({
                    url: rootScope.baseUrl + '/company/all-companies-via-ajax',
                    method: 'GET',
                    dataType: 'JSON'
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
            };
        }]);

    managePartnersService.service('B2BModalService', [function() {

            var _mainModalSettings = {
                show:false,
                title:"",
                body:{
                },
                actions:{
                    deny:{show:true,name:"Close",class:"red small"},
                    approve:{show:true,name:"Close",class:"green small"}
                }
            }

            var _subModalSettings = {
                show:false,
                title:"",
                body:{
                },
                actions:{
                    deny:{show:true,name:"Close",class:"red small"},
                    approve:{show:true,name:"Close",class:"green small"}
                }
            }

            var _firstModalObject = {
                title: '',
                action: '',
                id: null
            };
            var _secondModalObject = {
                title: '',
                action: '',
                companyID: null,
                id: null
            };

            var _showFirstModal = {
                status: false
            };

            var _showSecondModal = {
                status: false
            };

            var _selectedSubmodule = {
                submodule: null
            };

            this.getMainModalSettings = function() {
                return _mainModalSettings;    
            };
            
            this.setMainModalSettings = function(obj) {
                for(var index in _mainModalSettings) {
                    _mainModalSettings[index] = obj[index];
                }
            };

            this.getSubModalSettings = function() {
                return _subModalSettings;    
            };
            
            this.setSubModalSettings = function(obj) {
                for(var index in _subModalSettings) {
                    _subModalSettings[index] = obj[index];
                }
            };

            //First modal functions start
            this.getShowFirstModal = function() {
                return _showFirstModal;    
            };
            this.setShowFirstModal = function(obj) {
                for(var attr in _showFirstModal) {
                    _showFirstModal[attr] = obj[attr];
                }
            };

            this.getFirstModalParameters = function() {
                return _firstModalObject;
            };
            this.setFirstModalParameters = function(obj) {
                for(var attr in _firstModalObject) {
                    _firstModalObject[attr] = obj[attr];
                }
            };
            this.resetFirstModalParameters = function() {
                _firstModalObject = {
                    title: '',
                    action: '',
                    id: null
                };
            };
            //First modal functions end

            //Submodule select functions start
            this.getSelectedSubmodule = function() {
                return _selectedSubmodule;
            };

            this.setSelectedSubmodule = function(obj) {
                for(var attr in _selectedSubmodule) {
                    _selectedSubmodule[attr] = obj[attr];
                }
            };
            //Submodule select functions end

            //Second modal functions start
            this.getShowSecondModal = function() {
                return _showSecondModal;
            };

            this.setShowSecondModal = function(obj) {
                for(var attr in _showSecondModal) {
                    _showSecondModal[attr] = obj[attr];
                }
            };
            
            this.getSecondModalParameters = function() {
                return _secondModalObject;
            };

            this.setSecondModalParameters = function(obj) {
                for(var attr in _secondModalObject) {
                    _secondModalObject[attr] = obj[attr];
                }
            };

            this.resetSecondModalParameters = function() {
                _secondModalObject = {
                    title: '',
                    action: '',
                    companyID: null,
                    id: null
                };
            };
            //Second modal functions end
        }]);
})();