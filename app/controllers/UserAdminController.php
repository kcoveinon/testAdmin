<?php

class UserAdminController extends BaseAdminController {

    protected $layout = 'layouts.full';
    
    /**
     * Function to show the user list by passing the companyID.  The response is loaded via AJAX.
     * If the user is not logged in, it will return a 403 Unauthorized Action error.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $id
     * @return html|error
     */
    public function getIndex($id) {
        if (Auth::check()) {
            $companyData = Company::getCompanyNameByCompanyID($id);
            return View::make('pages.company_user')->with('data', array('users' => CompanyUser::getUsersByCompanyID($id), 'companyID' => $id))->with('companyName', $companyData['companyName']);
        } else {
            return App::abort(403, 'Unauthorized action.');
        }
    }
    
    /**
     * Function to show the user registration form page.  The response is loaded via AJAX.
     * The companyID that was passed here was to get the company name for the view's use.
     * If the user is not logged in, it will return a 403 Unauthorized Action error.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $id
     * @return type
     */
    public function getUserRegister($companyID = null, $siteID = null) {
        if (Auth::check() && !empty($companyID)) {
            if(!empty($siteID)){
                $data = CompanyUser::getUserInformationBySiteID($siteID);
                return View::make('pages.user.user_form')->with('data', $data)->with('companyID', $companyID);
            }else{
                return View::make('pages.user.user_form')->with('companyID', $companyID);
            }
        } else {
            return App::abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Function to handle the form submit of the user registration form page.  The response is loaded via AJAX.
     * Validates and inserts the user information in the database.  The user will be redirected back to the user list
     * page upon successful insert or will be redirected back to the form should there be any validation errors.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function postUserRegistration() {
        $userRegistrationData = array(
            'companyID' => Input::get('frmCompanyID'),
            'name' => strtolower(Input::get('frmUsername')),
            'email' => Input::get('frmEmail'),
            'password' => Input::get('frmPassword'),
            'password_confirmation' => Input::get('frmConfirmPassword'),
        );
        
        try {
            $isValidUser = CompanyUser::validateUser($userRegistrationData);
            if ($isValidUser->passes()) {
                $finalUserRegistrationData = array(
                    'name' => $userRegistrationData['name'],
                    'email' => $userRegistrationData['email'],
                    'password' => Hash::make($userRegistrationData['password']),
                    'companyID' => $userRegistrationData['companyID']
                );
                $users = CompanyUser::saveSiteUserData($finalUserRegistrationData);
                return Response::json(array(
                    'status' => 'success',
                    'data' => $users,
                    'message' => 'New user record saved.'
                ));
            } else {
                return Response::json(array(
                    'status' => 'failed',
                    'data' => $isValidUser->messages(),
                    'message' => 'Saving user record failed.'
                ));
            }
        } catch (Exception $ex) {
            return Response::json(array(
                'status' => 'error',
                'data' => $ex,
                'message' => 'There was an error trying to save user information.'
            ));
        }
        
        
    }
    
    /**
     * Function to handle the form submit of the user registration form page.  The response is loaded via AJAX.
     * Validates and inserts the user information in the database.  The user will be redirected back to the user list
     * page upon successful insert or will be redirected back to the form should there be any validation errors.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function postEditUserRegistration() {
        $userRegistrationData = array(
            'companyID' => Input::get('frmCompanyID'),
            'userID' => Input::get('frmUserID'),
            'name' => strtolower(Input::get('frmUsername')),
            'email' => Input::get('frmEmail'),
            'password' => Input::get('frmPassword'),
            'password_confirmation' => Input::get('frmConfirmPassword'),
        );
        
        try {
            $isValidUser = CompanyUser::validateUserUpdate($userRegistrationData);
            if ($isValidUser->passes()) {
                $finalUserRegistrationData = array(
                    'name' => $userRegistrationData['name'],
                    'email' => $userRegistrationData['email'],
                    'password' => Hash::make($userRegistrationData['password']),
                    'userID' => $userRegistrationData['userID'],
                    'companyID' => $userRegistrationData['companyID']
                );
                $users = CompanyUser::updateSiteUserData($finalUserRegistrationData);
                return Response::json(array(
                    'status' => 'success',
                    'data' => $users,
                    'message' => 'User record saved.'
                ));
            } else {
                return Response::json(array(
                    'status' => 'failed',
                    'data' => $isValidUser->messages(),
                    'message' => 'Updating user record failed.'
                ));
            }
        } catch (Exception $ex) {
            return Response::json(array(
                'status' => 'error',
                'data' => $ex,
                'message' => 'There was an error trying to update user information.'
            ));
        }
        
        
    }

    /**
     * A catch-all method may be defined which will be called when no other matching method is found on a given controller.
     * Taken from http://laravel.com/docs/controllers#handling-missing-methods
     * 
     * @param mixed $parameters
     */
    public function missingMethod($parameters = array()) {
        
    }

}
