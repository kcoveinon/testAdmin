<?php
/**
 * Description of CompanyUser
 *
 * @author dcarungay
 */

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;

class CompanyUser extends Eloquent implements UserInterface, RemindableInterface {

    use UserTrait, RemindableTrait;

    protected $table = "company_user";
    protected $primaryKey = 'company_userID';
    protected $fillable = array('name', 'email', 'password', 'companyID');
    /*protected $hidden = array('password');*/

    public static function getUsersByCompanyID($companyID = null) {
        $users = self::where('companyID', '=', $companyID)->where('isDeleted', '=', 0)->get();
        
        return $users;
    }
    
    public static function getUserGridByCompanyID($grid_variables = array(), $companyID = null){
        $qBuilder = self::select($grid_variables['columns'])->where('companyID', '=', $companyID)->where('isDeleted', '=', 0);
        $arr = JGrid::process($grid_variables, $qBuilder);
        
        return $arr;
    }

    public static function getCompanyUserName($companyUserId) {
        $userName = '';

        $companyUser = self::where('company_userID', '=', $companyUserId)
            ->where('isDeleted', '=', false)
            ->select('name')
            ->first();

        if(count($companyUser) > 0) {
            $companyUser = $companyUser->toArray();
            $userName = $companyUser['name'];
        }

        return $userName;
    }

    public static function getEmail($companyUserId) {
        $email = '';

        $companyUser = self::where('company_userID', '=', $companyUserId)
            ->where('isDeleted', '=', false)
            ->select('email')
            ->first();

        if(count($companyUser) > 0) {
            $companyUser = $companyUser->toArray();
            $email = $companyUser['email'];
        }

        return $email;
    }

    public static function updatePassword($forgotPasswordCode = '', $companyUserId = '', $password = '') {
        $password = Hash::make($password);
        $res = '';
        $isSuccess = false;

        $res = DB::transaction(function() use($companyUserId, $password, $forgotPasswordCode) {
            $hasUpdated = CompanyUserForgotPassword::where('forgotPasswordCode', '=', $forgotPasswordCode)
                ->where('isChanged', '=', false)
                ->update(array('isChanged' => true));

            if($hasUpdated) {
                self::where('company_userID', '=', $companyUserId)
                    ->update(array(
                        'password' => $password
                    ));
            }
            return 'success';
        });

        if($res == 'success') {
            $isSuccess = true;
            $companyUserName = self::getCompanyUserName($companyUserId);
            $companyUserEmail = self::getEmail($companyUserId);

            VroomMailServices::sendNotificationEmail('emails.forgot_password_successful', 'notification', array(
                'subject' => 'Forgot Password',
                'email' => $companyUserEmail,
                'name' => $companyUserName,
                'vroomAdminLink' => url('/')
            ));
        }

        return $isSuccess;
    }
    
    public static function getUserInformationBySiteID($siteID = null){
        $result = self::where('company_userID', '=', $siteID)->first();
        return $result;
    }

    public static function validateUser($input) {
        $rules = array(
            'name' => 'Required|Min:2|Max:100|alpha_dash',
            'email' => 'Required|email',
            'password' => 'Required|Min:3|Max:100|alpha_num|Confirmed',
            'password_confirmation' => 'Required|Min:3|Max:100|alpha_num',
            'companyID' => 'Required'
        );

        $validator = Validator::make($input, $rules);

        return $validator;
    }
    
    public static function validateUserUpdate($input) {
        $rules = array(
            'name' => 'Required|Min:2|Max:100|alpha_dash',
            'email' => 'Required|email',
        );

        $validator = Validator::make($input, $rules);

        return $validator;
    }
    
    public static function getCompanyIDByUserID($userID = null) {
        $userData = self::select('companyID')->where('company_userID', '=', $userID)->first();
//        Users::printa($userData);exit;
        return $userData->companyID;
    }
    
