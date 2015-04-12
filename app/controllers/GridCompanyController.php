<?php

/**
 * Controller that handles all functions related to the generation of the GRID for Companies
 *
 * @author Dan Zachary Caruñgay
 */
class GridCompanyController extends BaseAdminController {
    
    public function getShowCompanyGrid($grid_variables = array()){
        $base_columns = array(
            'VVVCompanyID' => 'company.companyID',
            'VVVCompanyName' => 'company.companyName',
            'VVVSiteID' => 'company_site.company_siteID',
            'VVVSiteName' => 'company_site.siteName',
            'VVVSiteGUID' => 'company_site.siteGUID',
            'VVVSiteCreatedAt' => 'company_site.created_at',
        );
        JGrid::initialize($grid_variables, $base_columns);
        $list = Company::getAllCompanySitesToGrid($grid_variables);
        return Response::json($list);
    }
}
