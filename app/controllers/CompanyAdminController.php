<?php

class CompanyAdminController extends BaseAdminController {

    protected $layout = 'layouts.full';

    /**
     * Function to show the list of companies.  The response html will be loaded via AJAX.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function getIndex() {
        return View::make('pages.company.company');
    }

    /**
     * Function to get all the vehicles from the database.  Returns a json format since this is called via AJAX.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return json
     */
    public function getAllCompaniesViaAjax() {
        $companies = Company::select('companyID', 'companyName')->where('companyID', '<>', '1')->get();
        return Response::json($companies);
    }

    /**
     * Function show the company registration form page.  The response html will be loaded via AJAX.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function getCompanyRegister($companyID = null) {
        if (Auth::check() && Auth::user()->role == 1) {
            if (empty($companyID)) {
                return View::make('pages.company.company_form');
            } else {
                $companyDetails = Company::getCompanyDetailByCompanyID($companyID)->toArray();
                return View::make('pages.company.company_form')->with('companyID', $companyID)
                                ->with('data', $companyDetails);
            }
        } else {
            return App::abort(403, 'Unauthorized action.');
        }
    }

    /**
     * Function to handle the form submit of the company registration form page.  Loads the response via AJAX.
     * Validates then inserts the new company details to the database. Returns the user to the
     * company list page if insert was successful or returns the user back to the form if there
     * are validation errors.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function postCompanyRegistration() {
        $registrationData = array(
            'companyName' => Input::get('frmCompanyName'),
            'alias' => Input::get('frmAlias'),
        );

        try {
            $isValid = Company::validateCompany($registrationData);
            if ($isValid->passes()) {
                $company = Company::insertCompany($registrationData);
                return Response::json(array(
                    'status' => 'success',
                    'data' => $company,
                    'message' => 'New company record saved.'
                ));
            } else {
                return Response::json(array(
                    'status' => 'failed',
                    'data' => $isValid->messages(),
                    'message' => 'Saving company record failed.'
                ));
            }
        } catch (Exception $ex) {
            return Response::json(array(
                'status' => 'error',
                'data' => $ex,
                'message' => 'There was an error trying to save company information.'
            ));
        }
    }

    /**
     * Function to handle the form submit of the edit company registration form page.  Loads the response via AJAX.
     * Validates then updates the company details to the database. Returns the user to the
     * company list page if insert was successful or returns the user back to the form if there
     * are validation errors.
     * @author Dan Zachary Caruñgay <dan@vroomvroomvroom.com.au>
     * @return html
     */
    public function postEditCompanyRegistration() {
        $registrationData = array(
            'companyID' => Input::get('frmCompanyID'),
            'companyName' => Input::get('frmCompanyName'),
        );

        try {
            $isValid = Company::validateCompanyForUpdate($registrationData);
            if ($isValid->passes()) {
                $company = Company::updateCompany($registrationData);
                return Response::json(array(
                    'status' => 'success',
                    'data' => $company,
                    'message' => 'New company record saved.'
                ));
            } else {
                return Response::json(array(
                    'status' => 'failed',
                    'data' => $isValid->messages(),
                    'message' => 'Saving company record failed.'
                ));
            }
        } catch (Exception $ex) {
            return Response::json(array(
                'status' => 'error',
                'data' => $ex,
                'message' => 'There was an error trying to save company information.'
            ));
        }


        
    }

    public function getTestRoleCheck($userID = null) {
        var_dump(AccessValidator::checkIfUserIsAdministrator($userID));
        die();
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
