app.service('pendingRequests', function () {
    var pending = [];
    this.get = function () {
        return pending;
    };
    this.add = function (request) {
        pending.push(request);
    };
    this.remove = function (request) {
        pending = _.filter(pending, function (p) {
            if (p.url === request){
                p.canceller.resolve();
            }
        });
    };
    this.cancelAll = function () {
        angular.forEach(pending, function (p) {
            p.canceller.resolve();
        });
        pending.length = 0;
    };
});

app.service('service', [ '$rootScope', '$http', '$q', 'pendingRequests', function ($rootScope, $http, $q, pendingRequests) {
    this.login = function (data) {
        $rootScope.$http({
            method: 'POST',
            url   : $rootScope.setting.constant.ajaxurl + 'login',
            data  : data
        }).then(function successCallback(response) {
            if (response.data.status === 'success') {
                $rootScope.getuser = response.data.key;
                var encrypted = $rootScope.$crypto.encrypt(response.data.key.password);
                response.data.key.password = encrypted;
                if(data.remember === 'YES'){
                    $rootScope.$localStorage.user = response.data.key;
                    $rootScope.setting.login.remember = true;
                }else{
                    $rootScope.$sessionStorage.user = response.data.key;
                    $rootScope.setting.login.remember = false;
                }
                Cookies.set('loginname', data.username);
                Cookies.set('username', response.data.key.user_name);
                /*var decrypted = $rootScope.$crypto.decrypt(encrypted);
                 console.log(encrypted)
                 console.log(decrypted)*/
                $rootScope.setting.layout.pageWithoutHeader = false;
                $rootScope.setting.layout.paceTop = false;
                $rootScope.setting.layout.pageBgWhite = false;
                $rootScope.$state.go('app.dashboard')
            } else {
                toastr.error('Password for ' + data.username + ' does\'t Match', 'Error!');
            }
        }, function errorCallback(response) {
        });
    };

    this.swapper = function (div1, div2, other) {
        d1 = document.getElementById(div1);
        d2 = document.getElementById(div2);
        if (d2.style.display === "none") {
            d1.style.display = "none";
            d2.style.display = "block";
        }
        else {
            d1.style.display = "block";
            d2.style.display = "none";
        }
    };

    this.httperror = function () {
      toastr.warning('Invalid Response','Waring')
    };

    this.loading_panel_first = function ($event) {
        var a = angular.element(document).find('.panel');
        if (!$(a).hasClass("panel-loading")) {
            var t = $(a).find(".panel-body"),
                i = '<div class="panel-loader"><div class="showbox"> <div class="loader"> <svg class="circular" viewBox="25 25 50 50"> <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/> </svg> </div> </div></div>';
            $(a).addClass("panel-loading");
            $(t).prepend(i);
        }
    };

    this.loading_panel = function ($event,ele) {
        if($event !== null){
            var a = angular.element($event.target).closest('.panel');
            if (!$(a).hasClass("panel-loading")) {
                var t = $(a).find(".panel-body"),
                    i = '<div class="panel-loader"><div class="showbox"> <div class="loader"> <svg class="circular" viewBox="25 25 50 50"> <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/> </svg> </div> </div></div>';
                $(a).addClass("panel-loading");
                $(t).prepend(i);
            }
        }
        if(ele !== undefined){
            var a = ele;
            if (!$(a).hasClass("panel-loading")) {
                var t = $(a).find(".panel-body"),
                    i = '<div class="panel-loader"><div class="showbox"> <div class="loader"> <svg class="circular" viewBox="25 25 50 50"> <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/> </svg> </div> </div></div>';
                $(a).addClass("panel-loading");
                $(t).prepend(i);
            }
        }
    };

    this.hide_loading_panel = function ($event,ele) {
        if($event!==null){
            var a = angular.element(document).find($event.container).closest('.panel');
            $(a).removeClass("panel-loading"), $(a).find(".panel-loader").remove();
        }
        if(ele !== undefined){
            var a = angular.element(document).find(ele).closest('.panel');
            $(a).removeClass("panel-loading"), $(a).find(".panel-loader").remove();
        }
    };

    this.http_get = function (url) {
        var canceller = $q.defer();
        pendingRequests.add({
            url      : url,
            canceller: canceller
        });
        //Request gets cancelled if the timeout-promise is resolved
        var requestPromise = $http.get(url, {timeout: canceller.promise});
        //Once a request has failed or succeeded, remove it from the pending list
        requestPromise.finally(function () {
            pendingRequests.remove(url);
        });
        return requestPromise;
    };

    this.http_post = function (url,data) {
        var canceller = $q.defer();
        pendingRequests.add({
            url      : url,
            canceller: canceller
        });
        //Request gets cancelled if the timeout-promise is resolved
        var requestPromise = $http.post(url,data, {timeout: canceller.promise});
        //Once a request has failed or succeeded, remove it from the pending list
        requestPromise.finally(function () {
            pendingRequests.remove(url);
        });
        return requestPromise;
    };

    this.put_data = function (data) {
        rows = [];
        var values = data;
        angular.forEach(values, function (value, key) {
            rows.push(value);
        });
        return rows;
    };



} ]);


app.service('passData', function() {
    var passedData = [];
    this.sendData = function (newObj) {
        passedData.push(newObj);
    };

    this.getData = function (newObj) {
        return passedData;
    };

    this.clearData = function (newObj) {
        passedData.length = 0;
    };

    return {
        sendData: this.sendData,
        getData: this.getData,
        clearData:this.clearData
    };
});
