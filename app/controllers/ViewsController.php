<?php

class ViewsController extends \BaseAdminController {

	public function getGet($viewLocation) {
		return View::make($viewLocation);		
    }
    
}
