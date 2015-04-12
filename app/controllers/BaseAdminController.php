<?php
/**
 * Description of BaseAdminController
 *
 * @author dcarungay
 */
class BaseAdminController extends BaseController {
    
    public function __construct() {
        $this->beforeFilter(function(){
            $checker = AccessValidator::checkIfSessionTimedOut();
            if(!empty($checker)){
                return $checker;
            }
            
        });
    }
}
