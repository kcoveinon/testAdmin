<?php

	return array( 

	    /*
	    |--------------------------------------------------------------------------
	    | oAuth Config
	    |--------------------------------------------------------------------------
	    */

	    /**
	     * Storage
	     */
	    'storage' => 'Session', 

	    /**
	     * Consumers
	     */
	    'consumers' => array(

	        /**
	         * Facebook
	         */
	        'Facebook' => array(
	            'client_id'     => '',
	            'client_secret' => '',
	            'scope'         => array(),
	        ),      

	        'Google' => array(
	        	/* localhost id */
	            /*'client_id'     => '652027591897-t8up6ffkqhlpb2v6i7rjfhged7i7000i.apps.googleusercontent.com',
	            'client_secret' => 'OI0-bTe1oTmZJdgAoy3SkHWr',*/
            	/* production id */
                'client_id'     => '652027591897-rbc9mj8ftusvvu4o8iuvlu0tfudsedf7.apps.googleusercontent.com',
                'client_secret' => 'E80zi8fFJvVb6Mit9hmLJCNF',
	            'scope'         => array('userinfo_email', 'userinfo_profile')
	        ),
	    )

	);