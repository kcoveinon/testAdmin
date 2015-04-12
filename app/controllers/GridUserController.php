<?php
/**
 * Description of GridUserController
 *
 * @author dcarungay
 */
class GridUserController extends BaseAdminController {
    
    public function getShowUserGrid($id, $grid_variables = array()){
        $base_columns = array(
            'AUserID' => 'company_userID',
            'ACompanyID' => 'companyID',
            'AName' => 'name',
            'AEmail' => 'email',
            'ACreatedAt' => 'created_at',
            'AUpdatedAt' => 'updated_at'
        );
        JGrid::initialize($grid_variables, $base_columns);
        $users = CompanyUser::getUserGridByCompanyID($grid_variables, $id);
        
        return Response::json($users);
    }
}