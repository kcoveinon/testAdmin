<?php

	class LocationAutoComplete extends BaseModel {

		protected $table = 'location_autoComplete';
		protected $primaryKey = 'locationID';
		public $timestamps = false;

		public static function getLocations($limit = 0, $searchText = '') {
			
			$query = self::select(array(
				'locationID as loc_id',
				'countryName as country_name',
				'countryCode as country_code',
				'locationName as display_name',
				'stateCode as state_code',
				'airportCode as airport_code',
				'isAirport as is_airport'
			));

			if(!empty($searchText)) {
				$query->where('locationName', 'LIKE', "%{$searchText}%")
					->orWhere('stateCode', 'LIKE', "%{$searchText}%")
					->orWhere('airportCode', 'LIKE', "%{$searchText}%");
			}

			$query->orderBy('locationPopularity', 'desc');

			if(!empty($limit) && $limit != 0) {
				$query->take($limit);
			}


			return $query->get();
		}
	}