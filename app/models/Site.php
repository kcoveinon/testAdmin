<?php
/**
 * Description of Site
 *
 * @author dcarungay
 */
class Site extends \Eloquent {

    protected $table = "company_site";

    /**
     * Function to get site by giving the companyID.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param type $companyID
     * @return type
     */
    public static function getSitesByCompanyID($companyID = null) {
        $sites = Site::where('companyID', '=', $companyID)->where('isDeleted', '=', 0)->get();
        
        return $sites;
    }
    
    public static function getSiteInformationBySiteID($siteID = null){
        $siteInfo = self::where('company_siteID', '=', $siteID)->where('isDeleted', '=', 0)->first();
        return $siteInfo;
    }
    
    /**
     * Function to validate the site information before saving/updating the
     * record in the database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $input
     * @return object
     */
    public static function validateSite($input) {
        $rules = array(
            'siteName' => 'Required',
            'alias' => 'Required',
            'companyID' => 'Required|numeric',
        );

        $validator = Validator::make($input, $rules);

        return $validator;
    }
    
    /**
     * Function to validate the site information before updating the
     * record in the database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $input
     * @return object
     */
    public static function validateSiteForUpdate($input) {
        $rules = array(
            'siteID' => 'Required|numeric',
            'siteName' => 'Required|min:2|max:50',
//            'companyID' => 'Required|numeric',
        );

        $validator = Validator::make($input, $rules);

        return $validator;
    }
    
    /**
     * Function to save site information to the database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $data
     * @return int
     */
    public static function saveSiteInfo($data = null) {
        $id = Site::insertGetId(array(
            'companyID' => $data['companyID'],
            'siteName' => $data['siteName'], 
            'comment' => $data['comment'], 
            'siteGUID' => $data['siteGUID'], 
            'alias' => $data['alias'],
            'created_at' => date('Y-m-d H:i:s')
        ));
        return $id;
    }
    
    /**
     * Function to update site information in the database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $data
     * @return int
     */
    public static function updateSiteInfo($data = null) {
        $site = Site::where('company_siteID', '=', $data['siteID'])->where('isDeleted', '=', 0)->update(array(
            'siteName' => $data['siteName'], 
            'comment' => $data['comment'],
            'updated_at' => date('Y-m-d H:i:s')
        ));
        return $site;
    }
    
    /**
     * Function to generate the token that will be used to generate the siteGUID.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $min
     * @param int $max
     * @return type
     */
    public static function crypto_rand_secure($min, $max) {
        $range = $max - $min;
        if ($range < 0)
            return $min; // not so random...
        $log = log($range, 2);
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd >= $range);
        return $min + $rnd;
    }
    
//    public static function getToken($length) {
//        $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//        $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
//        $codeAlphabet.= "0123456789";
//        $token="";
//        for ($i = 0; $i < $length; $i++) {
//            $token .= $codeAlphabet[Site::crypto_rand_secure(0, strlen($codeAlphabet))];
//        }
//        return $token;
//    }
    
    public static function generateGUID($companyAlias = null, $prefix = null) {
        $prefixString = $companyAlias.'-'.$prefix.'-';
        $prefixLength = strlen($prefixString);
        $length = 40;
        $lengthToFill = $length-$prefixLength;
//        $uniqueGUID = Site::getToken($lengthToFill);
        $uniqueGUID = str_random($lengthToFill);
        
        return $prefixString.$uniqueGUID;
    }
    
    public function createSiteDirectories($siteGUID = null){
        $folderPath = public_path()."/assets/css/PartnerThemes/";
        $directoryStructure = $siteGUID."/image/";
        return $folderPath.$directoryStructure;
    }
    
    public static function validateIfUserHasAccessToSite($siteID = null){
        $userID = Auth::user()->company_userID;

        $companyIDFromSite = Site::getCompanyIDUsingSiteID($siteID);
        $companyIDFromUser = Users::getCompanyIDByUserID($userID);
//        if ($companyIDFromSite == $companyIDFromUser || Auth::user()->role == 1) {
        if ($companyIDFromSite == $companyIDFromUser) {
            return true;
        }else{
            return false;
        }
    }

    public static function getSiteGUIDBySiteID($siteID = null) {
        $siteDetail = Site::select('siteGUID')->where('isDeleted', '=', 0)->where('company_siteID', '=', $siteID)->first();
        
        return $siteDetail['siteGUID'];
    }
    
    public static function getCompanyIDUsingSiteID($siteID = null) {
        $siteInfo = Site::select('companyID')->where('isDeleted', '=', 0)->where('company_siteID', '=', $siteID)->first();
        if(!empty($siteInfo)){
            return $siteInfo->companyID;
        }  else {
            return 0;
        }
    }
    
    public static function getSiteGridByCompanyID($grid_variables = array(), $companyID = null){
        $qBuilder = self::select($grid_variables['columns'])->where('isDeleted', '=', 0)->where('companyID', '=', $companyID);
        $arr = JGrid::process($grid_variables, $qBuilder);
        
        return $arr;
    }

    /*---------------------------------------------------------------------------------------*/

//    public static function getSiteUsers($siteID = null) {
//        $userInfo = DB::table('company_user')->select('company_userID', 'FK_companyID', 'name', 'password')->where('FK_companyID', '=', $siteID)->get();
//
//        return $userInfo;
//    }
//
//    public static function getSiteUserByID($userID = null) {
//        $userInfo = DB::table('company_user')->select('company_userID', 'FK_companyID', 'name', 'password')->where('company_userID', '=', $userID)->first();
//        
//        return $userInfo;
//    }
//
    public static function getSiteInfo() {
        $siteInfo = DB::table('company_site')->where('isDeleted', '=', 0)->where('siteGUID', '<>', '')->get();

        return $siteInfo;
    }
//
    public static function getSiteInfoByID($id = null) {
        $siteInfo = DB::table('company_site')->where('isDeleted', '=', 0)->where('company_siteID', '=', $id)->first();

        return $siteInfo;
    }

}
