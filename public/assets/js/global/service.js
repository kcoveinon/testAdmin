(function() {
    var globalService = angular.module('global-service', []);

    globalService.service('globalService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

        var _contentLink='dashboard';
        //_contentLink='theme-builder/index/4';
        
        this.setContentLink = function(newContentLink){
            _contentLink=newContentLink;
        };

        this.getContentLink = function(){
            return _contentLink;
        };

        this.ajaxGetData = function(extendedUrl) {
            var dfd = q.defer();

            http({
                method: 'GET',
                url: rootScope.baseUrl +'/'+ extendedUrl,
                dataType: 'JSON'
            }).success(function(data) {
                dfd.resolve(data)
            }).error(function(data) {

            });

            return dfd.promise;
        };

        this.ajaxPostData = function(extendedUrl, parameters) {
            var dfd = q.defer();

            http({
                method: 'POST',
                url: rootScope.baseUrl +'/'+ extendedUrl,
                dataType: 'JSON',
                data: parameters
            }).success(function(data) {
                dfd.resolve(data)
            }).error(function(data) {

            });

            return dfd.promise;
        };
        
    }]);

    globalService.service('changeUserTypeService', [function() {

        var _changeUserTypeObjectVariables={
            'show':false,
            'content':{
                title:"Please select a partner you wish to login as",
                body:{
                    link:"views/get/pages.global.changeUserTypeModalContent",
                },
                actions:{
                    deny:{show:true,name:"Cancel",class:"negative"},
                    approve:{show:true,name:"Accept",class:"positive"}                
                }
            },
            'settings':{
                detachable: false,
                closable: false,
                onApprove: function() {

                    console.log('approve');

                },
            },
        };

        this.getContentByIndex = function(index){
            return _changeUserTypeObjectVariables[index];
        };
        
    }]);











//Previous Services

    globalService.provider('globalData', function() {
        this.symbol = {
            'start': '[[',
            'end': ']]'
        };

        this.$get = function() {
            var baseUrl = '';
            return {
                getBaseUrl: function() {
                    return baseUrl;
                },
                setBaseUrl: function(baseUrl2) {
                    baseUrl = baseUrl2;
                }
            };
        };

        this.getSymbols = function() {
            return this.symbol;
        };

    });

    globalService.factory('ConstantsFactory', function() {
        var constants;
    });

    globalService.service('ServerDataService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {

            var baseUrl;
            this.getServerDate = function(obj) {
                var dfd = q.defer();

                if (obj.modify === undefined) {
                    obj.modify = 'null';
                }

                http({
                    method: 'GET',
                    url: rootScope.baseUrl + '/server/current-dates/' + obj.dateFormat + '/' + obj.timeFormat + '/' + obj.modify,
                    dataType: 'JSON'
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {

                });

                return dfd.promise;
            };

            this.setBaseUrl = function(baseUrl) {
                this.baseUrl = baseUrl;
            };

            this.getBaseUrl = function() {

            };
        }]);
    
    globalService.service('PageDataService', ['$http', '$q', '$rootScope', function(http, q, rootScope) {
            
        var _linkToShowAction = {
            link: ''
        };
            
        this.getPage = function(address) {
            //console.log('Page Service was called: '+address);
            var dfd = q.defer();
            http({
                url: rootScope.baseUrl +'/'+ address,
                method: 'GET'
            }).success(function(data){
                dfd.resolve(data);
            }).error(function(data){
                window.alert('There was an error when processing your request.');
            });
            
            return dfd.promise;
        };
        
        this.changeSession = function(partnerID) {
            if (partnerID) {
                var dfd = q.defer();
                var partnerInformation = {
                    newCompanyID: partnerID
                };
                var jsonData = JSON.stringify(partnerInformation);
                
                http({
                    url: rootScope.baseUrl + '/users/change-admin-session',
                    method: 'POST',
                    dataType: 'JSON',
                    data: jsonData
                }).success(function(data) {
                    dfd.resolve(data);
                }).error(function(data) {
                    window.alert('There was an error when processing your request.');
                });

                return dfd.promise;
                
//                $http.post('users/change-admin-session', {'newCompanyID': newCompanyID}).success(function(data, status, headers, config) {
//                    if(data.status === 'timeout'){
//                        window.alert('Your session has expired. Please log in again.');
//                        window.location.href = data.logoutURL;
//                    }else{
//                        window.location.reload();
//                    }
//                });
            } else {
                window.alert('null');
            }
        };
        
        this.showPageDimmer = function() {
            rootScope.pageLoaderStatus = true;
        };
        
        this.hidePageDimmer = function() {
            rootScope.pageLoaderStatus = false;
        };
        
        this.getLinkToShowAction = function() {
            return _linkToShowAction;
        };
        
        this.setLinkToShowAction = function(obj) {
            for(var attr in _linkToShowAction) {
                _linkToShowAction[attr] = obj[attr];
            }
        };
        
        this.resetLinkToShowAction = function() {
            _linkToShowAction.link = '';
        };
    }]);
})();