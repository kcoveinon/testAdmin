<?php

	class LoginViaController extends BaseController {


		public function getGoogleResponseUrl() {
			// get data from input
				
			$code = Input::get('code');
			$error = Input::get('error');
			$respUrl = URL::current();

			// get google service			
						
			$googleService = OAuth::consumer('Google', $respUrl);
			$loginResult = '';
			
			// check if code is valid
						
			// if code is provided get user data and sign in
			if(!empty($code)) {
				
				// This was a callback request from google, get the token
				$token = $googleService->requestAccessToken($code);

			    // Send a request with it
			    $result = json_decode($googleService->request('https://www.googleapis.com/oauth2/v1/userinfo'), true);
			    			   
			    $googleUserEmail = $result['email'];
			    $googleLoginTypeId = LoginType::getGoogleLoginTypeId();
			    
			    $companyUserID = CompanyUser::checkIfUserExists($googleUserEmail, $googleLoginTypeId);

			    if(empty($companyUserID)) {
			    						
					$loginTypeCount = CompanyUser::checkUserLoginTypeCount($googleUserEmail);

					if($loginTypeCount >= 1) {
						$loginResult = 'other_login_type';
					} else {
						$loginResult = 'no_user';
					}
			    } else {
			    	$loginResult = 'success';
			    }

			    $loginViaMessage = '';

			    if($loginResult == 'success') {
			    	Auth::loginUsingId($companyUserID);	
			    	/*Auth::attempt(array(
			    		'company_userID' => $companyUserID,
			    		'password' => 
			    	), true);*/
			    } else if($loginResult == 'other_login_type') {			    	
			    	$loginViaMessage = 'There is an existing account but other login type';
			    } else if($loginResult == 'no_user') {			    	
			    	$loginViaMessage = 'No user associated in this email';
			    }
			    
			    return Redirect::to('/')->with('loginViaMessage', $loginViaMessage);
			    
			    /*'id' => string '107449593908327106442' (length=21)
			     'email' => string 'jaimehing@gmail.com' (length=19)
			     'verified_email' => boolean true
			     'name' => string 'Jaime Hing' (length=10)
			     'given_name' => string 'Jaime' (length=5)
			     'family_name' => string 'Hing' (length=4)
			     'link' => string 'https://plus.google.com/+JaimeHingIII' (length=37)
			     'picture' => string 'https://lh3.googleusercontent.com/-pIuCUvNZZao/AAAAAAAAAAI/AAAAAAAAACA/_Yx7XjatjGM/photo.jpg' (length=92)
			     'gender' => string 'male' (length=4)*/			    
			} else {
				// if not ask for permission first
				// get googleService authorization

				if($error == 'access_denied') {
					return Redirect::to('/');
				} else {
					$url = $googleService->getAuthorizationUri();
				    // return to google login url
				    return Redirect::to( (string)$url );	
				}
			    
			}
		}

		public function getVroomResponseUrl($token = '', $alias = '') {
			$vroomClient = new VroomClient();
			$vroomClient->setToken($token);
			$vroomClient->setRequirements(array(
				'id'
			));
									
			if($vroomClient->isAuthenticated('vroomAdmin')) {
				$clientData = $vroomClient->getClientData('vroomAdmin');
				Auth::loginUsingId($clientData['id']);
				return Redirect::to('/');
			} else {
				echo 'not authenticated';
			}
		}

		public function getVroom() {
								
			$alias = 'vroomAdmin';	
			$vroomClient = new VroomClient(action('LoginViaController@getVroomResponseUrl', array()));
								
			$vroomClient->setAlias($alias);
			header('Location: ' . $vroomClient->getAuthenticationUrl());
			die();
		}
	}