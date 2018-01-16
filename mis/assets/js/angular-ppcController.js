/* -------------------------------
 1.0 CONTROLLER - PPC Dashboard
 ------------------------------- */
app.controller('ppcController', [
    '$scope',
    '$element',
    '$log',
    '$rootScope',
    'pendingRequests',
    'passData', function ($scope, $element, $log, $rootScope, pendingRequests, passData) {
		
	var myElements = $element;
	var $ppc_first_level_elem = '', $ppc_second_level_elem = '', $ppc_consolidate_elem = '';
    var callback = '';
    $scope.table_headers = '';
    $scope.table_headers_second = '';
    $scope.main_level_data = passData.getData();

    if ($scope.main_level_data.length === 0) {
        $rootScope.$state.go('app.dashboard');
    }
    $scope.first_panel_title = $scope.main_level_data[ 0 ].arg;

    /** START PPC CONSOLIDATED
     **************************************************************** **
     $scope.ppc_consolidate_table_function = function () {
        $ppc_consolidate_elem = $('.ppc_consolidate_table').bootstrapTable({});
    };

     $('.ppc_consolidate_table').on('click-row.bs.table', function (e, arg1, arg2) {
        var data = {
            arg_data: arg1
        };
        $scope.first_panel_title = arg1;
        $scope.ppc_first_level_table_http_function(data);
    });

     /** END PPC CONSOLIDATED
     **************************************************************** **/


    /** START PPC FIRST LEVEL PANEL
     **************************************************************** **/
    $scope.ppc_first_level_table_function = function () {
        $ppc_first_level_elem = $('.ppc_first_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#ppc_first_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "ppc_first_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'PPC',
                excelstyles : [ 'border-bottom' ],
                ignoreColumn: [ 'columnheader' ],
                jspdf       : {
                    orientation: 'l',
                    format     : 'a4',
                    autotable  : {
                        theme             : 'grid',
                        styles            : {
                            fontSize: 8,
                            overflow: 'linebreak'
                        },
                        headerStyles      : {
                            rowHeight: 20,
                            fillColor: [ 52, 73, 94 ],
                            textColor: 255,
                            fontStyle: 'bold',
                            halign   : 'center',
                        },
                        alternateRowStyles: {
                            fillColor: [ 226, 231, 235 ]
                        }
                    }
                }
            },
            reorderableColumns: true,
            advancedSearch    : true,
            idTable           : "ppc_first_level_table",
            idTable_callback  : "ppc_first_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [ 
                {
                    checkbox: true,
                    sortable: false
                },{
                    visible   : false,
                    switchable: false
                },
                {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                } ]
          

        });
    };

    $scope.ppc_first_level_table_http_function = function (data) {
        $rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'ppc_first_level_table_http_function', data.arg_data).then(function successCallback(response) {
            var levelone_header = response.data.head_val;
            var array = levelone_header.split(',');            
            $scope.table_headers = array;
            //console.log(response.data.key);
            if (response.data.status) {
                $rootScope.$timeout(function () {
                    $scope.ppc_first_level_table_function();
                    if(response.data.key)
                    {
						$scope.AllData = response.data.key
					}
					
                    var levelone = [];
                    $scope.leveltwo = [];
                    $.grep($scope.AllData, function (v, i) {
                        if (v.level_id === '1') {							
                            levelone.push(v);
                            return true;
                        }
                        if (v.level_id === '2') {
                            $scope.leveltwo.push(v);
                            return true;
                        }
                    });
                    
                    $ppc_first_level_elem.bootstrapTable('load', $rootScope.service.put_data(levelone));
                }, 0);
                passData.clearData();
            } else {

            }

        }, function errorCallback(response) {

        });
    };

    $scope.ppc_first_level_table_document_ready = function () {
        $button = $('#resetSearch');
        $('#ppc_first_level_toolbar').find('select').change(function () {
            $ppc_first_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $ppc_first_level_elem.bootstrapTable('resetSearch');
        });
    };

    /** END PPC FIRST LEVEL PANEL
     **************************************************************** **/


    /** START PPC SECOND LEVEL PANEL
     **************************************************************** **/
    $scope.ppc_second_level_panel_front_show = false;
    $('.ppc_first_level_table').on('click-row.bs.table', function (e, arg1, arg2) {
        $scope.$apply(function () {
            var leveltwodata = [];
			$.grep($scope.leveltwo, function (v, i) {
				if (arg1.wo_id === v.wo_id ) {
					leveltwodata.push(v);
					return true;
				}
			});
			
            $scope.second_panel_title = arg1;
            var leveltwodata_header = leveltwodata[0].columnheader_test;
            var array_2nd = leveltwodata_header.split(',');           
            $scope.table_headers_second = array_2nd;            
            //~ console.log(array_2nd)
            $scope.ppc_second_level_panel_front_show = true;            
            $rootScope.$timeout(function(){
				$ppc_second_level_elem = myElements.find('.ppc_second_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#ppc_second_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            cookie            : false,
            cookieIdTable     : "ppc_second_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'PPC',
                excelstyles : [ 'border-bottom' ],
                ignoreColumn: [ 'columnheader' ],
                jspdf       : {
                    orientation: 'l',
                    format     : 'a4',
                    autotable  : {
                        theme             : 'grid',
                        styles            : {
                            fontSize: 8,
                            overflow: 'linebreak'
                        },
                        headerStyles      : {
                            rowHeight: 20,
                            fillColor: [ 52, 73, 94 ],
                            textColor: 255,
                            fontStyle: 'bold',
                            halign   : 'center',
                        },
                        alternateRowStyles: {
                            fillColor: [ 226, 231, 235 ]
                        }
                    }
                }
            },
            reorderableColumns: true,
            advancedSearch    : true,
            idTable           : "ppc_second_level_table",
            idTable_callback  : "ppc_second_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [
				{
                    checkbox: true,
                    sortable: false
                },{
                    visible   : false,
                    switchable: false
                },
                {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }, {
                    visible   : false,
                    switchable: false
                }
                 ]
          

        });
				$ppc_second_level_elem.bootstrapTable('load', $rootScope.service.put_data(leveltwodata));
			},0)
            
        });

    });

    $scope.ppc_second_level_table_document_ready = function () {
        $button = $('#ppc_second_level_resetSearch');
        $('#ppc_second_level_toolbar').find('select').change(function () {
            $ppc_second_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $ppc_second_level_elem.bootstrapTable('resetSearch');
        });
    };
    /** END PPC SECOND LEVEL PANEL
     **************************************************************** **/


    /** START DOCUMENT READY
     **************************************************************** **/
    angular.element(document).ready(function () {
        $rootScope.$timeout(function () {
//            $('#fusioncharts-tooltip-element').css('display', 'none');
            if ($scope.main_level_data.length >= 1) {
                var data = {
                    arg_data: $scope.main_level_data[ 0 ].arg
                };
                
                $scope.ppc_first_level_table_http_function(data);
            }
            $scope.ppc_first_level_table_document_ready();

            /*$scope.ppc_consolidate_table_function();
             $ppc_consolidate_elem.bootstrapTable('load', $scope.main_level_data[ 0 ].ppc_panel_main_level);*/


        }, 0);
    });
    /** END DOCUMENT READY
     **************************************************************** **/
}]);

function snoFormatter(value, row, index) {
    return 1 + index;
}

var advance_search_call_back = function (a, b) {
    "use strict";
    if (a === 'ppc_first_level_table') {
        $(b).find("input[name*='_date']").datepicker({
            format: 'dd/mm/yyyy'
        });
    }
};