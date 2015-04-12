<?php
/**
 * Description of Breadcrumbs
 *
 * @author dcarungay
 */
class Breadcrumbs {
    
    public static function checkIfBreadcrumbSessionExists(){
        if(Session::has('breadcrumbs')){
            return true;
        }else{
            return false;
        }
    }
    
    public static function startBreadcrumbs(){
        $breadcrumbs = array();
        
        Session::put('breadcrumbs', $breadcrumbs);
    }
    
    public static function addCrumb($name, $url){
        $breadcrumbs = Session::get('breadcrumbs');
        if(!self::checkIfCrumbExists($name)){
            self::destroyAllCrumbs();
            $breadcrumbs[] = array(
                'name' => $name,
                'url' => $url 
            );
            Session::put('breadcrumbs', $breadcrumbs);
        }else{
            $key = self::findCrumbIndex($name);
            $index = $key+1; //Will return the next index from the array to remove
            self::removeCrumbsFromIndex($index);
        }
    }
    
    public static function getCrumbs() {
        $breadcrumbs = Session::get('breadcrumbs');
        
        return Response::json($breadcrumbs);
    }
    
    public static function destroyAllCrumbs() {
        Session::forget('breadcrumbs');
        
        if(self::checkIfBreadcrumbSessionExists()){
            //Breadcrumbs still exists
            return false;
        }else{
            //Breadcrumbs already removed from Session
            return true;
        }
    }
    
    public static function checkIfCrumbExists($name) {
        $breadcrumbs = Session::get('breadcrumbs');
        foreach ($breadcrumbs as $key => $value) {
            if($value['name'] === $name) {
                return true;
            }
        }
        
        return false;
    }
    
    public static function findCrumbIndex($name) {
        $breadcrumbs = Session::get('breadcrumbs');
        foreach ($breadcrumbs as $key => $value) {
            if($value['name'] === $name) {
                return $key;
            }
        }
        
        return false;
    }
    
    public static function removeCrumbsFromIndex($crumbIndex) {
        $breadcrumbs = Session::get('breadcrumbs');
        array_splice($breadcrumbs, $crumbIndex, count($breadcrumbs));
        
        Session::put('breadcrumbs', $breadcrumbs);
    }
}
