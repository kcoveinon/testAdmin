<?php
/**
 * Description of Company
 *
 * @author dcarungay
 */
class Company extends Eloquent {
    
    protected $table = "company";
    protected $primaryKey = "companyID";
    protected $fillable = array('companyID','companyName', 'alias');
    
    /**
     * Function to return all companies except the row with the companyID = 1 (administrator).
     * This prevents the users to make any changes to the administrator account.  
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return array
     */
    public static function getAllCompanies() {
        $companies = Company::where('companyID', '<>', '1')->where('isDeleted', '=', 0)->get();
        
        return $companies;
    }
    
    public static function getCompanyDetailByCompanyID($companyID = null) {
        $companies = Company::where('companyID', '=', $companyID)->where('company.isDeleted', '=', 0)->first();
        return $companies;
    }
    
    public static function getAllCompanySitesToGrid($grid_variables=array()){
        $qBuilder = self::leftJoin('company_site', 'company_site.companyID', '=', 'company.companyID')
                ->select($grid_variables['columns'])
                ->where('company.companyID', '<>', 1)
                ->where('company.isDeleted', '=', 0)
                ->whereNull('company.deleted_at');
        $rsResult = JGrid::process($grid_variables, $qBuilder);
        return $rsResult;
    }
    
    /**
     * Function to validate company information before saving/updating the record in the
     * database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $input
     * @return object
     */
    public static function validateCompany($input) {
        $rules = array(
            'companyName' => 'Required|Min:2|Max:100',
            'alias' => 'Required|Min:2|Max:10|alpha_num'
        );

        $validator = Validator::make($input, $rules);

        return $validator;
    }
    
    /**
     * Function to validate company information before updating the record in the
     * database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $input
     * @return object
     */
    public static function validateCompanyForUpdate($input) {
        $rules = array(
            'companyID' => 'Required|numeric',
            'companyName' => 'Required|Min:2|Max:100',
        );
        $validator = Validator::make($input, $rules);
        return $validator;
    }
    
    /**
     * Function to insert company information to the database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $companyInfo
     * @return boolean
     */
    public static function insertCompany($companyInfo = null) {
        $company = Company::create($companyInfo);
        
        return $company;
    }
    
    /**
     * Function to update company information in the database.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param array $companyInfo
     * @return boolean
     */
    public static function updateCompany($companyInfo = null) {
        $company = Company::where('companyID', '=', $companyInfo['companyID'])
                ->where('company.isDeleted', '=', 0)
                ->update(array(
                    'companyName' => $companyInfo['companyName']
                ));
        return $company;
    }
    
    /**
     * Function to get the company's alias by putting the companyID.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $companyID
     * @return array
     */
    public static function getCompanyAliasByCompanyID($companyID = null) {
        $companyAlias = Company::select('alias')
                ->where('companyID', $companyID)
                ->where('company.isDeleted', '=', 0)->first();
        
        return $companyAlias;
    }
    
    /**
     * Function to get the company name by giving the company's ID.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $companyID
     * @return array
     */
    public static function getCompanyNameByCompanyID($companyID = null) {
        $company = Company::select('companyName')
                ->where('companyID', $companyID)
                ->where('company.isDeleted', '=', 0)->first();
        
        return $company;
    }
}
