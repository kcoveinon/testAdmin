<?php
	
	class LoginType extends Eloquent {

		protected $table = 'loginType';
		protected $primaryKey = 'loginTypeID';

		const VROOMVROOMVROOM_TYPE_NAME = 'vroomvroomvroom';
		const GOOGLE_TYPE_NAME = 'google';
		const FACEBOOK_TYPE_NAME = 'facebook';
		const TWITTER_TYPE_NAME = 'twitter';

		public static function getVroomLoginTypeId() {
			$loginTypeId = self::getLoginTypeId(self::VROOMVROOMVROOM_TYPE_NAME);

			return $loginTypeId;
		}

		public static function getGoogleLoginTypeId() {
			$loginTypeId = self::getLoginTypeId(self::GOOGLE_TYPE_NAME);

			return $loginTypeId;
		}

		private static function getLoginTypeId($loginTypeName = '') {
			$loginType = self::where('loginTypeName', '=', $loginTypeName)
				->select('loginTypeID')
				->first();
			
			$loginTypeId = '';

			if(!empty($loginType)) {
				$loginType = $loginType->toArray();
				$loginTypeId = $loginType['loginTypeID'];
			}

			return $loginTypeId;
		}
	}