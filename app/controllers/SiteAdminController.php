<?php

class SiteAdminController extends BaseAdminController {

    protected $layout = 'layouts.full';
    
    /**
     * Function to show the sites list using the companyID.  The response is loaded via AJAX.
     * If the user is not logged in, it will return a 403 Unauthorized Action error.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $id
     * @return html|error
     */
    public function getIndex($id) {
        if (Auth::check()) {
            $companyData = Company::getCompanyNameByCompanyID($id);
            return View::make('pages.company_site')->with(array('sites' => Site::getSitesByCompanyID($id), 'companyID' => $id))->with('companyName', $companyData['companyName']);
        } else {
            return App::abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Function to show the site registration form page.  Reguires the companyID to continue and the
     * response is loaded via AJAX. If the user is not logged in, it will return a 403 Unauthorized
     * Action error.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $companyID
     * @return html|error
     */
    public function getSiteRegister($companyID = null, $siteID = null) {
        if (Auth::check() && !empty($companyID)) {
            $siteInformation = Site::getSiteInformationBySiteID($siteID);
            if(!empty($siteID)){
                return View::make('pages.site.site_form')->with('companyID', $companyID)->with('data', $siteInformation);
            }else{
                return View::make('pages.site.site_form')->with('companyID', $companyID);
            }
        } else {
            return App::abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Function to handle the form submit of the site registration form page.  Loads the response via AJAX.
     * Validates and inserts the new site information to the database.  Redirectes the user back to
     * the sites list if successful or redirects the users back to the form should there be validation
     * errors.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function postSiteRegistration() {
        $registrationData = array(
            'companyID' => Input::get('frmCompanyID'),
            'siteName' => Input::get('frmPartnerName'),
            'alias' => Input::get('frmPrefix'),
            'comment' => Input::get('frmComment')
        );
        
        try {
            $isValid = Site::validateSite($registrationData);
            $companyData = Company::getCompanyNameByCompanyID($registrationData['companyID']);
            if ($isValid->passes()) {
                $companyAlias = Company::getCompanyAliasByCompanyID($registrationData['companyID']);
                $siteGUID = Site::generateGUID($companyAlias['alias'], $registrationData['alias']);

                $finalRegistrationData = array(
                    'companyID' => $registrationData['companyID'],
                    'siteName' => $registrationData['siteName'],
                    'alias' => $registrationData['alias'],
                    'siteGUID' => $siteGUID,
                    'comment' => $registrationData['comment']
                );
                $site = Site::saveSiteInfo($finalRegistrationData);

                $folderPath = public_path() . "/assets/css/PartnerThemes/";
                $directoryStructure = $siteGUID . "/images/";
                mkdir($folderPath . $directoryStructure, 0777, true);

                return Response::json(array(
                    'status' => 'success',
                    'data' => $site,
                    'message' => 'New site record saved.'
                ));
            } else {
                return Response::json(array(
                    'status' => 'failed',
                    'data' => $isValid->messages(),
                    'message' => 'Saving site record failed.'
                ));
            }
        } catch (Exception $ex) {
            return Response::json(array(
                'status' => 'error',
                'data' => $ex,
                'message' => 'There was an error trying to save site information.'
            ));
        }
        
        
    }

    /**
     * Function to handle the edit form submit of the site registration form page.  Loads response
     * via AJAX.  Returns the user back to the site list upon successful update or returns the user
     * back to the form should there be validation errors.
     * 
     * Take note that this function is not yet used since edit pages are on hold until further clarifications
     * with Jaime's data grid.
     * 
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @param int $siteID
     * @return html
     */
    public function postEditSiteRegistration($siteID = null) {
        $siteInformation = array(
            'siteID' => Input::get('frmSiteID'),
            'siteName' => Input::get('frmPartnerName'),
            'comment' => Input::get('frmComment'),
        );
        
        try {
            $isValid = Site::validateSiteForUpdate($siteInformation);
            if ($isValid->passes()) {
                $site = Site::updateSiteInfo($siteInformation);
                return Response::json(array(
                    'status' => 'success',
                    'data' => $site,
                    'message' => 'Site record saved.'
                ));
            }else{
                return Response::json(array(
                    'status' => 'failed',
                    'data' => $isValid->messages(),
                    'message' => 'Updating site record failed.'
                ));
            }
        } catch (Exception $ex) {
            return Response::json(array(
                'status' => 'error',
                'data' => $ex,
                'message' => 'There was an error trying to save site information.'
            ));
        }
        
    }

    /**
     * A catch-all method may be defined which will be called when no other matching method is found on a given controller.
     * Taken from http://laravel.com/docs/controllers#handling-missing-methods
     * 
     * @param mixed $parameters
     */
    public function missingMethod($parameters = array()) {
        
    }

}
