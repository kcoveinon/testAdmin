<?php

	class VroomClient {

		private $responseUrl;
		private $token;
		private $requirements;
		private $clientData;
		private $alias;
		/*private $model;*/
		private $vroomAuthUrl;
		private $authUrl;
		private $authenticateStatusUrl;
		private $authLogoutUrl;
		private $clientDataUrl;
		private $authenticateStatusUrlUsername;
		private $authenticateStatusUrlPassword;

		public function __construct($responseUrl = '') {
			$this->token = '';
			$this->responseUrl = rawurlencode($responseUrl);
			$this->requirements = array();
			$this->clientData = array();
			$this->alias = '';
			/*$this->model = '';*/

			/*$this->vroomAuthUrl = 'http://localhost/amazon_svn/vroomAuth/public';*/
			$this->vroomAuthUrl = Config::get('global/url.vroomAuth');
			$this->authUrl = $this->vroomAuthUrl .  '/login';
			$this->authenticateStatusUrl = $this->vroomAuthUrl . '/authenticate/status';
			$this->authLogoutUrl = $this->vroomAuthUrl . '/logout';
			$this->clientDataUrl = $this->vroomAuthUrl . '/authenticate/get-client-data';

			$this->authenticateStatusUrlUsername = Config::get('global/curl.username');
			$this->authenticateStatusUrlPassword = Config::get('global/curl.password');
		}

		public function setAlias($alias) {
			$this->alias = $alias;
		}

		/*public function setModel($model) {
			$this->model = $model;
		}*/

		public function getAlias() {
			return $this->alias;
		}

		/*public function getModel() {
			return $this->model;
		}*/

		public function setBaseUrl($responseUrl = '') {
			$this->responseUrl = rawurlencode($responseUrl);
		}

		public function getAuthenticationUrl() {
			return $this->authUrl . '?responseUrl=' . $this->responseUrl . '&alias=' . $this->alias;
		}

		public function setToken($token) {
			$this->token = $token;
		}

		public function setRequirements($requirements) {
			$this->requirements = $requirements;
		}

		public function getClientData($source = '') {
			$token = $this->token;
			$requirements = $this->requirements;
			
			if(!empty($requirements)) {
				$ch = curl_init();
				$curl_setopt_array = array(
					CURLOPT_URL => $this->clientDataUrl,
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
					CURLOPT_USERPWD => Config::get('global/curl.CURLOPT_USERPWD'),
					CURLOPT_POST => true,
					CURLOPT_POSTFIELDS => http_build_query(array(
						'username' => $this->authenticateStatusUrlUsername,
						'password' => $this->authenticateStatusUrlPassword,
						'token' => $token,
						'source' => $source,
						'requirements' => $requirements
					))
				);	

				curl_setopt_array($ch, $curl_setopt_array);
				$response = curl_exec($ch);
				curl_close($ch);
				$clientData = json_decode($response, true);

				return $clientData;
			}
			
		}

		public function isAuthenticated($source = '') {
			$isAuthenticated = false;
			$token = $this->token;
			$ch = curl_init();

			$curl_setopt_array = array(
				CURLOPT_URL => $this->authenticateStatusUrl,
				CURLOPT_RETURNTRANSFER => true,
				CURLOPT_HTTPAUTH => CURLAUTH_BASIC,
				CURLOPT_USERPWD => Config::get('global/curl.CURLOPT_USERPWD'),
				CURLOPT_POST => true,					
				CURLOPT_POSTFIELDS => http_build_query(array(
					'username' => $this->authenticateStatusUrlUsername,
					'password' => $this->authenticateStatusUrlPassword,
					'source' => $source,
					'token' => $token
				))
			);
					
			curl_setopt_array($ch, $curl_setopt_array);
			$response = curl_exec($ch);
			curl_close($ch);
			
			$response = json_decode($response, true);		
			$isAuthenticated = $response['status'];

			return $isAuthenticated;
		}
	}