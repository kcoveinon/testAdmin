<?php

class LocationController extends BaseAdminController {
    
    protected $layout = 'layouts.full';
    
    public function getIndex(){
        return View::make('pages.location.location');
    }
}