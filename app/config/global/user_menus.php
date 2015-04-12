<?php

return array(
    'admin' => array(
        array(
        	'menuName' => 'Dashboard',
        	'menuIcon' => '',
        	'menuAction' => 'change-page',
        	'menuActionParameter' => 'dashboard',
        	'subMenu' => array()	
        ),
        array(
        	'menuName' => 'Manage Partners',
        	'menuIcon' => '',
        	'menuAction' => 'change-page',
        	'menuActionParameter' => 'manage-partners',
        	'subMenu' => array()	
        ),
        array(
        	'menuName' => 'Manage Suppliers',
        	'menuIcon' => '',
        	'menuAction' => '',
        	'menuActionParameter' => '',
        	'subMenu' => array()	
        ),
        array(
        	'menuName' => 'Manage Bookings',
        	'menuIcon' => 'map icon',
        	'menuAction' => '',
        	'menuActionParameter' => '',
        	'subMenu' => array(
        		array(
		        	'subMenuName' => 'General',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'booking/index/general'	
		        ),
		        array(
		        	'subMenuName' => 'Future Bookings',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'booking/index/future'
		        ),
		        array(
		        	'subMenuName' => 'Pending Extras',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'booking/index/pending'	
		        )
        	)	
        ),
        array(
        	'menuName' => 'Manage Locations',
        	'menuIcon' => 'map icon',
        	'menuAction' => '',
        	'menuActionParameter' => '',
        	'subMenu' => array(
        		array(
		        	'subMenuName' => 'Location',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'location/index'	
		        ),
		        array(
		        	'subMenuName' => 'Depot',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'depot/index'
		        ),
		        array(
		        	'subMenuName' => 'Country',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'country/index'
		        ),
		        array(
		        	'subMenuName' => 'State',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'state/index'
		        ),
		        array(
		        	'subMenuName' => 'Depot Test Tool',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Depot Lookup Tool',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''	
		        )
        	)	
        ),
        array(
        	'menuName' => 'Reconciliation',
        	'menuIcon' => 'exchange icon',
        	'menuAction' => '',
        	'menuActionParameter' => '',
        	'subMenu' => array(
        		array(
		        	'subMenuName' => 'Import Files',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'reconciliation/import-files'
		        ),
		        array(
		        	'subMenuName' => 'Reconciliation Page',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'views/get/pages.reconciliation.reconciliationPage'
		        ),
		        array(
		        	'subMenuName' => 'Post Reconciliation',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'views/get/pages.reconciliation.postReconciliation'
		        ),
		        array(
		        	'subMenuName' => 'Completed Files',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'views/get/pages.reconciliation.completedFiles'
		        ),
        		array(
		        	'subMenuName' => 'Import Supplier Payment Report',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''	
		        ),
		        array(
		        	'subMenuName' => 'Import Partner Payment Report',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Generate Partner Payment Report',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''	
		        )
        	)	
        ),
        array(
        	'menuName' => 'Reports and Statistics',
        	'menuIcon' => 'docs basic icon',
        	'menuAction' => '',
        	'menuActionParameter' => '',
        	'subMenu' => array(
        		array(
		        	'subMenuName' => 'Search Statistics',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''	
		        ),
		        array(
		        	'subMenuName' => 'Booking Statistics',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'reports-statistics/page'
		        ),
		        array(
		        	'subMenuName' => 'Bookings Today',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'reports-statistics/bookings-today-page'
		        ),
		        array(
		        	'subMenuName' => 'Cancellation Statistics',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Future Bookings Report',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Locations Report',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''	
		        ),
		        array(
		        	'subMenuName' => 'Supplier Graphs',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Monthly Sales',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Previous Year Comparison',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'SMS',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Google Analytics',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Poll Feedbacks',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Customer Feedbacks',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Site Feedbacks',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'SEO Reports',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        ),
		        array(
		        	'subMenuName' => 'Audit Logs',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        )
        	)	
        )
    ),
    
    'partner' => array(
        array(
        	'menuName' => 'Dashboard',
        	'menuIcon' => '',
        	'menuAction' => 'change-page',
        	'menuActionParameter' => 'dashboard',
        	'subMenu' => array()	
        ),
        array(
        	'menuName' => 'Manage Sites',
        	'menuIcon' => '',
        	'menuAction' => 'change-page',
        	'menuActionParameter' => 'site/index/'.Session::get('userData.sessionCompanyID'),
        	'subMenu' => array()	
        ),
        array(
        	'menuName' => 'Reports and Statistics',
        	'menuIcon' => 'docs basic icon',
        	'menuAction' => '',
        	'menuActionParameter' => '',
        	'subMenu' => array(
        		array(
		        	'subMenuName' => 'Booking Statistics',
        			'subMenuAction' => 'change-page',
		        	'subMenuActionParameter' => 'reports-statistics/page'	
		        ),
		        array(
		        	'subMenuName' => 'Audit Logs',
        			'subMenuAction' => '',
		        	'subMenuActionParameter' => ''
		        )
        	)	
        )
    )
    
);