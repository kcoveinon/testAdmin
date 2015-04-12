<?php
/**
 * Description of GridCountryController
 *
 * @author dcarungay
 */
class GridCountryController extends BaseAdminController {
    
    public function getShowCountryGrid($grid_variables = array()){
        $base_columns = array(
            'VVVCountryID' => 'country.countryID',
            'VVVCountryName' => 'country.countryName',
            'VVVCountryISOCode' => 'country.countryCode',
        );
        JGrid::initialize($grid_variables, $base_columns);
        $list = Country::getAllCountriesToGrid($grid_variables);
        return Response::json($list);
    }
}
