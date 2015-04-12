<?php
/**
 * Description of Location
 *
 * @author dcarungay
 */
class Depot extends Eloquent {
    
    protected $table = "depot";
    protected $primaryKey = 'depotID';
    
    public static function getAllDepotsToGrid($grid_variables=array()){
        $qBuilder = self::join('country', 'country.countryID', '=', 'depot.countryID')
                ->join('supplier', 'supplier.supplierID', '=', 'depot.supplierID')
                ->orderBy('depot.popularity', 'desc')
                ->where('depot.isDeleted', '=', 0)
                ->select($grid_variables['columns']);
        $rsResult = JGrid::process($grid_variables, $qBuilder);
        return $rsResult;
    }
}
