<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the Closure to execute when that URI is requested.
|
*/

/**
 * Route to show login and dashboard.
 */
Route::any('/', 'HomeController@getIndex');
Route::any('dashboard', 'HomeController@getDashboard');

/**
 * Route to control login, logout and user validation procedures
 */
Route::controller('users', 'UserLoginController');

/**
 * Route to control 3rd party logins
 */
Route::controller('loginvia', 'LoginViaController');

/**
 * Routes to manage Partners (Companies, Sites and Users) B2B part
 */
Route::controller('user', 'UserAdminController');
Route::controller('site', 'SiteAdminController');
Route::controller('company', 'CompanyAdminController');

/**
 * Routes to manage all location information
 */
Route::controller('location', 'LocationController');
Route::controller('depot', 'DepotController');
Route::controller('country', 'CountryController');
Route::controller('state', 'StateController');

/**
 * Routes for all the pages using the vGRID plugin.
 */
Route::controller('location-grid', 'GridLocationController');
Route::controller('depot-grid', 'GridDepotController');
Route::controller('country-grid', 'GridCountryController');
Route::controller('state-grid', 'GridStateController');
Route::controller('company-grid', 'GridCompanyController');
Route::controller('site-grid', 'GridSiteController');
Route::controller('user-grid', 'GridUserController');

Route::controller('supplier', 'SupplierController');

//Added by Joef: Route for theme builder
Route::controller('/theme-builder', 'ThemeBuilderController');
Route::controller('/vroom-widget', 'VroomWidgetController');

//Added by Joef: Route for image folder
Route::controller('/imageFolder', 'ImageFolderController');

//Added by Joef: Route for manage partners
Route::controller('/manage-partners', 'ManagePartnersController');

//Added by Joef: Route for templates
Route::controller('/views', 'ViewsController');

//Added by Joef: Route for reconciliation
Route::controller('/reconciliation', 'ReconciliationController');

//Added by Jaime: Route for forgot password module
Route::controller('forgot-password', 'ForgotPasswordController');