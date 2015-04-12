<?php
/**
 * Description of CountryController
 *
 * @author dcarungay
 */
class CountryController extends BaseAdminController {
    
    protected $layout = 'layouts.full';
    
    public function getIndex(){
        return View::make('pages.country.country');
    }
}
