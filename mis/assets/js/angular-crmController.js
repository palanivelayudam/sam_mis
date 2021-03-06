/**
 * Created by Palani Velayudam on 28-Feb-17.
 */
/* -------------------------------
 1.0 CONTROLLER - Dashboard
 ------------------------------- */
app.controller('crmController', function ($scope, $rootScope, pendingRequests, passData) {
    var $crm_first_level_elem = '';
    var $crm_second_level_elem = '';
    var $crm_third_level_elem = '';
    var callback = '';
    $scope.table_headers = '';
    $scope.main_level_data = passData.getData();
//    $scope.main_level_data = JSON.parse(Cookies.get('crm'));
    if ($scope.main_level_data.length === 0) {
        $rootScope.$state.go('app.dashboard');
    }
    $scope.first_panel_title = $scope.main_level_data[ 0 ]

    /** START CRM FIRST LEVEL PANEL
     **************************************************************** **/
    $scope.crm_first_level_table_function = function () {
        $crm_first_level_elem = $('.crm_first_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#crm_first_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            //showHeader        : false,
            cookie            : true,
            cookieIdTable     : "crm_first_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'CRM',
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
            idTable           : "crm_first_level_table",
            idTable_callback  : "crm_first_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [
                {
                    checkbox: true,
                    sortable: false
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

    $scope.crm_first_level_table_http_function = function () {
		console.log($scope.main_level_data[ 0 ]);
        $rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'crm_first_level_table_http_function', $scope.main_level_data[ 0 ]).then(function successCallback(response) {
            var tt = response.data.head_val;
            var array = tt.split(',');
            $scope.table_headers = array;
            $scope.leveltwo = [];
            if (response.data.status) {
                $rootScope.$timeout(function () {
                    $scope.crm_first_level_table_function();
                    $scope.leveltwo.push(response.data.key);
                    $crm_first_level_elem.bootstrapTable('load', $rootScope.service.put_data(response.data.key));
                }, 0);
                passData.clearData();
            } else {

            }

        }, function errorCallback(response) {

        });
    };

    $scope.crm_first_level_table_document_ready = function () {
        $button = $('#resetSearch');
        $('#crm_first_level_toolbar').find('select').change(function () {
            $crm_first_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $crm_first_level_elem.bootstrapTable('resetSearch');
        });
    };
    /** END CRM FIRST LEVEL PANEL
     **************************************************************** **/


    /** START CRM SECOND LEVEL PANEL
     **************************************************************** **/
    $scope.crm_second_level_panel_front_show = false;
    $('.crm_first_level_table').on('click-row.bs.table', function (e, arg1, arg2) {
		$rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'crm_second_level_table_http_function', arg1).then(function successCallback(response) {
			$scope.crm_second_level_panel_front_show = true; 
			$scope.crm_third_level_panel_front_show = false;     
			var tt = response.data.head_val;
			var array = tt.split(',');
			$scope.table_headers = array;
			$scope.second_panel_title = arg1;
			if (response.data.status) {
				$rootScope.$timeout(function () {
					$scope.crm_second_level_table_function();
					$crm_second_level_elem.bootstrapTable('load', $rootScope.service.put_data(response.data.key));
				}, 0);
				passData.clearData();
			} else {

			}

		}, function errorCallback(response) {

		});		
    });

    $scope.crm_second_level_table_function = function () {
        $crm_second_level_elem = $('.crm_second_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#crm_second_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            //showHeader        : false,
            cookie            : true,
            cookieIdTable     : "crm_second_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'CRM',
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
            idTable           : "crm_second_level_table",
            idTable_callback  : "crm_second_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [
                {
                    checkbox: true,
                    sortable: false
                } , {
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
                }]

        });
    };

    $scope.crm_second_level_table_document_ready = function () {
        $button = $('#crm_second_level_resetSearch');
        $('#crm_second_level_toolbar').find('select').change(function () {
            $crm_second_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $crm_second_level_elem.bootstrapTable('resetSearch');
        });
    };
    /** END CRM SECOND LEVEL PANEL
     **************************************************************** **/
     
    /** START CRM THIRD LEVEL PANEL
    **************************************************************** **/
    $scope.crm_third_level_panel_front_show = false;
    $('.crm_second_level_table').on('click-row.bs.table', function (e, arg1, arg2) {
		$rootScope.service.http_post($rootScope.setting.constant.ajaxurl + 'crm_third_level_table_http_function', arg1).then(function successCallback(response) {
			$scope.crm_third_level_panel_front_show = true;      
			var tt = response.data.head_val;
			var array = tt.split(',');
			$scope.table_headers = array;
			$scope.third_panel_title = arg1;
			if (response.data.status) {
				$rootScope.$timeout(function () {
					$scope.crm_third_level_table_function();
					$crm_third_level_elem.bootstrapTable('load', $rootScope.service.put_data(response.data.key));
				}, 0);
				passData.clearData();
			} else {

			}

		}, function errorCallback(response) {

		});		
    });

    $scope.crm_third_level_table_function = function () {
        $crm_third_level_elem = $('.crm_third_level_table').bootstrapTable({
            pagination        : true,
            search            : true,
            showColumns       : true,
            showExport        : true,
            toolbar           : '#crm_third_level_toolbar',
            exportTypes       : [ 'excel', 'pdf' ],
            //showHeader        : false,
            cookie            : true,
            cookieIdTable     : "crm_third_level_table",
            keyEvents         : true,
            exportOptions     : {
                fileName    : 'CRM',
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
            idTable           : "crm_third_level_table",
            idTable_callback  : "crm_third_level_table",
            onPostBody        : function () {

            },
            onPostHeader      : function (a) {

            },
            columns           : [
                {
                    checkbox: true,
                    sortable: false
                } , {
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
                }]

        });
    };

    $scope.crm_third_level_table_document_ready = function () {
        $button = $('#crm_third_level_resetSearch');
        $('#crm_third_level_toolbar').find('select').change(function () {
            $crm_third_level_elem.bootstrapTable('refreshOptions', {
                exportDataType: $(this).val()
            });
        });

        $button.click(function () {
            $crm_third_level_elem.bootstrapTable('resetSearch');
        });
    };
    /** END CRM THIRD LEVEL PANEL
    **************************************************************** **/


    /** START DOCUMENT READY
     **************************************************************** **/
    angular.element(document).ready(function () {
        $rootScope.$timeout(function () {
            $('#fusioncharts-tooltip-element').css('display', 'none');
            if ($scope.main_level_data.length >= 1) {
                $scope.crm_first_level_table_http_function();
            }
            $scope.crm_first_level_table_document_ready();

            
        }, 0);
    });
    /** END DOCUMENT READY
     **************************************************************** **/
});

function snoFormatter(value, row, index) {
    return 1 + index;
}

var advance_search_call_back = function (a, b) {
    "use strict";
    if (a === 'crm_first_level_table') {
        $(b).find("input[name*='_date']").datepicker({
            format: 'dd/mm/yyyy'
        });
    }
};
