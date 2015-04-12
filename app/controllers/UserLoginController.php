<?php

class UserLoginController extends BaseController {

    protected $layout = 'layouts.login';

    /**
     * Function to show the login form.  Loads the page conventionally instead of AJAX.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     */
    public function getLoginForm() {
        $this->layout->loginContent = View::make('pages.user_login');
    }

    /**
     * Function to handle the login form submit.  Redirects the user to the dashboard if
     * login was successful or back to the login for should there be form validations or if
     * login details was incorrect.  Page loading is done conventionally.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return null
     */
//    public function postLogin() {
//        $loginDetails = array(
//            'name' => Input::get('frmUsername'), 
//            'password' => Input::get('frmPassword')
//        );
//        if (Auth::attempt($loginDetails)) {
//            $loadTheme = 'partner';
//            if(Auth::user()->role == 1){
//                $loadTheme = 'admin';
//            }
//            $session = array(
//                'sessionCompanyID' => Auth::user()->companyID,
//                'originalCompanyID' => Auth::user()->companyID,
//                'theme' => $loadTheme,
//                'userName' => Auth::user()->name
//            );
//            Session::put('userData', $session);
//            return Redirect::intended('/');
//        } else {
////            echo 'not logged in'; die();
////            $this->layout->loginContent = View::make('pages.user_login')->with('message', 'Your username/password combination was incorrect.');
//            return Redirect::back()->withInput()->withErrors(['Your username/password combination was incorrect. Please try again.']);
//        }
//    }
    public function postLogin() {
        $vroomLoginTypeId = LoginType::getVroomLoginTypeId();
        
        $loginDetails = array(
            'name' => Input::get('frmUsername'), 
            'password' => Input::get('frmPassword'),
            'loginTypeID' => $vroomLoginTypeId
        );

        if (Auth::attempt($loginDetails)) {
            $loadTheme = 'partner';
            if(Auth::user()->role == 1){
                $loadTheme = 'admin';
            }
            $session = array(
                'sessionCompanyID' => Auth::user()->companyID,
                'originalCompanyID' => Auth::user()->companyID,
                'theme' => $loadTheme,
                'userName' => Auth::user()->name
            );
            Session::put('userData', $session);
            Session::put('last_activity', time());

//                $this->layout = View::make('layouts.default'); {{{ $errors->first() }}} //on the template
            return Response::json(array(
                'result' => 'success'
            ));
        } else {
            
            return Response::json(array(
                'result' => 'fail',
                'error_message' => 'Your username/password combination was incorrect. Please try again.'
            ));
            //return View::make('pages.user_login')->withErrors(['Your username/password combination was incorrect. Please try again.']);
        }
    }
    
    /**
     * Function to change the user type of the logged user.  This function is only available to administrators
     * and allows the users to log in as a user of a specific partner company.  Since no additional information
     * is defined as of 7/24/201, this only makes use of two basic user types 1=administrators and 0=partners.
     * 
     * Subject to change upon further clarifications regarding user types and permissions.
     * 
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return string
     */
    public function postChangeAdminSession(){
//        $newCompanyID = Input::get('newCompanyID');
//        Session::put('userData.sessionCompanyID', $newCompanyID);
//        $newTheme = 'partner';
//        if($newCompanyID == 1){
//            $newTheme = 'admin';
//        }
//        Session::put('userData.theme', $newTheme);
//        
//        return $newTheme;
        
        $last_activity = Session::get('last_activity');
        $difference = time()-$last_activity;
        //If the time difference is greater than the session lifetime in minutes (that's why it's multiplied by 60)
        if($difference >= (Config::get('session.lifetime')*60)) {
//        if($difference >= 30) {
            Session::flush();
            Auth::logout();
            $pathToLogout = URL::to('users/logout');
            return Response::json(array('status' => 'timeout', 'logoutURL' => $pathToLogout));
        }else{
            Session::put('last_activity', time());
            $newCompanyID = Input::get('newCompanyID');
            Session::put('userData.sessionCompanyID', $newCompanyID);
            $newTheme = 'partner';
            if($newCompanyID == 1){
                $newTheme = 'admin';
            }
            Session::put('userData.theme', $newTheme);

            return $newTheme;
        }
    }

    /**
     * Function to logout the user from the application.  Other tasks performed in this function is to
     * remove all session data then redirects the user back to the login form page.
     * @return null
     */
    public function getLogout() {
        Session::flush();
        Auth::logout();
        return Redirect::to('/');
//        return Redirect::to('/users/login-form');
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
