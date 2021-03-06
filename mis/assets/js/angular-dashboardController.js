/**
 * Created by Palani Velayudam on 28-Feb-17.
 */
/* -------------------------------
 1.0 CONTROLLER - Dashboard
 ------------------------------- */
app.controller('dashboardController', function ($scope, $rootScope, pendingRequests, passData) {
    $rootScope.setting.layout.pageBgWhite = false;
    $rootScope.setting.layout.pageWithoutHeader = false;
    $rootScope.setting.layout.paceTop = false;
    var $crm_back_table_elem = '';
    var $ppc_back_table_elem = '';
    var $purchase_back_table_elem = '';
    var $warehouse_back_table_elem = '';
    var $accounts_back_table_elem = '';
    var crm_panel_chart_elem = [];
    var ppc_panel_chart_elem = [];
    var accounts_panel_chart_elem = [];
    var purchase_panel_chart_elem = [];
    var warehouse_panel_chart_elem = [];
    var accounts_panel_chart_elem = [];


    /** VIOLATION CRM PANEL
     **************************************************************** **/
    $scope.filters = {};
    $scope.links = [
        {category: 'PURCHASE', desc: 'Delivery date exceeded PO list PO001,PO002' , color:''},
        {category: 'PURCHASE', desc: 'Yesterday  & current date despatch value 4.5Lakhs, 5.5Lakhs' , color:''},
        {category: 'PURCHASE', desc: 'Current date invoice value Rs.7.8Lakhs'},
        {category: 'PURCHASE', desc: 'Material expiry value in 30 days - 2.9 Lakhs'},
        {category: 'PURCHASE', desc: 'Last 7 days QC pending count - 10'}
    ];
    $scope.selected = '';
    $scope.select = function (index) {
        $scope.selected = index;
    };


    $scope.violation_panel_marquee = function () {
        angular.element(document).ready(function () {
            var marque = $('#violation_panel_marquee_tag');
            $(marque).hover(function () {
                this.stop();
            }, function () {
                if ($(marque).hasClass('marquee_stoped')) {

                } else {
                    this.start();
                }
            });

            $('.violation_panel_marquee').on('click', function () {
                if ($(marque).hasClass('marquee_stoped')) {
                    document.getElementById('violation_panel_marquee_tag').start();
                    $(marque).removeClass('marquee_stoped');
                    $(this).text('Stop Scroll');
                } else {
                    document.getElementById('violation_panel_marquee_tag').stop();
                    $(marque).addClass('marquee_stoped');
                    $(this).text('Start Scroll');
                }

            })


        });
    };
    $scope.violation_panel_marquee();

    $scope.violation_expand = function ($event) {
        $rootScope.$timeout(function () {
            var a = $($event.target).closest('.panel').parent().find('.panel-body');
            $(a).css('overflow', 'auto');
            var height = a[ 0 ].clientHeight;
            $(a).find('#marque_scroll marquee').attr('height', height - 10);
        }, 10);
    };

    $scope.violation_panel_back_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
    };

    $scope.violation_panel_front_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
    };
    /** END VIOLATION PANEL
     **************************************************************** **/


    /** START CRM PANEL
     **************************************************************** **/
    $scope.crm_panel_chart_function = function () {
        $scope.crm_panel_chart_type = 'pie2d';
        $rootScope.ttt = $scope.crm_panel_chart_dataSource = {
            chart: {
                "showLabels"   : '0',
                "xAxisName"    : "CRM",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "yAxisName"    : "Value",
                "numberPrefix" : "Rs.",
                "theme"        : "ocean",
                "showToolTip"  : "1",
                "enableSlicing": "0",
                "plottooltext" : "<div>$label</div><div>$value</div>"
            },
            data : []
        };

        $scope.events_crm = {
            "dataPlotClick": function (eventObj, dataObj) {
				if ($scope.crm_panel_chart_type === 'pie2d') {
                    var obj = $.grep($scope.crm_panel_chart_dataSource.data, function (v) {
                        var spl_val = dataObj.displayValue.split(',')
                        return v.label === spl_val[ 0 ];
                    });
                    passData.sendData(obj[ 0 ]);
                } else {
                    var obj = $.grep($scope.crm_panel_chart_dataSource.data, function (v) {
                        return v.label === dataObj.categoryLabel;
                    });
                    passData.sendData(obj[ 0 ]);
                }
//                Cookies.set('crm', obj[0]);
                $rootScope.$state.go('app.crm');
            }
        };
//~ 
        crm_panel_chart_elem = $('#crm_panel_chart_controllers li');
        for (i = 0; i < crm_panel_chart_elem.length; i++) {
            radElem = crm_panel_chart_elem[ i ];
            var t = $(radElem).hasClass('crm_chart_type')
            if (t === true) {
                radElem.onclick = function () {
						val = this.getAttribute('data-chart-type');
						if (val) {
							$scope.crm_panel_chart_type = val;
							$scope.$apply();
						}
						$.each(crm_panel_chart_elem, function (key, value) {
							if ($(value).hasClass('active')) {
								$(this).removeClass('active');
							}
						});
						$(this).addClass('active');
					};
				}
			}
		};

    $scope.crm_back_table_function = function () {
        $crm_back_table_elem = $('.crm_back_table').bootstrapTable({
            height     : 280,
            search     : false,
            showColumns: false,
             columns           : [ 
                {
                    checkbox: false,
                    sortable: false
                },{
                    visible   : true,
                    switchable: false,
                    align:'right'
                }]
        });
    };

		
		$('.crm_back_table').on('click-row.bs.table', function (e, arg1, arg2) {
			passData.sendData(arg1);
	//        Cookies.set('crm', arg1);
			$rootScope.$state.go('app.crm');
		});

		$scope.crm_panel_main_level_http_function = function () {
			//~ $rootScope.service.http_get($rootScope.setting.constant.ajaxurl + 'crm_panel_main_level' , $rootScope.$sessionStorage.user).
			$rootScope.$http({
            method: 'POST',
            url   : $rootScope.setting.constant.ajaxurl + 'crm_panel_main_level',
            data  : $rootScope.$sessionStorage.user
			}).then(function successCallback(response) {
					if (response.data.status) {
						$scope.received_data_crm_panel_main_level = $rootScope.service.put_data(response.data.key)
						$crm_back_table_elem.bootstrapTable('load', $scope.received_data_crm_panel_main_level);
						$scope.crm_panel_chart_dataSource.data = $scope.received_data_crm_panel_main_level;
						$scope.crm_panel_data_found = true;
					} else {
						$scope.crm_panel_no_data = true;
					}
				}, function errorCallback(response) {

				});
		};


		$scope.crm_panel_back_function = function ($event) {
			var a = $($event.target).closest('.panel').parent().next().find('.panel');
			$rootScope.service.hide_loading_panel(null, a);
			$(a).find('table.crm_back_table').bootstrapTable('resetView');
		};

		$scope.crm_panel_front_function = function ($event) {
			var a = $($event.target).closest('.panel').parent().next().find('.panel');
			$rootScope.service.hide_loading_panel(null, a);
		};
    /** END CRM PANEL
     **************************************************************** **/


    /** START PPC PANEL
     **************************************************************** **/

    $scope.ppc_panel_chart_function = function () {
        $scope.ppc_panel_chart_type = 'column2d';
        $rootScope.yyy = $scope.ppc_panel_chart_dataSource = {
            chart: {
                "showLabels"   : '0',
                "xAxisName"    : "PPC",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "yAxisName"    : "Value",
                "numberPrefix" : "Rs.",
                "theme"        : "ocean",
                "showToolTip"  : "1",
                "enableSlicing": "0",
                "plottooltext" : "<div>$label</div><div>$value</div>"
            },
            data : []
        };

        $scope.events_ppc = {
            "dataPlotClick": function (eventObj, dataObj) {
                if ($scope.ppc_panel_chart_type === 'pie2d') {
                    var obj = $.grep($scope.ppc_panel_chart_dataSource.data, function (v) {
                        var spl_val = dataObj.displayValue.split(',')
                        return v.label === spl_val[ 0 ];
                    });
                    var data = {
						ppc_panel_main_level: $scope.received_data_ppc_panel_main_level,
						arg                 : obj[ 0 ]
					};
                    passData.sendData(data);
                } else {
                    var obj = $.grep($scope.ppc_panel_chart_dataSource.data, function (v) {
                        return v.label === dataObj.categoryLabel;
                    });
                    var data = {
						ppc_panel_main_level: $scope.received_data_ppc_panel_main_level,
						arg                 : obj[ 0 ]
					};
                    passData.sendData(data);
                }
//                Cookies.set('crm', obj[0]);
                $rootScope.$state.go('app.ppc');
            }
        };

        ppc_panel_chart_elem = $('#ppc_panel_chart_controllers li');
        for (i = 0; i < ppc_panel_chart_elem.length; i++) {
            radElem = ppc_panel_chart_elem[ i ];
            var t = $(radElem).hasClass('ppc_chart_type')
            if (t === true) {
                radElem.onclick = function () {
						val = this.getAttribute('data-chart-type');
						if (val) {
							$scope.ppc_panel_chart_type = val;
							$scope.$apply();
						}
						$.each(ppc_panel_chart_elem, function (key, value) {
							if ($(value).hasClass('active')) {
								$(this).removeClass('active');
							}
						});
						$(this).addClass('active');
					};
				}
			}
		};

		$scope.ppc_back_table_function = function () {
			$ppc_back_table_elem = $('.ppc_back_table').bootstrapTable({
				height     : 280,
				search     : false,
				showColumns: false,
				columns           : [ 
					{
						checkbox: false,
						sortable: false
					},{
						visible   : true,
						switchable: false,
						align:'right'
					}]
			});
		};

		$('.ppc_back_table').on('click-row.bs.table', function (e, arg1, arg2) {
			var data = {
				ppc_panel_main_level: $scope.received_data_ppc_panel_main_level,
				arg                 : arg1
			};
			passData.sendData(data);
			$rootScope.$state.go('app.ppc');
		});

		$scope.ppc_panel_main_level_http_function = function () {
			$rootScope.service.http_get($rootScope.setting.constant.ajaxurl + 'ppc_panel_main_level').then(function successCallback(response) {
				if (response.data.status) {
					$scope.received_data_ppc_panel_main_level = $rootScope.service.put_data(response.data.key)
					$ppc_back_table_elem.bootstrapTable('load', $scope.received_data_ppc_panel_main_level);
					$scope.ppc_panel_chart_dataSource.data = $scope.received_data_ppc_panel_main_level;
					$scope.ppc_panel_data_found = true;
				} else {
					$scope.ppc_panel_no_data = true;
				}
			}, function errorCallback(response) {

			});
		};

		$scope.ppc_panel_back_function = function ($event) {
			var a = $($event.target).closest('.panel').parent().next().find('.panel');
			$rootScope.service.hide_loading_panel(null, a);
			$(a).find('table.ppc_back_table').bootstrapTable('resetView');
		};

		$scope.ppc_panel_front_function = function ($event) {
			var a = $($event.target).closest('.panel').parent().next().find('.panel');
			$rootScope.service.hide_loading_panel(null, a);
		};
    /** END PPC PANEL
     **************************************************************** **/


    /** START PURCHASE PANEL
     **************************************************************** **/
		$scope.purchase_panel_chart_function = function () {
        $scope.purchase_panel_chart_type = 'line';
        $rootScope.xxx = $scope.purchase_panel_chart_dataSource = {
            chart: {
                "showLabels"   : '0',
                "xAxisName"    : "PURCHASE",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "yAxisName"    : "Value",
                "numberPrefix" : "Rs.",
                "theme"        : "ocean",
                "showToolTip"  : "1",
                "enableSlicing": "0",
                "plottooltext" : "<div>$label</div><div>$value</div>"
            },
            data : []
        };

        $scope.events_purchase = {
            "dataPlotClick": function (eventObj, dataObj) {
                if ($scope.purchase_panel_chart_type === 'pie2d') {
                    var obj = $.grep($scope.purchase_panel_chart_dataSource.data, function (v) {
                        var spl_val = dataObj.displayValue.split(',')
                        return v.label === spl_val[ 0 ];
                    });
                    var data = {
						purchase_panel_main_level: $scope.received_data_purchase_panel_main_level,
						arg                 : obj[ 0 ]
					};
                    passData.sendData(data);
                } else {
                    var obj = $.grep($scope.purchase_panel_chart_dataSource.data, function (v) {
                        return v.label === dataObj.categoryLabel;
                    });
                     var data = {
						purchase_panel_main_level: $scope.received_data_purchase_panel_main_level,
						arg                 : obj[ 0 ]
					};
                    passData.sendData(data);
                }
//                Cookies.set('crm', obj[0]);
                $rootScope.$state.go('app.purchase');
            }
        };

        purchase_panel_chart_elem = $('#purchase_panel_chart_controllers li');
        for (i = 0; i < purchase_panel_chart_elem.length; i++) {
            radElem = purchase_panel_chart_elem[ i ];
            var t = $(radElem).hasClass('purchase_chart_type')
            if (t === true) {
                radElem.onclick = function () {
						val = this.getAttribute('data-chart-type');
						if (val) {
							$scope.purchase_panel_chart_type = val;
							$scope.$apply();
						}
						$.each(purchase_panel_chart_elem, function (key, value) {
							if ($(value).hasClass('active')) {
								$(this).removeClass('active');
							}
						});
						$(this).addClass('active');
					};
				}
			}
		};

		$scope.purchase_back_table_function = function () {
			$purchase_back_table_elem = $('.purchase_back_table').bootstrapTable({
				height     : 280,
				search     : false,
				showColumns: false,
				columns           : [ 
					{
						checkbox: false,
						sortable: false
					},{
						visible   : true,
						switchable: false,
						align:'right'
					}]
			});
		};

		$('.purchase_back_table').on('click-row.bs.table', function (e, arg1, arg2) {
			var data = {
				purchase_panel_main_level: $scope.received_data_purchase_panel_main_level,
				arg                 : arg1
			};
			passData.sendData(data);
			$rootScope.$state.go('app.purchase');
		});

		$scope.purchase_panel_main_level_http_function = function () {
			$rootScope.service.http_get($rootScope.setting.constant.ajaxurl + 'purchase_panel_main_level').then(function successCallback(response) {
				if (response.data.status) {
					$scope.received_data_purchase_panel_main_level = $rootScope.service.put_data(response.data.key)
					$purchase_back_table_elem.bootstrapTable('load', $scope.received_data_purchase_panel_main_level);
					$scope.purchase_panel_chart_dataSource.data = $scope.received_data_purchase_panel_main_level;
					$scope.purchase_panel_data_found = true;
				} else {
					$scope.purchase_panel_no_data = true;
				}
			}, function errorCallback(response) {

			});
		};
		
		$scope.purchase_panel_back_function = function ($event) {
			var a = $($event.target).closest('.panel').parent().next().find('.panel');
			$rootScope.service.hide_loading_panel(null, a);
			$(a).find('table.purchase_back_table').bootstrapTable('resetView');
		};

		$scope.purchase_panel_front_function = function ($event) {
			var a = $($event.target).closest('.panel').parent().next().find('.panel');
			$rootScope.service.hide_loading_panel(null, a);
		};
    /** END PURCHASE PANEL
     **************************************************************** **/


    /** START WAREHOUSE PANEL
     **************************************************************** **/     
    
    $scope.warehouse_panel_chart_function = function () {
        $scope.warehouse_panel_chart_type = 'line';
        $rootScope.xxx = $scope.warehouse_panel_chart_dataSource = {
            chart: {
                "showLabels"   : '0',
                "xAxisName"    : "WAREHOUSE",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "yAxisName"    : "Value",
                "numberPrefix" : "Rs.",
                "theme"        : "ocean",
                "showToolTip"  : "1",
                "enableSlicing": "0",
                "plottooltext" : "<div>$label</div><div>$value</div>"
            },
            data : []
        };

	$scope.events_warehouse = {
		"dataPlotClick": function (eventObj, dataObj) {
			if ($scope.warehouse_panel_chart_type === 'pie2d') {
				var obj = $.grep($scope.warehouse_panel_chart_dataSource.data, function (v) {
					var spl_val = dataObj.displayValue.split(',')
					return v.label === spl_val[ 0 ];
				});
				var data = {
					warehouse_panel_main_level: $scope.received_data_warehouse_panel_main_level,
					arg                 : obj[ 0 ]
				};
				passData.sendData(data);
			} else {
				var obj = $.grep($scope.warehouse_panel_chart_dataSource.data, function (v) {
					return v.label === dataObj.categoryLabel;
				});
				 var data = {
					warehouse_panel_main_level: $scope.received_data_warehouse_panel_main_level,
					arg                 : obj[ 0 ]
				};
				passData.sendData(data);
			}
//                Cookies.set('crm', obj[0]);
			$rootScope.$state.go('app.warehouse');
		}
	};

	warehouse_panel_chart_elem = $('#warehouse_panel_chart_controllers li');
	for (i = 0; i < warehouse_panel_chart_elem.length; i++) {
		radElem = warehouse_panel_chart_elem[ i ];
		var t = $(radElem).hasClass('warehouse_chart_type')
		if (t === true) {
			radElem.onclick = function () {
					val = this.getAttribute('data-chart-type');
					if (val) {
						$scope.warehouse_panel_chart_type = val;
						$scope.$apply();
					}
					$.each(warehouse_panel_chart_elem, function (key, value) {
						if ($(value).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
					$(this).addClass('active');
				};
			}
		}
	};

	$scope.warehouse_back_table_function = function () {
		$warehouse_back_table_elem = $('.warehouse_back_table').bootstrapTable({
			height     : 280,
			search     : false,
			showColumns: false,
			columns           : [ 
				{
					checkbox: false,
					sortable: false
				},{
					visible   : true,
					switchable: false,
					align:'right'
				}]
		});
	};

	$('.warehouse_back_table').on('click-row.bs.table', function (e, arg1, arg2) {
		var data = {
			warehouse_panel_main_level: $scope.received_data_warehouse_panel_main_level,
			arg                 : arg1
		};
		passData.sendData(data);
		$rootScope.$state.go('app.warehouse');
	});

	$scope.warehouse_panel_main_level_http_function = function () {
		$rootScope.service.http_get($rootScope.setting.constant.ajaxurl + 'warehouse_panel_main_level').then(function successCallback(response) {
			if (response.data.status) {
				$scope.received_data_warehouse_panel_main_level = $rootScope.service.put_data(response.data.key)
				$warehouse_back_table_elem.bootstrapTable('load', $scope.received_data_warehouse_panel_main_level);
				$scope.warehouse_panel_chart_dataSource.data = $scope.received_data_warehouse_panel_main_level;
				$scope.warehouse_panel_data_found = true;
			} else {
				$scope.warehouse_panel_no_data = true;
			}
		}, function errorCallback(response) {

		});
	};
		 
    $scope.warehouse_panel_back_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
        $(a).find('table.warehouse_back_table').bootstrapTable('resetView');
    };

    $scope.warehouse_panel_front_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
    };
    /** END WAREHOUSE PANEL
     **************************************************************** **/

    /** START HR PANEL
     **************************************************************** **/
    
    $scope.hr_panel_chart_function = function () {
        $scope.hr_panel_chart_type = 'line';
        $rootScope.xxx = $scope.hr_panel_chart_dataSource = {
            chart: {
                "showLabels"   : '0',
                "xAxisName"    : "HR",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "yAxisName"    : "Value",
                "numberPrefix" : "Rs.",
                "theme"        : "ocean",
                "showToolTip"  : "1",
                "enableSlicing": "0",
                "plottooltext" : "<div>$label</div><div>$value</div>"
            },
            data : []
        };

	$scope.events_hr = {
		"dataPlotClick": function (eventObj, dataObj) {
			if ($scope.hr_panel_chart_type === 'pie2d') {
				var obj = $.grep($scope.hr_panel_chart_dataSource.data, function (v) {
					var spl_val = dataObj.displayValue.split(',')
					return v.label === spl_val[ 0 ];
				});
				var data = {
					hr_panel_main_level: $scope.received_data_hr_panel_main_level,
					arg                 : obj[ 0 ]
				};
				passData.sendData(data);
			} else {
				var obj = $.grep($scope.hr_panel_chart_dataSource.data, function (v) {
					return v.label === dataObj.categoryLabel;
				});
				 var data = {
					hr_panel_main_level: $scope.received_data_hr_panel_main_level,
					arg                 : obj[ 0 ]
				};
				passData.sendData(data);
			}
//                Cookies.set('crm', obj[0]);
			$rootScope.$state.go('app.hr');
		}
	};

	hr_panel_chart_elem = $('#hr_panel_chart_controllers li');
	for (i = 0; i < hr_panel_chart_elem.length; i++) {
		radElem = hr_panel_chart_elem[ i ];
		var t = $(radElem).hasClass('hr_chart_type')
		if (t === true) {
			radElem.onclick = function () {
					val = this.getAttribute('data-chart-type');
					if (val) {
						$scope.hr_panel_chart_type = val;
						$scope.$apply();
					}
					$.each(hr_panel_chart_elem, function (key, value) {
						if ($(value).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
					$(this).addClass('active');
				};
			}
		}
	};

	$scope.hr_back_table_function = function () {
		$hr_back_table_elem = $('.hr_back_table').bootstrapTable({
			height     : 280,
			search     : false,
			showColumns: false,
			columns           : [ 
				{
					checkbox: false,
					sortable: false
				},{
					visible   : true,
					switchable: false,
					align:'right'
				}]
		});
	};

	$('.hr_back_table').on('click-row.bs.table', function (e, arg1, arg2) {
		var data = {
			hr_panel_main_level: $scope.received_data_hr_panel_main_level,
			arg                 : arg1
		};
		passData.sendData(data);
		$rootScope.$state.go('app.hr');
	});

	$scope.hr_panel_main_level_http_function = function () {
		$rootScope.service.http_get($rootScope.setting.constant.ajaxurl + 'hr_panel_main_level').then(function successCallback(response) {
			if (response.data.status) {
				$scope.received_data_hr_panel_main_level = $rootScope.service.put_data(response.data.key)
				$hr_back_table_elem.bootstrapTable('load', $scope.received_data_hr_panel_main_level);
				$scope.hr_panel_chart_dataSource.data = $scope.received_data_hr_panel_main_level;
				$scope.hr_panel_data_found = true;
			} else {
				$scope.hr_panel_no_data = true;
			}
		}, function errorCallback(response) {

		});
	};
	
    $scope.hr_panel_back_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
        $(a).find('table.hr_back_table').bootstrapTable('resetView');
    };

    $scope.hr_panel_front_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
    };
    /** END HR PANEL
     **************************************************************** **/


    /** START ACCOUNTS PANEL
     **************************************************************** **/
    
    $scope.accounts_panel_chart_function = function () {
        $scope.accounts_panel_chart_type = 'line';
        $rootScope.xxx = $scope.accounts_panel_chart_dataSource = {
            chart: {
                "showLabels"   : '0',
                "xAxisName"    : "ACCOUNTS",
                "paletteColors": "#0075c2,#1aaf5d,#f2c500,#f45b00,#8e0000",
                "yAxisName"    : "Value",
                "numberPrefix" : "Rs.",
                "theme"        : "ocean",
                "showToolTip"  : "1",
                "enableSlicing": "0",
                "plottooltext" : "<div>$label</div><div>$value</div>"
            },
            data : []
        };

	$scope.events_accounts = {
		"dataPlotClick": function (eventObj, dataObj) {
			if ($scope.accounts_panel_chart_type === 'pie2d') {
				var obj = $.grep($scope.accounts_panel_chart_dataSource.data, function (v) {
					var spl_val = dataObj.displayValue.split(',')
					return v.label === spl_val[ 0 ];
				});
				var data = {
					accounts_panel_main_level: $scope.received_data_accounts_panel_main_level,
					arg                 : obj[ 0 ]
				};
				passData.sendData(data);
			} else {
				var obj = $.grep($scope.accounts_panel_chart_dataSource.data, function (v) {
					return v.label === dataObj.categoryLabel;
				});
				 var data = {
					accounts_panel_main_level: $scope.received_data_accounts_panel_main_level,
					arg                 : obj[ 0 ]
				};
				passData.sendData(data);
			}
//                Cookies.set('crm', obj[0]);
			$rootScope.$state.go('app.accounts');
		}
	};

	accounts_panel_chart_elem = $('#accounts_panel_chart_controllers li');
	for (i = 0; i < accounts_panel_chart_elem.length; i++) {
		radElem = accounts_panel_chart_elem[ i ];
		var t = $(radElem).hasClass('accounts_chart_type')
		if (t === true) {
			radElem.onclick = function () {
					val = this.getAttribute('data-chart-type');
					if (val) {
						$scope.accounts_panel_chart_type = val;
						$scope.$apply();
					}
					$.each(accounts_panel_chart_elem, function (key, value) {
						if ($(value).hasClass('active')) {
							$(this).removeClass('active');
						}
					});
					$(this).addClass('active');
				};
			}
		}
	};

	$scope.accounts_back_table_function = function () {
		$accounts_back_table_elem = $('.accounts_back_table').bootstrapTable({
			height     : 280,
			search     : false,
			showColumns: false,
			columns           : [ 
				{
					checkbox: false,
					sortable: false
				},{
					visible   : true,
					switchable: false,
					align:'right'
				}]
		});
	};

	$('.accounts_back_table').on('click-row.bs.table', function (e, arg1, arg2) {
		var data = {
			accounts_panel_main_level: $scope.received_data_accounts_panel_main_level,
			arg                 : arg1
		};
		passData.sendData(data);
		$rootScope.$state.go('app.accounts');
	});

	$scope.accounts_panel_main_level_http_function = function () {
		$rootScope.service.http_get($rootScope.setting.constant.ajaxurl + 'accounts_panel_main_level').then(function successCallback(response) {
			if (response.data.status) {
				$scope.received_data_accounts_panel_main_level = $rootScope.service.put_data(response.data.key)
				$accounts_back_table_elem.bootstrapTable('load', $scope.received_data_accounts_panel_main_level);
				$scope.accounts_panel_chart_dataSource.data = $scope.received_data_accounts_panel_main_level;
				$scope.accounts_panel_data_found = true;
			} else {
				$scope.accounts_panel_no_data = true;
			}
		}, function errorCallback(response) {

		});
	};
	 
    $scope.accounts_panel_back_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
        $(a).find('table.accounts_back_table').bootstrapTable('resetView');
    };

    $scope.accounts_panel_front_function = function ($event) {
        var a = $($event.target).closest('.panel').parent().next().find('.panel');
        $rootScope.service.hide_loading_panel(null, a);
    };
    /** END WAREHOUSE PANEL
     **************************************************************** **/


    /** START DOCUMENT READY
     **************************************************************** **/
    angular.element(document).ready(function () {
        $rootScope.$timeout(function () {
//            $rootScope.service.loading_panel_first();
        }, 100);

        $scope.violation_panel_data_found = true;
        $scope.crm_panel_data_found = true;
        $scope.ppc_panel_data_found = true;
        $scope.purchase_panel_data_found = true;
        $scope.warehouse_panel_data_found = true;
        $scope.accounts_panel_data_found = true;
        $scope.hr_panel_data_found = true;

        $scope.crm_panel_chart_function();
        $scope.crm_back_table_function();
        $scope.crm_panel_main_level_http_function();
        $scope.ppc_panel_chart_function();
        $scope.ppc_back_table_function();
        $scope.ppc_panel_main_level_http_function();
        $scope.purchase_panel_chart_function();
        $scope.purchase_back_table_function();
        $scope.purchase_panel_main_level_http_function();
        $scope.warehouse_panel_chart_function();
        $scope.warehouse_back_table_function();
        $scope.warehouse_panel_main_level_http_function();
        $scope.accounts_panel_chart_function();
        $scope.accounts_back_table_function();
        $scope.accounts_panel_main_level_http_function();
        $scope.hr_panel_chart_function();
        $scope.hr_back_table_function();
        $scope.hr_panel_main_level_http_function();
        
    });
    /** END DOCUMENT READY
     **************************************************************** **/

    /** START STATE CHANGE START
     **************************************************************** **/
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
//        $scope.crm_panel_chart_dataSource.chart.showToolTip = '0';
    });
    /** END STATE CHANGE START
     **************************************************************** **/
});
