<?php

class ThemeBuilderController extends \BaseController {

    protected $layout = 'layouts.full';
	
	public function getPageList($siteID) {
		//if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$pageListFolderPath = app_path().'/themeBuilder/pageList.json';
			$pageListStr = File::get($pageListFolderPath);	
			$pageList =  json_decode($pageListStr, true);
			
			return $pageList;
		//}
	}
	
	public function getHtmlList($siteID, $htmlType) {

		$guid = Site::getSiteGUIDBySiteID($siteID);
			
		$headerFilesFolderPath = app_path().'/views/pages/partnerHtml/'.$guid.'/'.$htmlType.'List.json';
		$headerListStr = File::get($headerFilesFolderPath);	
		$headerList =  json_decode($headerListStr, true);
		
		return $headerList;

		
	}

	public function getInitialHtml($siteID, $pageFileName, $htmlType) {

		$guid = Site::getSiteGUIDBySiteID($siteID);
			
		return View::make('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.'.$htmlType);

		
	}
	
	public function postHtmlSelect() {
		
		$siteID=Input::get('siteID');
		$pageFileName=Input::get('pageFileName');
		$htmlType=Input::get('htmlType');
		$htmlCode=Input::get('htmlCode');
		$htmlSourceType=Input::get('htmlSourceType');
		$selectionType=Input::get('selectionType');
		
		$guid = Site::getSiteGUIDBySiteID($siteID);

		$viewCode = 'pages.partnerHtml.';

		if($htmlSourceType == "default"){
			$htmlFilesPath = app_path().'/views/pages/partnerHtml/default/'.$htmlType.'.blade.php';
			$viewCode = $viewCode.'default.'.$htmlType;
		}else{
			$htmlFilesPath = app_path().'/views/pages/partnerHtml/custom/'.$htmlType.'/'.$htmlCode.'.blade.php';
			$viewCode = $viewCode.'custom.'.$htmlType.'.'.$htmlCode;
		}
		
		if($selectionType=='set'){
			File::copy($htmlFilesPath, app_path().'/views/pages/partnerHtml/'.$guid.'/'.$pageFileName.'/'.$htmlType.'.blade.php');
		}
		
		//return View::make('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.'.$htmlType);
		return View::make($viewCode);
		
	}

	public function postHtmlSave() {
	
		$siteID = Input::get('siteID');
		$pageFileName = Input::get('pageFileName');
		$htmlType = Input::get('htmlType');
		$customHtmlName = Input::get('customHtmlName');
		$customHtmlCode = Input::get('customHtmlCode');
		$customHtmlContent = Input::get('customHtmlContent');
		
		$guid = Site::getSiteGUIDBySiteID($siteID);

		$htmlFilesFolderPath = app_path().'/views/pages/partnerHtml/'.$guid.'/'.$htmlType.'List.json';
		$htmlListStr = File::get($htmlFilesFolderPath);	
		$htmlList =  json_decode($htmlListStr, true);
		
		$htmlSourceType = 'custom';

		if($customHtmlCode!=''){
			
			$htmlCode = $customHtmlCode;
			$customHtmlIndex = $this->searchJSON($htmlCode, $htmlList['htmlList'], 'htmlCode');

			if($customHtmlIndex >= 0){
				$htmlList['htmlList'][$customHtmlIndex]['htmlName'] = $customHtmlName;

			}else{
				$customHtmlCode=='';
			}
		}

		if($customHtmlCode==''){
			$htmlCode = $htmlSourceType.time();
			
			$newHtml['htmlName'] = $customHtmlName;
			$newHtml['htmlSourceType'] = $htmlSourceType;
			$newHtml['htmlCode'] = $htmlCode;

			array_push($htmlList['htmlList'], $newHtml);
		}
		
		File::put(app_path().'/views/pages/partnerHtml/custom/'.$htmlType.'/'.$htmlCode.'.blade.php', $customHtmlContent);
		
		File::put($htmlFilesFolderPath, json_encode($htmlList));
		
		return $htmlList;
		
	}
	
	public function getGoogleAnalytics($siteID) {
		
		$guid = Site::getSiteGUIDBySiteID($siteID);

		$googleAnalyticsFilePath = app_path().'/views/pages/partnerHtml/'.$guid.'/googleAnalytics.blade.php';

		if(!File::exists($googleAnalyticsFilePath )){
			File::put($googleAnalyticsFilePath , '<script>/*Place your code here*/</script>');
		}

		return File::get($googleAnalyticsFilePath);//View::make('pages.partnerHtml.'.$guid.'.googleAnalytics.blade.php');
		
	}

