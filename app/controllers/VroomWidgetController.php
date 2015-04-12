<?php

class VroomWidgetController extends \BaseController {

	/*
	public function getAuthenticate($authenticationCode) {
		return 'alert("'.$authenticationCode.'")';
	}
	*/
	
	public function getRequest($callback, $authenticationCode) {
		
		/*************************
		Decode the parameter first - optional, in case we would want to encrypt the siteID since we can't have the validation we used in the theme builder
			(We could have something like this: {"siteID":"9","siteUserName":"flabbydan","sitePassword":"viper2455"} then encrypt it into alphanumeric characters)
		Validate source url based on siteID, siteUserName and sitePassword	
		Get the GUID using siteID
		**************************/
		/*
		$parameters = json_decode(Crypt::decrypt($authenticationCode), true);
		$siteInfo = json_decode(json_encode(Site::getSiteInfoByID($parameters['siteID'])),true);
		$siteHost = parse_url('http://'.$siteInfo['siteName'], PHP_URL_HOST);//note that the http:// might be removed in the future updates
		$sourceHost = parse_url(Request::server('HTTP_REFERER'), PHP_URL_HOST);
		
		if(!$sourceHost==$siteHost){
			$result ='{"content" : "Error encountered", "error" : "Authentication failed!"}';
			return Response::json($result)->setCallback($callback);
		}
		*/
		//return '<div>testing From Admin</div>';
		//return callback.'(' . "{'content' : '<div>testing content hope it works</div>'}" . ')';
		//$result ='{"content" : "<div>testing content hope it works</div>"}';
		
		
		$viewContents = View::make('pages.themeBuilder.pages.searchPage720x520');
		//$viewContents = $viewContents.'<script type="text/javascript" src="http://54.79.109.125/vroomAdmin/public/themeBuilder/pages/searchPage720x520/searchForm.js"></script>';
		$viewContents = str_replace('<style class="stylePreview"></style>','<link href="http://admin.vroomvroomvroom.eu/assets/css/partnerThemes/flabbydan-fleet-zBDXLbh62LTAxjHompw/searchPage720x520/searchPage720x520CustomSyle.css?'.time().'" rel="stylesheet"/>',$viewContents);
		$viewContents = preg_replace('/ /', '[SPACE]', $viewContents);
		$viewContents = preg_replace('/\s+/', '', $viewContents);
		$viewContents = preg_replace('/\[SPACE\]/', ' ', $viewContents);
		$viewContents = preg_replace('/\"/', '\'', $viewContents);
		
		//$viewContents = preg_replace('/\<style class\=\"stylePreview\"\>\<\/style\>/', '\<link href\=\"http:\/\/admin\.vroom\.com\/assets\/css\/PartnerThemes\/flabbydan\-flabbydan\-kwjNUYKFEzBMlrCwGo5J\/searchPage720x520\/searchPage720x520CustomSyle\.css\" rel\=\"stylesheet\"\/\>', $viewContents);
		//$_SERVER['HTTP_REFERER']
		//$result ='{"content" : "'.Request::server('HTTP_REFERER').'"}';
		
		$result ='{"content" : "'.$viewContents.'"}';
		//$result ='{"content" : "testing"}';

		//$result ='{"content" : "'.Crypt::decrypt('eyJpdiI6IkZpRStnTEZYQ2hGNDFxXC9yMVUydG1YUlRNSVNnTnhjVHNLMjlSbFpUazhzPSIsInZhbHVlIjoiWlNWY3JhZW1JeDFRMDFBa1BlVVNXeXNpcGdoT20wNFwvZU4yTHpNeklDUzhpT1wvdUZJNk5sN3AxTmk4TG4wR0J1XC9lcWZnRVFsVkRFWjVNUkpPcnpSeTh4RmZhVHpSYXlLVGhrUEJ3bGRVQStkU2k0N0hSbFBCYkpYTjB0QzNwS2kiLCJtYWMiOiJkMTVlYjVkNzE5ZmVjYzMzMWNlZjFlMWEwMWJiMzE4YzlmZWNiMzY1ZDRiN2QxM2EyNGVjZjBlYzlkNDIxZjdlIn0=').'"}';
		
		return Response::json($result)->setCallback($callback);
		
		//$URL_REF = parse_url($_SERVER['HTTP_REFERER']);
		//return Request::server('PATH_INFO');
		
		//return Response::json($result, 200, array('Content-Type' => 'application/javascript'));
		//$result ="JSON_CALLBACK({'content' : '<div>testing content hope it works</div>'})";
		//Response::json($result);
		
		
    }

