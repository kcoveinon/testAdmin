<?php
/**
 * All global access validation function checks should be here.
 *
 * @author dcarungay
 */
class AccessValidator {

    public static function checkIfSessionTimedOut(){
        if(Auth::check() && Session::has('last_activity')){
            $last_activity = Session::get('last_activity');
            $difference = time()-$last_activity;
            //If the time difference is greater than the session lifetime in minutes (that's why it's multiplied by 60)
            if($difference >= (Config::get('session.lifetime')*60)) {
//            if($difference >= 30) {
                Session::flush();
                Auth::logout();
                $pathToLogout = URL::to('users/logout');
                return Response::json(array('status' => 'timeout', 'logoutURL' => $pathToLogout));
            }else{
                Session::put('last_activity', time());
            }
        }
    }
    
    public static function validateIfUserHasAccessToSite($siteID = null){
        $userID = Auth::user()->company_userID;

        $companyIDFromSite = Site::getCompanyIDUsingSiteID($siteID);
        $companyIDFromUser = CompanyUser::getCompanyIDByUserID($userID);
        if ($companyIDFromSite == $companyIDFromUser) {
            return true;
        }elseif(Auth::user()->role == 1){
            //User is administrator
            return true;
        }else{
            return false;
        }
    }
    
    public static function checkIfUserIsAdministrator($userID){
        if(empty($userID)){
            return false;
        }else{
            
            $userRole = CompanyUser::getUserRoleByUserID($userID);
            if($userRole == 1){
                return true;
            }else{
                return false;
            }
        }
    }
    
}
