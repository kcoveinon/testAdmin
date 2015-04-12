<?php
/**
 * Description of GridStateController
 *
 * @author dcarungay
 */
class GridStateController extends BaseAdminController {
    
    public function getShowStateGrid($grid_variables = array()){
        $base_columns = array(
            'VVVStateID' => 'state.stateID',
            'VVVStateName' => 'state.stateName',
            'VVVStateCode' => 'state.stateCode',
            'VVVCountryName' => 'country.countryName',
        );
        JGrid::initialize($grid_variables, $base_columns);
        $list = State::getAllStatesToGrid($grid_variables);
        return Response::json($list);
    }
}