    public static function getUserRoleByUserID($userID) {
        $rsResult = DB::table('company_user')->select('role')->where('company_userID', '=', $userID)->first();
        return $rsResult->role;
    }

    public static function checkUserLoginTypeCount($email = '') {
        $loginTypeCount = self::where('isDeleted', '=', false)
            ->where('email', '=', $email)
            ->count();

        return $loginTypeCount;
    }

    public static function checkIfUserExists($email = '', $loginTypeId = '') {
        $companyUserId = '';

        $companyUser = self::select('company_userID')
                ->where('isDeleted', '=', 0)
                ->where('email', '=', $email);
                
        if(!empty($loginTypeId)) {
            $companyUser->where('loginTypeID', '=', $loginTypeId);
        }

        $companyUser = $companyUser->first();
        
        if(!empty($companyUser)){
            $companyUser = $companyUser->toArray();
            $companyUserId = $companyUser['company_userID'];
        }
        

        return $companyUserId;
    }

//    public static function validateSite($input) {
//        $rules = array(
//            'siteName' => 'Required',
//            'siteGUID' => 'Required',
//        );
//
//        $validator = Validator::make($input, $rules);
//
//        return $validator;
//    }

//    public static function crypto_rand_secure($min, $max) {
//        $range = $max - $min;
//        if ($range < 0)
//            return $min; // not so random...
//        $log = log($range, 2);
//        $bytes = (int) ($log / 8) + 1; // length in bytes
//        $bits = (int) $log + 1; // length in bits
//        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
//        do {
//            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
//            $rnd = $rnd & $filter; // discard irrelevant bits
//        } while ($rnd >= $range);
//        return $min + $rnd;
//    }

//    public static function getToken($length) {
//        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//        $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
//        $codeAlphabet.= "0123456789";
//        $token="";
//        for ($i = 0; $i < $length; $i++) {
//            $token .= $codeAlphabet[Users::crypto_rand_secure(0, strlen($codeAlphabet))];
//        }
//        return $token;
//    }
    
//    public function createSiteDirectories($siteGUID = null){
//        $folderPath = public_path()."/assets/css/";
//        $directoryStructure = $siteGUID."/image/";
//        return $folderPath.$directoryStructure;
////        mkdir($folderPath.$directoryStructure, 0777, true);
////        if(!mkdir($folderPath.$directoryStructure, 0777, true)){
////            return "Failed: ".$folderPath.$directoryStructure;
////        }else{
////            return "Success";
////        }
//    }

//    public static function generateGUID($prefix = null) {
////        $prefix = "VROOM-AUS-";
//        $prefixLength = strlen($prefix);
//        $length = 30;
//        $lengthToFill = $length-$prefixLength;
//        $uniqueGUID = Users::getToken($lengthToFill);
//        
//        return $prefix.$uniqueGUID;
//    }

    public static function saveSiteUserData($data = null) {
        self::create($data);
    }
    
    public static function updateSiteUserData($data = null) {
        if(isset($data['password'])){
            $hashedPassword = Hash::make($data['password']);
            self::where('company_userID', $data['userID'])->update(array('name' => $data['name'], 'email' => $data['email'], 'password' => $hashedPassword));
        }else{
            self::where('company_userID', $data['userID'])->update(array('name' => $data['name'], 'email' => $data['email']));
        }
    }

//    public static function saveSiteInfoData($data = null) {
//        $id = DB::table('company_site')->insertGetId(array('siteName' => $data['siteName'], 'comment' => $data['comment'], 'siteGUID' => $data['siteGUID']));
//        return $id;
//    }
    
//    public static function updateSiteInfoData($siteID = null, $data = null) {
//        DB::table('company_site')->where('company_siteID', $siteID)->update(array('siteName' => $data['siteName'], 'comment' => $data['comment']));
//    }
    
    public static function getGUIDBySiteID($siteID = null) {
        $guid = DB::table('company_site')->select('siteGUID')->where('ID', '=', $siteID)->first();
        
        return $guid->siteGUID;
    }
}
