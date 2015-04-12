<?php
/**
 * Description of StateController
 *
 * @author dcarungay
 */
class StateController extends BaseAdminController {
    
    protected $layout = 'layouts.full';
    
    public function getIndex() {
        return View::make('pages.state.state');
    }
}
