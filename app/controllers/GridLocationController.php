<?php
/**
 * Controller that handles all functions related to the generation of the GRID for Locations (table)
 *
 * @author Dan Zachary Caruñgay
 */
class GridLocationController extends BaseAdminController {

    public function getShowLocationGrid($grid_variables = array()){
        $base_columns = array(
            'VVVLocationID' => 'location.locationID',
            'VVVLocationName' => 'location.locationName',
            'VVVLatitude' => 'location.locationLatitude',
            'VVVLongitude' => 'location.locationLongitude',
            'VVVPopularity' => 'location.locationPopularity',
            'VVVCity' => 'location.city',
            'VVVStateName' => 'state.stateName',
            'VVVCountryName' => 'country.countryName',
//            'VVVCreatedAt' => 'location.created_at',
        );
        JGrid::initialize($grid_variables, $base_columns);
        $list = Location::getAllLocationsToGrid($grid_variables);
        return Response::json($list);
    }
}
