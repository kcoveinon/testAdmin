<?php

class ImageFolderController extends BaseController {

    //protected $layout = 'layouts.default';

//    public function showSites() {
    public function getIndex() {
//        $this->layout->content = View::make('pages.siteAdmin')->with('sites', SiteAdmin::all());
        return View::make('pages.siteAdmin')->with('sites', SiteAdmin::getSiteInfo());
    }

    public function getSiteUsersIndex($siteID = null) {
        $users = SiteAdmin::getSiteUsers($siteID);
//        SiteAdmin::printa($siteID);exit;
        return View::make('pages.siteAdminUsers')->with('data', array('siteID' => $siteID, 'users' => $users));
    }

    public function getEditSiteInfo($siteID = null) {
        $siteData = SiteAdmin::getSiteInfoByID($siteID);
        
        return View::make('pages.site_registration')->with('data', array('siteID' => $siteID, 'siteData' => $siteData));
    }

    public function missingMethod($parameters = array()) {
        
    }
	
	public function getImages($pageFileName, $siteID) {
	
		if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		$imagesFolderPath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/images';
		$imagePathsListFile = $imagesFolderPath.'/imagePaths.json';
		
		if(!File::exists($imagesFolderPath)){
			File::makeDirectory($imagesFolderPath, 0775, true);
		}
		
		if(!File::exists($imagePathsListFile)){
			File::put($imagePathsListFile, '{ "imagePaths": [] }');
		}
		
		$imagePathsListStr = File::get($imagePathsListFile);		
		$imagePathsList =  json_decode($imagePathsListStr);
		
		return Response::json($imagePathsList);

    }
	
	public function postUploadImage() {
		
		$siteID = Input::get('siteID');
		$image = Input::get('image');
		$pageFileName = Input::get('pageFileName');
		
		if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		$return_message = 'Upload Complete';
		
		$upload = true;
		
		$imagesFolderPath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/images';
		$imagePathsListFile = $imagesFolderPath.'/imagePaths.json';
		
		if(substr($image, 0, 4) != 'http'){			
			
			$imageFileName = 'img'.time().'.jpg';
			$imageFilePath = $imagesFolderPath.'/'.$imageFileName;
			$imagePathsPath = $imagesFolderPath."/imagePaths.json";
			
			$imageFile = file_get_contents($image);		
			$upload = file_put_contents($imageFilePath,$imageFile);
			
			$imageFileCSSPath = URL::to('/').'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/images/'.$imageFileName;
		}else{
			$imageFileCSSPath = $image;
		}
		
		if($upload){
			$imagePathsListStr = File::get($imagePathsListFile);		
			$imagePathsList =  json_decode($imagePathsListStr, true);
			array_push($imagePathsList['imagePaths'], $imageFileCSSPath);
			File::put($imagePathsListFile, json_encode($imagePathsList));
		}else{
			$return_message = 'Error Encountered';
		}
		
		return $return_message;
    }
	
	public function postDeleteImage() {
		
		$siteID = Input::get('siteID');
		$pageFileName = Input::get('pageFileName');
		$image = Input::get('image');
		
		if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		$image = str_replace("\\", "", $image); 
		
		$return_message = 'Image Deleted';
		
		$imagesFolderPath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/images';
		$imagePathsListFile = $imagesFolderPath.'/imagePaths.json';
		
		$imagePathsListStr = File::get($imagePathsListFile);		
		$imagePathsList =  json_decode($imagePathsListStr, true);
		//$key = array_search($image, $imagePathsList['imagePaths']);
		
		if (($key = array_search($image, $imagePathsList['imagePaths'])) !== false) {
			unset($imagePathsList['imagePaths'][$key]);
		}
		
		//array_push($imagePathsList['imagePaths'], $imageFileCSSPath);
		File::put($imagePathsListFile, json_encode($imagePathsList));
		//return Response::json($imagePathsList[$key]);
		//return $imagePathsList[$key];
		//return strval($key);
		return $return_message;
		
		/*
		$upload = true;
		
		if(substr($image, 0, 4) != 'http'){			
			
			$imageFileName = 'img'.time().'.jpg';
			$imageFilePath = $imagesFolderPath.'/'.$imageFileName;
			$imagePathsPath = $imagesFolderPath."/imagePaths.json";
			
			$imageFile = file_get_contents($image);		
			$upload = file_put_contents($imageFilePath,$imageFile);
			
			$imageFileCSSPath = '/assets/css/GUID000000001/images/'.$imageFileName;
		}else{
			$imageFileCSSPath = $image;
		}
		
		if($upload){
			$imagePathsListStr = File::get($imagePathsListFile);		
			$imagePathsList =  json_decode($imagePathsListStr, true);
			array_push($imagePathsList['imagePaths'], $imageFileCSSPath);
			File::put($imagePathsListFile, json_encode($imagePathsList));
		}else{
			$return_message = 'Error Encountered';
		}
		
		return $return_message;
		*/
    }
	
}