    public function getLocations($callback, $limit = 0, $searchText = '', $authenticationCode) {

		$tmp_locations = LocationAutoComplete::getLocations($limit, $searchText)
			->toArray();
		
		$locations = array();

		foreach($tmp_locations AS $index => $row) {
			/*array_push($locations, array(
				'id' => $row['loc_id'],
				'display' => $row['display_name'],
				'value' => $row['display_name']
			));*/
			
			/*'locationID as loc_id',
			'countryName as country_name',
			'countryCode as country_code',
			'locationName as display_name',
			'stateCode as state_code',
			'airportCode as airport_code',
			'isAirport as is_airport'*/

			if($row['is_airport']) {
				$inAirport = 'plane';
			} else {
				$inAirport = '';
			}

			$locations[] = array(
				'id' => $row['loc_id'],
				'display' => '<i class="float-left ' . $inAirport . ' icon"></i>' . 
					'<span class="float-left"> ' . $row['display_name'] . '</span>' .
					'<span class="float-right">' . $row['country_name'] . ' <img src="http://vroomvroomvroom.eu/img/flags/'. strtolower($row['country_code']) . '.png"></span>',
				'value' => $row['display_name']
			);
			/*
			$locations = array(
				'test'=>'testing'
			);
			*/
		}

		return Response::json($locations)->setCallback($callback);
	}
	
	public function getWidgetCode($siteID) {
	
		if(!AccessValidator::validateIfUserHasAccessToSite($siteID)){
			return 'Could not complete request';
		}
		
		$authenticationCode = Crypt::encrypt('{"siteID":"'.$siteID.'"}');
		
		$widgetCode = '<script>var authenticationCode = "'.$authenticationCode.'";</script>'.chr(13).'<script type="text/javascript" src="http://admin.vroom.com/themeBuilder/searchPageWidget/initializeWidget.js"></script>'.chr(13).'<div id="vroomWidgetPosition" style="display:block; width:100%; height:600px"></div>';
			
		return $widgetCode;
		
	}
	
