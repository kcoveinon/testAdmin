<?php

	class CompanyUserForgotPassword extends Eloquent {

		protected $table = 'company_user_forgotPassword';
		protected $primaryKey = 'company_user_forgotPasswordID';
		public $timestamps = false;

		public static function insertNew($data) {
			$isSuccessful = false;

			$res = DB::transaction(function() use($data) {
				self::where('company_userID', '=', $data['company_userID'])
					->where('isChanged', '=', false)
					->delete();

				self::insert(array(
					'forgotPasswordCode' => $data['forgotPasswordCode'],
					'company_userID' => $data['company_userID'],
					'isChanged' => $data['isChanged']
				));
				return 'success';
			});

			if($res == 'success') {
				$isSuccessful = true;
			}

			return $isSuccessful;
		}

		public static function getCompanyUserId($forgotPasswordCode = '') {
			$companyUserId = '';

			$companyUserForgotPassword = self::where('forgotPasswordCode', '=', $forgotPasswordCode)
				->select('company_userID')
				->first();

			if(count($companyUserForgotPassword) > 0) {
				$companyUserForgotPassword = $companyUserForgotPassword->toArray();
				$companyUserId = $companyUserForgotPassword['company_userID'];
			}

			return $companyUserId;
		}

		/*public static function useCode($forgotPasswordCode = '') {
			$res = '';
			$success = false;
			
			$res = DB::transaction(function() use($forgotPasswordCode) {
				self::where('forgotPasswordCode', '=', $forgotPasswordCode)
					->delete();
				return 'success';
			});

			if($res == 'success') {
				$success = true;
				
			}

			return $success;
		}*/

		public static function validateForgotPasswordCode($forgotPasswordCode = '', $companyUserId = '') {
			$isChanged = '';
			$isValid = false;

			$companyUserForgotPassword = self::where('forgotPasswordCode', '=', $forgotPasswordCode)
				->where('isChanged', '=', false);
	
			if($companyUserId !== '') {
				$companyUserForgotPassword = $companyUserForgotPassword
					->where('company_userID', '=', $companyUserId);
			}

			$companyUserForgotPassword = $companyUserForgotPassword
				->select('company_user_forgotPasswordID')
				->first();
					
			if(count($companyUserForgotPassword) > 0) {
				$isValid = true;
			}
			
			return $isValid;
			/*if(count($customerForgotPassword) > 0) {
				$customerForgotPassword =  $customerForgotPassword->toArray();
				$isChanged = (bool) $customerForgotPassword['isChanged'];
			}
			
			if($isChanged === '') {
				return '';
			} else if($isChanged === false) {
				$isValid = true;
			}

			return (bool) $isValid;*/
		}
	}