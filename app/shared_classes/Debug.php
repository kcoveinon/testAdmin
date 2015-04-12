<?php

	class Debug {

		/** 
		*	Purpose: To debug a specific array. pass only the array, second parameter is to determine if you want to terminate the execution or not.
		*	@author Jaime A. Hing III
		*   @example Debug::print_r($my_arr, true);
		*   @param array $arr
		*   @param bool $to_die
		*/

		public static function print_r($arr = array(), $to_die = false) {
			
			print "<pre>";
			print_r($arr);
			print "</pre>";	

			if($to_die) {
				die();
			}	
		}	
	}