	private function testing(){
	
		return 'testing lang po ito';
	}
	
	
/* The codes below are from ThemeBuilderController. I'll just use it as refference for now. I'll delete this later

    public function getIndex($siteID) {
		
		if(Site::validateIfUserHasAccessToSite($siteID)){
			$this->layout->content = View::make('themeBuilder.themeBuilderPageSelect')->with('siteID',$siteID);   
		}else{
			return 'Could not access page';
		}
		
    }
	
	public function getPageList() {
		
		$pagesListFolderPath = app_path().'/themeBuilder/pageList.json';
		$pagesListStr = File::get($pagesListFolderPath);		
		$pagesList =  json_decode($pagesListStr, true);
		
		return Response::json($pagesList);
       
    }
	
	public function getBuild($pageFileName, $siteID) {
	
		if(Site::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Could not access page';
		}
	
		$guidFilesFolderPath = public_path().'/assets/css/PartnerThemes/'.$guid;
		
		if(!File::isDirectory($guidFilesFolderPath)){
			File::makeDirectory($guidFilesFolderPath,  $mode = 0777, $recursive = false);
		}
		
		$pageFilesFolderPath = public_path().'/assets/css/PartnerThemes/'.$guid.'/'.$pageFileName;
		
		if(!File::isDirectory($pageFilesFolderPath)){
			File::makeDirectory($pageFilesFolderPath,  $mode = 0777, $recursive = false);
		}
		
		$pagesListFolderPath = app_path().'/themeBuilder/pageList.json';
		$pagesListStr = File::get($pagesListFolderPath);		
		$pagesList =  json_decode($pagesListStr, true);
		
		foreach($pagesList['pageList'] as $page)
		{
			if($page['pageFileName'] == $pageFileName)
			{
				$scssFileName = $page['scssFileName'];
			}
		}
		
		if(!File::exists($pageFilesFolderPath.'/'.$scssFileName.'.scss')){
			File::copy(public_path().'/themeBuilder/pages/'.$pageFileName.'/'.$scssFileName.'.scss', $pageFilesFolderPath.'/'.$scssFileName.'.scss');
		}
		
		if(!File::exists($pageFilesFolderPath.'/'.$scssFileName.'.css')){
			File::copy(public_path().'/themeBuilder/pages/'.$pageFileName.'/'.$scssFileName.'.css', $pageFilesFolderPath.'/'.$scssFileName.'.css');
		}
		
		$this->layout->content = View::make('themeBuilder.themeBuilder')->with('pageFileName',$pageFileName)->with('scssFileName',$scssFileName)->with('siteID',$siteID);  
       
    }
	
	public function getGenerateFormCode($siteID, $pageFileName) {
		
		if(Site::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		$pagesListFolderPath = app_path().'/themeBuilder/pageList.json';
		$pagesListStr = File::get($pagesListFolderPath);		
		$pagesList =  json_decode($pagesListStr, true);
		
		foreach($pagesList['pageList'] as $page)
		{
			if($page['pageFileName'] == $pageFileName)
			{
				$formCode = '<iframe src="'.$page['pageURL'].'/'.$guid.'" ></iframe>';
			}
		}
		return $formCode;
       
    }
	
	public function getStylePreview($pageFileName) {
		
		//return View::make('includes.resultsPage');
		return View::make('themeBuilder.pages.'.$pageFileName);
		//return $pageFileName;
       
    }
	
	public function getGenerateTheme($siteID) {
		
		if(Site::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		require app_path().'/scssphp/scss.inc.php';
		
		$scss = new scssc();
		
		$styleFilePath = public_path().'/assets/css/PartnerThemes/'.$guid.'/'.$guid.'.scss';
		
		if(File::exists($styleFilePath)){
			$styleContents = File::get($styleFilePath);
		}else{
			//Create the file
		}
		
		//return $scss->compile($styleContents);
		return 	$styleContents;	
		//return 'tae';
       
    }
	
	public function getScssContents($siteID, $pageFileName, $scssFileName) {
		
		//require app_path().'/scssphp/scss.inc.php';
		
		//$scss = new scssc();
		if(Site::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		$styleFilePath = public_path().'/assets/css/PartnerThemes/'.$guid.'/'.$pageFileName.'/'.$scssFileName.'.scss';
		
		if(File::exists($styleFilePath)){
			$styleContents = File::get($styleFilePath);
		}else{
			//Create the file
		}
		
		//return $scss->compile($styleContents);
		return 	$styleContents;	
		//return 'tae';
       
    }
	
	public function postSaveChanges() {
		
		$siteID = Input::get('siteID');
		$scss = Input::get('scss');
		$pageFileName = Input::get('pageFileName');
		$scssFileName = Input::get('scssFileName');
		
		if(Site::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		}else{
			return 'Request Failed to load';
		}
		
		
		require app_path().'/themeBuilder/scssphp/scss.inc.php';
		$scssCompiler = new scssc();
		
		$css = $scssCompiler->compile($scss);
		
		//$scssFilePath = public_path().'/assets/css/'.$guid.'/'.$guid.'.scss';
		//$cssFilePath = public_path().'/assets/css/'.$guid.'/'.$guid.'.css';
		$scssFilePath = public_path().'/assets/css/PartnerThemes/'.$guid.'/'.$pageFileName.'/'.$scssFileName.'.scss';
		$cssFilePath = public_path().'/assets/css/PartnerThemes/'.$guid.'/'.$pageFileName.'/'.$scssFileName.'.css';
		
		File::put($scssFilePath, $scss);
		File::put($cssFilePath, $css);
		
		return 	'completed';	
    }
	
	public function getInstall() {
		
		// Define the folders Paths
		$themeBuilderViewsDir = app_path().'/views/themeBuilder/'; 
		$themeBuilderPublicDir = public_path().'/themeBuilder/';
		
		$themeBuilderInstallerViewsDir = app_path().'/themeBuilder/views/'; 
		$themeBuilderInstallerPublicDir = app_path().'/themeBuilder/public/';
		
		// Copy the files
		File::copyDirectory($themeBuilderInstallerViewsDir, $themeBuilderViewsDir, $options = null);
		File::copyDirectory($themeBuilderInstallerPublicDir, $themeBuilderPublicDir, $options = null);
		
		$pagesListFolderPath = app_path().'/themeBuilder/pageList.json';
		
		if(!File::exists($pagesListFolderPath)){
			File::put($pagesListFolderPath, '{ "pageList": [] }');
		}
		
		return 'installation complete';
	}
	
	public function getNewPage() {
	
		$this->layout->content = View::make('themeBuilder.themeBuilderNewPage');
		
	}
	
	public function postSavePage() {
		
		$pageName = Input::get('pageName');
		$pageFileName = Input::get('pageFileName');
		$scssFileName = Input::get('scssFileName');
		$pageURL = Input::get('pageURL');
		
		$pagesListFolderPath = app_path().'/themeBuilder/pageList.json';
		$pagesListStr = File::get($pagesListFolderPath);		
		$pagesList =  json_decode($pagesListStr, true);
		
		//$newPage = {};
		
		$newPage['pageName'] = $pageName;
		$newPage['pageFileName'] = $pageFileName;
		$newPage['scssFileName'] = $scssFileName;
		$newPage['pageURL'] = $pageURL;
		
		array_push($pagesList['pageList'], $newPage);
		
		File::put($pagesListFolderPath, json_encode($pagesList));
		
		return 'completed';
		
	}
*/
}
