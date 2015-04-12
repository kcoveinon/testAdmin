<?php

	class ForgotPasswordController extends BaseController {

		public function postProcess() {
			if(Request::ajax()) {

				$email = Input::get('email', '');
								
				$vroomLoginTypeId = LoginType::getVroomLoginTypeId();
				
				$currentTimestamp = date('Y-m-d H:i:s');

				$companyUserId = CompanyUser::checkIfUserExists($email, $vroomLoginTypeId);
				$arr_result = array();
				$result = 'success';

				if(!empty($companyUserId)) {
					$userName = CompanyUser::getCompanyUserName($companyUserId);

					$forgotPasswordCode = strtoupper(md5($currentTimestamp . ' ' . $userName . ' ' . mt_rand() . ' ' . mt_rand()));

					$insertData = array(
						'forgotPasswordCode' => $forgotPasswordCode,
						'company_userID' =>  $companyUserId,
						'isChanged' => 0
					);
					
					$isSuccessful = CompanyUserForgotPassword::insertNew($insertData);

					if($isSuccessful) {
						VroomMailServices::sendNotificationEmail('emails.forgot_password', 'notification', array(
							'subject' => 'Forgot Password',
							'email' => $email,
							'name' => $userName,
							'forgotPasswordLink' => url('forgot-password/process/' . $forgotPasswordCode)
						));
						$result = 'success';
					}	
				} else {
					$result = 'no_data';
				}
				
				$arr_result['result'] = $result;

				return Response::json($arr_result);
			}
		}

		public function getProcess($forgotPasswordCode = '') {
			
			$isValid = CompanyUserForgotPassword::validateForgotPasswordCode($forgotPasswordCode);
			
			if($isValid === true) {
				return View::make('pages.forgot_password', array(
					'forgotPasswordCode' => $forgotPasswordCode
				));	
			} else if(!$isValid) {
				echo 'Link has already expired';
			}

			/*if($isValid === true) {
				return View::make('main.forgot_password', array(
					'forgotPasswordCode' => $forgotPasswordCode
				));	
			} else if($isValid === '') {
				echo 'Link has already expired';
			} else {
				echo 'Link has already expired';
			}*/
		}

		public function postCreateNewPassword() {
			if(Request::ajax()) {
				$post = Input::all();

				$forgotPasswordCode = $post['forgotPasswordCode'];
				$email = $post['email'];
				$password = $post['password'];
				$retype = $post['retype'];
				
				$isSuccess = false;
				$result = '';
				$isValid = CompanyUserForgotPassword::validateForgotPasswordCode($forgotPasswordCode);

				
				if($isValid === true && $password == $retype) {

					$companyUserId = CompanyUserForgotPassword::getCompanyUserId($forgotPasswordCode);

					if(!empty($companyUserId)) {
						$dbCompanyUserEmail = CompanyUser::getEmail($companyUserId);

						if($dbCompanyUserEmail == $email) {
							$isValid = CompanyUserForgotPassword::validateForgotPasswordCode($forgotPasswordCode, $companyUserId);
							
							if($isValid === true) {
								$isSuccess = CompanyUser::updatePassword($forgotPasswordCode, $companyUserId, $password);
							}	
						} else {
							$result = 'invalid_email';
						}						
					}					
				} else {
					
					if($password != $retype) {
						$result = 'password_not_match';
					}

					if(!$isValid) {
						$result = 'no_code';	
					}					
				}

				if($isSuccess) {
					$result = 'success';
				}

				return Response::json(array(
					'result' => $result
				));
			}
		}
	}