	public function postGoogleAnalytics() {
		
		$siteID = Input::get('siteID');
		$pageFileContent = Input::get('pageFileContent');

		$guid = Site::getSiteGUIDBySiteID($siteID);

		$googleAnalyticsFilePath = app_path().'/views/pages/partnerHtml/'.$guid.'/googleAnalytics.blade.php';
		
		File::put($googleAnalyticsFilePath, $pageFileContent);
		
		return 'Save Complete!';
		
		
	}

	public function getStylePreview($siteID, $pageFileName) {
		//if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID);
		//}else{
		//	return 'Failed to get header';
		//}
		
		$htmlFilesFolderPath = app_path().'/views/pages/partnerHtml/'.$guid;
		
		if(!File::isDirectory($htmlFilesFolderPath)){
			File::makeDirectory($htmlFilesFolderPath,  $mode = 0777, $recursive = false);
		}
		
		if(!File::exists($htmlFilesFolderPath.'/headerList.json')){
			File::put($htmlFilesFolderPath.'/headerList.json', '{"htmlList":[{"htmlName":"Default Header 1","htmlSourceType":"default","htmlCode":"default1"}]}');
		}

		if(!File::exists($htmlFilesFolderPath.'/footerList.json')){
			File::put($htmlFilesFolderPath.'/footerList.json', '{"htmlList":[{"htmlName":"Default Footer 1","htmlSourceType":"default","htmlCode":"default1"}]}');
		}
		
		$htmlFilesFolderPath = $htmlFilesFolderPath.'/'.$pageFileName;
		
		if(!File::isDirectory($htmlFilesFolderPath)){
			File::makeDirectory($htmlFilesFolderPath,  $mode = 0777, $recursive = false);
		}
		
		//$htmlFilesFolderPath = $htmlFilesFolderPath.'/header.blade.php';
		
		if(!File::exists($htmlFilesFolderPath.'/header.blade.php')){
			File::copy(app_path().'/views/pages/partnerHtml/default/header.blade.php', $htmlFilesFolderPath.'/header.blade.php');
		}

		if(!File::exists($htmlFilesFolderPath.'/footer.blade.php')){
			File::copy(app_path().'/views/pages/partnerHtml/default/footer.blade.php', $htmlFilesFolderPath.'/footer.blade.php');
		}
		
		return View::make('pages.themeBuilder.pages.'.$pageFileName)->with('guid',$guid)->with('pageFileName',$pageFileName)->with('siteID',$siteID);
		
    }
	
	public function getScssContents($siteID, $pageFileName, $scssFileName) {
		
		//if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		//}else{
		//	return 'Request Failed to load';
		//}
		
		$guidFilesFolderPath = public_path().'/assets/css/partnerThemes/'.$guid;
		
		if(!File::isDirectory($guidFilesFolderPath)){
			File::makeDirectory($guidFilesFolderPath,  $mode = 0777, $recursive = false);
		}
		
		$pageFilesFolderPath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName;
		
		if(!File::isDirectory($pageFilesFolderPath)){
			File::makeDirectory($pageFilesFolderPath,  $mode = 0777, $recursive = false);
		}
		
		$imagesFolderPath = $pageFilesFolderPath.'/images';
		$imagePathsListFile = $imagesFolderPath.'/imagePaths.json';
		
		if(!File::exists($imagesFolderPath)){
			File::makeDirectory($imagesFolderPath, 0775, true);
		}
		
		if(!File::exists($imagePathsListFile)){
			File::put($imagePathsListFile, '{ "imagePaths": [] }');
		}
		
		$styleContents = array();
		
		$styleFilePath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/'.$scssFileName.'.scss';
		
		if(!File::exists($styleFilePath)){
			File::copy(public_path().'/themeBuilder/pages/'.$pageFileName.'/'.$scssFileName.'.scss', $pageFilesFolderPath.'/'.$scssFileName.'.scss');
			File::copy(public_path().'/themeBuilder/pages/'.$pageFileName.'/'.$scssFileName.'.css', $pageFilesFolderPath.'/'.$scssFileName.'.css');
		}
		
		$styleContents['current'] = File::get($styleFilePath);
		
		$styleFilePath = public_path().'/themeBuilder/pages/'.$pageFileName.'/'.$scssFileName.'.scss';
		
		$styleContents['default'] = File::get($styleFilePath);
		
		return 	$styleContents;	
       
    }
	
	public function getIndex($siteID) {
		
		if(AccessValidator::validateIfUserHasAccessToSite($siteID)){

			return View::make('pages.themeBuilder.themeBuilder')->with('siteID',$siteID);  

		}else{
			return 'Could not access page';
		}
		
    }

