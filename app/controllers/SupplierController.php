<?php

class SupplierController extends BaseController 
{

    public function getGet()
    {
        if(Request::ajax()) {
           return Response::json(array('response' => Supplier::getAllSuppliers()));
        }
    }
}