<?php
/**
 * Description of Country
 *
 * @author dcarungay
 */
class Country extends Eloquent {
   
    protected $table = "country";
    protected $primaryKey = 'countryID';
    
    public static function getAllCountriesToGrid($grid_variables=array()){
        $qBuilder = self::select($grid_variables['columns'])->where('isDeleted', '=', 0);
        $rsResult = JGrid::process($grid_variables, $qBuilder);
        return $rsResult;
    }
}
