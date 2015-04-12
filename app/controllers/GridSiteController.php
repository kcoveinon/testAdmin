<?php
/**
 * Description of GridSiteController
 *
 * @author dcarungay
 */
class GridSiteController extends BaseAdminController {
    
    public function getShowSiteGrid($id, $grid_variables = array()){
        $base_columns = array(
            'VVVSiteID' => 'company_site.company_siteID',
            'VVVSiteName' => 'company_site.siteName',
            'VVVSiteGUID' => 'company_site.siteGUID',
            'VVVCompanyID' => 'company_site.companyID',
        );
        JGrid::initialize($grid_variables, $base_columns);
        $list = Site::getSiteGridByCompanyID($grid_variables, $id);
        return Response::json($list);
    }
}
