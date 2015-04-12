<?php
/**
 * Description of GridDepotController
 *
 * @author dcarungay
 */
class GridDepotController extends BaseAdminController {
    
    public function getShowDepotGrid($grid_variables = array()){
        $base_columns = array(
            'VVVDepotID' => 'depot.depotID',
            'VVVDepotName' => 'depot.depotName',
            'VVVDepotCode' => 'depot.depotCode',
            'VVVDepotPhone' => 'depot.phoneNumber',
            'VVVAirport' => 'depot.isAirport',
            'VVVDepotAddress' => 'depot.address',
            'VVVDepotCity' => 'depot.city',
            'VVVPostCode' => 'depot.postCode',
            'VVVLongitude' => 'depot.longitude',
            'VVVLatitude' => 'depot.latitude',
            'VVVDepotPopoularity' => 'depot.popularity',
            'VVVSupplierName' => 'supplier.supplierName',
            'VVVCountryName' => 'country.countryName',
        );

        echo '<pre>'; print_r($grid_variables); exit();
        $result = JGrid::initialize($grid_variables, $base_columns);
        $list = Depot::getAllDepotsToGrid($grid_variables);
        return Response::json($list);
    }
}
