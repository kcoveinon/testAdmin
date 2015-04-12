<?php
/**
 * Description of DepotController
 *
 * @author dcarungay
 */
class DepotController extends BaseAdminController {
    
    protected $layout = 'layouts.full';
    
    public function getIndex(){
        return View::make('pages.depot.depot');
    }
}
