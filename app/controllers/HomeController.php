<?php

class HomeController extends BaseAdminController {

    protected $layout = 'layouts.full';
    
    /**
     * Function to return a blank page upon logging in successfully.  If not, then the user
     * will be returned back to the login page.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html|null
     */
    public function getIndex() { 

        $loginViaMessage = Session::get('loginViaMessage', '');
        Session::forget('loginViaMessage');

        if (Auth::check()) {
            $userMenus = Config::get('global/user_menus')[Session::get('userData.theme')];
            //return $userMenus;
            View::share('userMenus', $userMenus);

            $this->layout->content = View::make('pages.blank');
        } else {
			//var_dump(Session::all());
			//return Redirect::to('/users/login-form');
            $this->layout = View::make('layouts.login');
            $this->layout->loginContent = View::make('pages.user_login', array(
                'loginViaMessage' => $loginViaMessage
            ));
        } 
    }

    /**
     * Function to show the dashboard page.  The response is loaded via AJAX, and when the user is
     * not logged in, the user will redirected back to the login page.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html|null
     */
    public function getDashboard() {        
        if (Auth::check()) {
            return View::make('pages.dashboard.dashboard');
        } else {
            return Redirect::to('/users/login-form');
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
