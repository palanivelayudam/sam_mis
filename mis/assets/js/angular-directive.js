/** Restrict Click
 **************************************************************** **/
app.directive('a', function () {
    return {
        restrict: 'E',
        link    : function (scope, elem, attrs) {
            if (attrs.ngClick || attrs.href === '' || attrs.href === '#') {
                elem.on('click', function (e) {
                    e.preventDefault();
                });
            }
        }
    };
});
/** End Restrict Click
 **************************************************************** **/

/** Date Picker
 **************************************************************** **/
app.directive("datePicker", function ($rootScope) {
    return {
        restrict: "A",
        link    : function (scope, elem, attrs) {
            if (attrs.datePicker == 'true') {
                var date = {};
                date.start = (attrs.start == 'true') ? new Date() : false;
                date.end = (attrs.end == 'true') ? new Date() : false;
                $rootScope.date(date, elem)
            }
        }
    };
});
/** End Date Picker
 **************************************************************** **/

/** Time Picker
 **************************************************************** **/
app.directive("timePicker", function ($rootScope) {
    return {
        restrict: "A",
        link    : function (scope, elem, attrs) {
            $(elem[ 0 ].nextElementSibling).attr("onclick", "$(this).prev('[time_picker]').focus();");
            if (attrs.timePicker == 'true') {
                var time = {};
                time.start = (attrs.start == 'true') ? new Date() : false;
                time.end = (attrs.end == 'true') ? new Date() : false;
                time.step = (attrs.step != '' && typeof(attrs.step) != 'undefined') ? parseInt(attrs.step) : 2;
                $rootScope.time(time, elem)
            }
        }
    };
});
/** End Time Picker
 **************************************************************** **/

/** Ladda Button
 **************************************************************** **/
app.directive("laddaButton", function () {
    return {
        restrict: "A",
        replace : true,
        template: '<button type="submit" class="btn btn-primary btn-sm ladda-button" data-color="mint" data-style="expand-right" data-size="l"><span class="ladda-label">Submit</span></button>',
        link    : function (scope, elem, attrs) {
        }
    };
});
/** End Ladda Button
 **************************************************************** **/

/** Disable Button
 **************************************************************** **/
app.directive("disableButton", function () {
    return {
        restrict: 'A',
        link    : function (scope, element, attrs) {
            var $el = $(element);
            var submitBtn = $el.find('button[type="submit"]');
            var _name = attrs.name;
            scope.$watch(_name + '.$valid', function (val) {
                if (val) {
                    submitBtn.removeAttr('disabled');
                } else {
                    submitBtn.attr('disabled', 'disabled');
                }
            });
        }
    };
});
/** End Disable Button
 **************************************************************** **/

/** Select 2
 **************************************************************** **/
app.directive("select2", function ($rootScope) {
    return {
        restrict: "A",
        link    : function (scope, elem, attrs) {
            $(elem).select2({
                placeholder: "Select"
            });
        }
    };
});
/** End Select 2
 **************************************************************** **/

/** viewaschart Tooltip
 **************************************************************** **/
app.directive("viewaschart", function ($rootScope) {
    return {
        restrict: "A",
        link    : function (scope, elem, attrs) {
            $(elem).tooltip({
                title    : "View as Chart",
                placement: "bottom",
                trigger  : "hover",
                container: "body"
            });
        }
    };
});

app.directive("viewastable", function ($rootScope) {
    return {
        restrict: "A",
        link    : function (scope, elem, attrs) {
            $(elem).tooltip({
                title    : "View as Table",
                placement: "bottom",
                trigger  : "hover",
                container: "body"
            });
        }
    };
});
/** End viewaschart Tooltip
 **************************************************************** **/


/** BACK Button
 **************************************************************** **/
app.directive("doBackButton", function ($rootScope) {
    return {
        restrict: 'A',
        link    : function (scope, element, attrs) {
            var $el = $(element);
            var to_back = $rootScope.$localStorage.previous_page;
            var col = $rootScope.setting.constant.label_color;
            $($el).append('<span class="pull-right label label-'+col+' ttc" databack data-prev="'+to_back+'">Back</span>');
        }
    };
});
/** End BACK Button
 **************************************************************** **/