    public function getTest($siteID) {
		
		if(AccessValidator::validateIfUserHasAccessToSite($siteID)){

			$this->layout->content = View::make('pages.themeBuilder.themeBuilderTest')->with('siteID',$siteID);  

			
			//return  View::make('themeBuilder.themeBuilderPageSelect')->with('siteID',$siteID);
			/*
			$pagesListFolderPath = app_path().'/themeBuilder/pageList.json';
			$pagesListStr = File::get($pagesListFolderPath);		
			$pagesList =  json_decode($pagesListStr, true);
			
			$returnHTML = 
				'<div class="page-list" style = "margin:20px;"><div class="ui divided list">';
			
			foreach ($pagesList['pageList'] as $page) {
				$returnHTML .=
					'<div class="item">
						<div class="right floated tiny teal ui button" ng-click = "showPageFunction(\'theme-builder/build/'.$page['pageFileName'].'/'.$siteID.'\');">Build Theme</div>';
				
				if ($page['pageURL']!=null && $page['pageURL']!='')
					$returnHTML .= 
						'<div class="right floated tiny teal ui button" onclick="generateFormCode(\''.$page['pageFileName'].'\')" >Generate Form Code</div>';
				
				$returnHTML .=
					'	<div class="content">
							<div class="header">'.$page['pageName'].'</div>
						</div>
					</div>';
			}
								
			$returnHTML .= '</div></div>';
			
			return $returnHTML;
			*/
		}else{
			return 'Could not access page';
		}
		
    }
	
	public function getPartnerContent($callback, $guid, $pageFileName, $htmlFileName) {		
		
		$viewContents = View::make('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.'.$htmlFileName);
		$viewContents = preg_replace('/ /', '[SPACE]', $viewContents);
		$viewContents = preg_replace('/\s+/', '', $viewContents);
		$viewContents = preg_replace('/\[SPACE\]/', ' ', $viewContents);
		$viewContents = preg_replace('/\"/', '\'', $viewContents);
		
		
		$result ='{"htmlContent" : "'.$viewContents.'"}';

		
		return Response::json($result)->setCallback($callback);
				
		
    }
	
	public function postPartnerContent() {		
		
		$parameters = Input::all();
		
		if($parameters['username'] === Config::get('global/curl.username') && $parameters['password'] === Config::get('global/curl.password')){
			return View::make('pages.partnerHtml.'.$parameters['guid'].'.'.$parameters['pageFileName'].'.'.$parameters['htmlFileName']);
        }else{
            return '';
        }
		
		/*
		$viewContents = View::make('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.'.$htmlFileName);
		$viewContents = preg_replace('/ /', '[SPACE]', $viewContents);
		$viewContents = preg_replace('/\s+/', '', $viewContents);
		$viewContents = preg_replace('/\[SPACE\]/', ' ', $viewContents);
		$viewContents = preg_replace('/\"/', '\'', $viewContents);
		
		
		$result ='{"htmlContent" : "'.$viewContents.'"}';

		
		return Response::json($result)->setCallback($callback);
		*/	
		
    }
	
	public function postSaveChanges() {
		
		$siteID = Input::get('siteID');
		$scss = Input::get('scss');
		$pageFileName = Input::get('pageFileName');
		$scssFileName = Input::get('scssFileName');
		
		//if(AccessValidator::validateIfUserHasAccessToSite($siteID)){
			$guid = Site::getSiteGUIDBySiteID($siteID); 
		//}else{
		//	return 'Request Failed to load';
		//}
		
		
		require app_path().'/themeBuilder/scssphp/scss.inc.php';
		$scssCompiler = new scssc();
		
		$css = $scssCompiler->compile($scss);
		
		//$scssFilePath = public_path().'/assets/css/'.$guid.'/'.$guid.'.scss';
		//$cssFilePath = public_path().'/assets/css/'.$guid.'/'.$guid.'.css';
		$scssFilePath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/'.$scssFileName.'.scss';
		$cssFilePath = public_path().'/assets/css/partnerThemes/'.$guid.'/'.$pageFileName.'/'.$scssFileName.'.css';
		
		File::put($scssFilePath, $scss);
		File::put($cssFilePath, $css);
		
		return 	'completed';	
    }

    private function searchJSON($key, $array = array(), $searchIndex){
		foreach($array as $index => $rec){
			if($rec[$searchIndex]==$key){
				return $index;
				break;
			}
		}
		return -1;		
	}
}
