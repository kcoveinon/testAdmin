<?php
/**
 * Description of Location
 *
 * @author dcarungay
 */
class Location extends Eloquent {
    
    protected $table = "location";
    protected $primaryKey = 'locationID';
    
    public static function getAllLocationsToGrid($grid_variables=array()){
        $qBuilder = self::join('country', 'country.countryID', '=', 'location.countryID')
                ->leftjoin('state', 'state.stateID', '=', 'location.stateID')
//                ->where('location.isShow', '=', '1')
                ->where('location.isDeleted', '=', 0)
                ->orderBy('location.locationPopularity', 'desc')
                ->select($grid_variables['columns']);
        $rsResult = JGrid::process($grid_variables, $qBuilder);
        return $rsResult;
    }
}
