<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of State
 *
 * @author dcarungay
 */
class State extends Eloquent{
    
    protected $table = "state";
    protected $primaryKey = 'stateID';
    
    public static function getAllStatesToGrid($grid_variables=array()){
        $qBuilder = self::leftjoin('country', 'country.countryID', '=', 'state.countryID')->where('state.isDeleted', '=', 0)->select($grid_variables['columns']);
        $rsResult = JGrid::process($grid_variables, $qBuilder);
        return $rsResult;
    }
}
