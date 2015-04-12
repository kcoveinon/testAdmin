<?php
	$distanceUnit = 'km';
	$currency = 'AUD';
	$email = '';
	//$header = 'testing';
	//$guid = 'VROOM-vroomeu-BlqukOgYbUiTpzWm464oWLXrMY';
	$pickupDate = '2014-11-23';
	$pickupTime = '10:00';
	$returnDate = '2014-11-24';
	$returnTime = '10:00';
	$pickupLocationId = '1926';
	$pickupLocationName = 'Brisbane Airport';
	$returnLocationId = '1926';
	$returnLocationName = 'Brisbane Airport';
	$driverAge = '25+';
	$userCountry = 'AU';
	$profileImage['mapProfileImage'] = '';
	//$footer = 'header';
?>	
<html lang="en" ng-app="vroomApp">
	<head>
		<title>Vroomvroomvroom</title>
		<meta charset="UTF-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
		<link rel="shortcut icon" href="http://www.vroomvroomvroom.com.au/images/logo-large.png">
		<link rel='stylesheet' type="text/css" href="http://fonts.googleapis.com/css?family=Lato:300,400,700">

		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/font_awesome/font-awesome.min.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/semantic_ui/semantic.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/global.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/range_slider/ion.rangeSlider.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/range_slider/ion.rangeSlider.skinFlat.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/range_slider/normalize.min.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/jquery-ui.css') }}" />
		
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/mobiscroll/mobiscroll.animation.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/mobiscroll/mobiscroll.scroller.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/mobiscroll/mobiscroll.scroller.ios7.css') }}" />
		
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/jquery-ui.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/vendor/jquery/m_datepicker/jquery.datepick.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/results/results.css') }}" />
		<link rel="stylesheet" type="text/css" href="{{ asset('themeBuilder/pages/resultPage/css/autocomplete-directive.css') }}" />
	
		<!-- This is for HtmlBuilder -->
		<link rel="stylesheet" href="{{ asset('assets/css/themeBuilder/htmlBuilder.css') }}" type="text/css" />
		<link rel="stylesheet" href="{{ asset('assets/css/themeBuilder/angularBackgroundSelector.css') }}" type="text/css" />
		<!-- This is for HtmlBuilder -->

		<!-- This is for CodeMirror -->
		<link rel="stylesheet" href="{{ asset('assets/css/vendor/codemirror/lib/codemirror.css') }}" type="text/css">
  		<link rel="stylesheet" href="{{ asset('assets/css/vendor/codemirror/addon/hint/show-hint.css') }}" type="text/css">
  		<link rel="stylesheet" href="{{ asset('assets/css/vendor/codemirror/theme/ambiance.css') }}" type="text/css">
  		
  		<!-- This is for CodeMirror -->

  		<!-- This is for ThemeBuilder -->
		<style class="stylePreview"></style>
		<!-- This is for ThemeBuilder -->

	</head>

	<body ng-init="baseUrl='{{ URL::to('/') }}'">
		<div class="ui app inverted top sidebar menu" sidebar-action ng-controller="MenuController" ng-init="distanceUnit.value = '{{ $distanceUnit}}'; currency.value = '{{ $currency }}'; customer.email = '{{ $email }}';">
			<!-- <a class="icon item">
				<img src="{{ asset('themeBuilder/pages/resultPage/img/logo2.png') }}" />
			</a> -->
			<div class="right menu">
				<div class="ui dropdown distanceUnit item" initialize-dropdown-action emit-name="distanceUnitDropdownFinished" dropdown-model="distanceUnit" distance-unit-dropdown-action>
					<input type="hidden" name="distanceUnit">
					<div class="default text">Distance Unit</div>
					<i class="dropdown icon"></i>
					<div class="menu">
				    	<div class="item" data-value="<% distanceUnit.unit %>" ng-repeat="distanceUnit in distanceUnits" emit-name="distanceUnitDropdownFinished" watch-dropdown-item>(<% distanceUnit.unit %>) <% distanceUnit.name %></div>
				  	</div>
				</div>			
				<div class="ui dropdown currency item" initialize-dropdown-action emit-name="currencyDropdownFinished" dropdown-model="currency" currency-dropdown-action>
					<input type="hidden" name="currency">
					<div class="default text">Currency</div>
					<i class="dropdown icon"></i>
					<div class="menu">
				    	<div class="item" data-value="<% currency.currencyCode %>" ng-repeat="currency in currencies" emit-name="currencyDropdownFinished" watch-dropdown-item>
				    		<i class="cflag icon"><img ng-src="{{ asset('themeBuilder/pages/resultPage/img/flags/<% currency.countryCode.toLowerCase() %>.png') }}" /></i> <% currency.currencyCode %>
				    	</div>
				  	</div>
				</div>
			 	<div class="ui button primary" ng-if="customer.email == ''">Login</div>
			 	<div class="ui dropdown item" ng-if="customer.email != ''" account-dropdown-action>
			 		<span ng-cloak><% customer.email %> </span>
			 		<i class="icon dropdown"></i>
			 		<div class="menu">
			 			<a class="item"><i class="edit icon"></i> Edit Profile</a>
			 			<a class="item"><i class="globe icon"></i> Choose Language</a>
			 			<a class="item" button-logout-action><i class="off icon"></i> Logout</a>
			 		</div>
			 	</div>
			 </div>
		</div>

		<!-- <div class="partner header" ng-controller="PartnerHeaderController" page-header-action="{{ $guid }}">
		</div> -->
		<div class="partner header" html-builder current-html="currentHtml" current-html-type="htmlType" html-type="header" show-modal = "showHtmlBuilderModal">
			@include('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.header')
		</div>

		<!-- <div class="ui app inverted menu">
			<a class="icon item">						
				<img src="{{ asset('themeBuilder/pages/resultPage/img/logo2.png') }}" />
			</a>				
			<div class="right menu">
				<div class="ui dropdown item" initialize-dropdown-action emit-name="currencyDropdownFinished" dropdown-model="uni">
					<input type="hidden" name="age">
					<div class="default text">Distance Unit</div>
					<i class="dropdown icon"></i>
					<div class="menu">
				    	<div class="item" data-value="<% age %>" ng-repeat="age in ages" emit-name="currencyDropdownFinished" watch-dropdown-item><% age %></div>
				  	</div>
				</div>			
				<div class="ui dropdown item" initialize-dropdown-action emit-name="currencyDropdownFinished" dropdown-model="driverAge">
					<input type="hidden" name="age">
					<div class="default text">Currency</div>
					<i class="dropdown icon"></i>
					<div class="menu">
				    	<div class="item" data-value="<% age %>" ng-repeat="age in ages" emit-name="currencyDropdownFinished" watch-dropdown-item><% age %></div>
				  	</div>
				</div>
			 	<div class="ui button primary">Login</div>
			 </div>
		</div> -->

		
		<div ng-controller="ResultsMainController" class="results main">			
			<div class="ui dimmer page" loading-vehicles-dimmer-action>
				<div class="content">
					<div class="center">
						<h2 class="ui inverted icon header">
							<i class="icon"><img src="{{ asset('themeBuilder/pages/resultPage/img/movingcar.gif') }}"></i>					
							Loading Vehicles. Please wait.
						</h2>
					</div>
				</div>
			</div>

			<div class="ui modal map" map-modal-action>
				<div class="header">				
					<% depotAddress %>
				</div>
				<div class="content">				
					<p class="toptext">Please provide us your location to compute car distance</p>
					<div class="ui small form">
						<div class="inline fields">
							<div class="field">
								<div class="ui mini right labeled icon input">
									<input type="text" placeholder="e.g. Brisbane" class="txt address" user-location-action ng-model="tabs[selectedIndex].userLocation.location.value">
									<autocomplete data="tabs[selectedIndex].userLocations" selected="tabs[selectedIndex].userLocation.location"></autocomplete>
									<i class="loading icon" ng-if="tabs[selectedIndex].userLocationQuerying"></i>
								</div>
								<p class="toptext selected"> <span ng-if="tabs[selectedIndex].userLocation.location.selected != ''">Selected: </span> <% tabs[selectedIndex].userLocation.location.selected %></p>
					  		</div>				  		
					  	</div>
				  	</div>			
					<google-map draggable="true" events="map.property.events" center="map.property.center" zoom="map.property.zoom">
					</google-map>
				</div>
				<div class="actions">
					<div class="ui black cancel button">
						Close
					</div>				
				</div>
			</div>

			<div class="ui stackable search grid" ng-controller="SearchController" ng-init="bindGetParams({ guid: '{{ $guid }}', pickupDate: '{{ $pickupDate}}', pickupTime: '{{ $pickupTime }}', returnDate: '{{ $returnDate}}', returnTime: '{{ $returnTime }}', pickupLocationId: '{{ $pickupLocationId }}', pickupLocationName: '{{ $pickupLocationName}}', returnLocationId: '{{ $returnLocationId }}', returnLocationName: '{{ $returnLocationName}}', driverAge: '{{ $driverAge }}', userCountry: '{{ $userCountry }}', mapProfileImage: '{{ $profileImage['mapProfileImage']  }}'})">
				<div class="column">
					<div class="ui fluid search form">
						<div class="inline fields">
							<div class="pickup location field">
								<div class="ui icon input">
									<input type="text" placeholder="Enter city name or airport code" pickup-location-action ng-model="resultsParams.pickupLocation.value">
									<autocomplete data="pickupLocations" selected="pickupLocation" custom-selected="editPickupDate" custom-class="pickuplocation-autocomplete"></autocomplete>
									<i class="loading icon" ng-if="pickupLocationQuerying"></i>
									<div class="ui checkbox" same-return-location-action>
										<input type="checkbox" name="fun">
										<label>same return location</label>
									</div>
								</div>
							</div>
							<div class="return location other field">
								<div class="ui icon input">
									<input type="text" placeholder="Enter city name or airport code" return-location-action>
									<autocomplete data="returnLocations" selected="returnLocation" custom-class="returnlocation-autocomplete">
									</autocomplete>
									<i class="loading icon" ng-if="returnLocationQuerying"></i>
								</div>
							</div>
							<div class="pick date other field">
								<div class="ui icon input">
									<input type="text" placeholder="Pickup date" datepicker-action field-type="pickup" ng-model="pickupDate.display">
									<i class="calendar icon"></i>
								</div>
							</div>
							<div class="return date other field">
								<div class="ui icon input">
									<input type="text" placeholder="Return date" datepicker-action field-type="return" ng-model="returnDate.display">
									<i class="calendar icon"></i>
								</div>
							</div>
							<div class="age other field">
								<div class="ui fluid selection dropdown" initialize-dropdown-action emit-name="driverAgeDropdownFinished" dropdown-model="driverAge">
									<input type="hidden" name="age">
									<div class="default text">Driver's age</div>
									<i class="dropdown icon"></i>
									<div class="menu">
								    	<div class="item" data-value="<% age %>" ng-repeat="age in ages" emit-name="driverAgeDropdownFinished" watch-dropdown-item><% age %></div>
								  	</div>
								</div>
							</div>
							<div class="country other field">
								<div class="ui fluid selection dropdown" initialize-dropdown-action emit-name="userCountryDropdownFinished" dropdown-model="userCountry">
									<input type="hidden" name="country">
									<div class="default text">Country</div>
									<i class="dropdown icon"></i>
									<div class="menu">
								    	<div class="item" data-value="<% country.code %>" ng-repeat="country in countries" emit-name="userCountryDropdownFinished" watch-dropdown-item><% country.name %></div>
								  	</div>
								</div>
							</div>
							<div class="ui search other primary button" other-button-action search-button-action>
								Search
							</div>
						</div>
					</div>
				</div>
			</div>
			<div class="ui results tabular menu">
				
				<a class="item" ng-repeat="tab in tabs" ng-class="{ 'active' : $parent.selectedIndex == '<% $index %>' }" tab-action>
				    <span class="primary"><% tab.pickupLocation.value %></span>
				    <p class="secondary">
				    	<span><% tab.pickupDate.display %></span>
				    	<span>to</span>
				    	<span><% tab.returnDate.display %></span>
				    </p>
					<div class="ui right corner favorite label" tab-favorite-action data-content="Add me as favourite search" data-variation="inverted" ng-class="{'favorited' : tab.favorited == true }">
						<i class="heart icon"></i>
					</div>
				</a>
			</div>
			<div class="ui stackable results grid">
				<div class="equal height row">
					<div class="tab five wide column" ng-controller="ResultsController">										
						<!-- <div class="ui two column stackable grid" ng-repeat="tab in tabs" ng-init="tabIndex = $index" ng-show="selectedIndex == tabIndex" ng-controller="TabController"> -->
						<div class="ui two column stackable grid" ng-repeat="tab in tabs" ng-controller="TabController" tab-container-action>
							<div class="five wide column filter-and-vehicles">
								<div class="ui one column filters stackable grid">
									<div class="column">
										<h4 class="ui header">
											Feature Filters
											<div class="ui black clear button" clear-filter-button>
												Clear Filters
											</div>
										</h4>									
										<h4 class="ui header">
											Maximum Price
										</h4>
										<!-- <input type="text" class="filter price" value="" initialize-ion-range-slider slider-attrs="price_slider_attr" filter-slider-action min="min_price" max="max_price" attribute="price" /> -->
										<input type="text" class="filter price slider-filter-<% tabIndex %>" value="" filter="price" vehicle-identifier="<% tab.filters.class.identifier %>" initialize-ion-range-slider slider-attrs="filtersAttrs.price" />
									</div>
									<div class="column">
										<h4 class="ui header">
											User Distance
										</h4>
										<!-- <input type="text" class="filter distance" value="" style-range-slider slider-attrs='{"type" : "single", "step" : 1, "disable": [[ mArr.user_distance_filter ]], "postfix" : " km", "prettify" : "false", "hasGrid" : "true"}' filter-slider-action min="min_user_distance" max="max_user_distance" attribute="user_distance" user-distance-slider-action /> -->
										<input type="text" class="filter distance slider-filter-<% tabIndex %>" value="" filter="userDistance" vehicle-identifier="<% tab.filters.class.identifier %>" initialize-ion-range-slider slider-attrs="filtersAttrs.userDistance" />
									</div>
									<div class="options column">
										<h4 class="ui header">
											Car Options
										</h4>
										<div class="ui stackable grid">
											<div class="three wide aircon column">
												<div class="ui mini toggle button button-filter-<% tabIndex %>" option-filter-button-action filter="aircon" ng-class="{'active': tab.filters.aircon.value == true}">
													<i class="icon asterisk"></i>
												</div>
												<p class="subtext">
													Aircon
												</p>
											</div>
											<div class="seven wide transmission column">
												<div class="ui mini buttons">
												  	<div class="ui button multiple-button-filter-<% tabIndex %>" data-value="<% transmission.id %>" ng-repeat="transmission in tab.filters.transmission.choices" ng-class="{'active' : tab.filters.transmission.value == transmission.id}" option-multiple-filter-button-action filter="transmission">
												  		<% transmission.name %>
												  	</div>
												</div>
												<p class="subtext">
													Transmission
												</p>
											</div>										
											<div class="three wide distance column">
												<div class="ui mini toggle button button-filter-<% tabIndex %>" option-filter-button-action filter="distance" ng-class="{'active': tab.filters.distance.value == true}">
													<i class="icon fa fa-road"></i>
												</div>
												<p class="subtext">
													Distance
												</p>
											</div>
											<div class="two wide column">
												<div class="ui mini toggle button button-filter-<% tabIndex %>" option-filter-button-action filter="airport" ng-class="{'active': tab.filters.airport.value == true}">
													<i class="icon fa fa-plane"></i>
												</div>
												<p class="subtext">
													Airport
												</p>
											</div>
										</div>									
									</div>
									<div class="column">
										<h4 class="ui header">
											Seating Capacity
										</h4>									
										<input type="text" class="filter seat capacity slider-filter-<% tabIndex %>" value="" filter="capacity" vehicle-identifier="<% tab.filters.class.identifier %>" initialize-ion-range-slider slider-attrs="filtersAttrs.seatCapacity" />
									</div>
									<div class="column">
										<h4 class="ui header">
											Doors
										</h4>									
										<input type="text" class="filter door count slider-filter-<% tabIndex %>" value="" filter="door" vehicle-identifier="<% tab.filters.class.identifier %>" initialize-ion-range-slider slider-attrs="filtersAttrs.doorCount" />
									</div>
									<div class="column">
										<h4 class="ui header">
											Storage
										</h4>									
										<input type="text" class="filter storage slider-filter-<% tabIndex %>" value="" filter="storage" vehicle-identifier="<% tab.filters.class.identifier %>" initialize-ion-range-slider slider-attrs="filtersAttrs.storage" />
									</div>
									<div class="column">
										<h4 class="ui header">
											Car Class
										</h4>									
										<div class="ui form car class">
											<div class="field" ng-repeat="choice in tab.filters.class.choices">
												<div class="ui checkbox checkbox-filter-<% tabIndex %>" checkbox-filter-action filter="class" vehicle-identifier="<% tab.filters.class.identifier %>" data-id="<% choice.id %>" data-choice-name="<% choice.name %>">
											    	<input type="checkbox" name="car_class">
									        		<label><% choice.name %></label>
									    		</div>
									    	</div>
										</div>
									</div>
									<div class="column">
										<h4 class="ui header">
											Vehicle Type
										</h4>
										<div class="ui form car category">
											<div class="field" ng-repeat="choice in tab.filters.category.choices">
												<div class="ui checkbox checkbox-filter-<% tabIndex %>" checkbox-filter-action filter="category" vehicle-identifier="<% tab.filters.category.identifier %>" data-id="<% choice.id %>" data-choice-name="<% choice.name %>">
											    	<input type="checkbox" name="car_category">
									        		<label><% choice.name %></label>
									    		</div>
									    	</div>
										</div>
									</div>
									<div class="supplier column">
										<h4 class="ui header">
											Car Suppliers
										</h4>
										<div class="ui form car supplier">
											<div class="field" ng-repeat="choice in tab.filters.supplier.choices">
												<div class="ui checkbox checkbox-filter-<% tabIndex %>" checkbox-filter-action filter="supplier" vehicle-identifier="<% tab.filters.supplier.identifier %>" data-id="<% choice.id %>" data-choice-name="<% choice.name %>">
											    	<input type="checkbox" name="car_supplier">
									        		<label>
														<img data-ng-src="{{ asset('themeBuilder/pages/resultPage/img/suppliers/icon-<% choice.name %>.gif') }}" />
									        		</label>
									    		</div>
									    	</div>
										</div>
									</div>
									<div class="depot column">
										<h4 class="ui header">
											Car Depots
										</h4>
										<div class="ui form car depot">
											<div class="field" ng-repeat="choice in tab.filters.depot.choices">
												<div class="ui checkbox checkbox-depot-filter-<% tabIndex %> checkbox-filter-<% tabIndex %>" checkbox-filter-action filter="depot" vehicle-identifier="<% tab.filters.depot.identifier %>" data-id="<% choice.id %>" lat="<% choice.coordinates.lat %>" lng="<% choice.coordinates.lng %>" data-choice-name="<% choice.name %>">
											    	<input type="checkbox" name="car_depot">
									        		<label>
														<img data-ng-src="{{ asset('themeBuilder/pages/resultPage/img/suppliers/icon-<% choice.supplierName %>.gif') }}" />
														<span class="supplier name"><% choice.name %></span>
														<br ng-if="choice.userDistance != ''" />
														<span class="user-distance" ng-if="choice.userDistance != ''">Car distance: <% choice.userDistance %> <% distanceUnit.value %></span>
														<!-- <p><% choice.userDistance %></p> -->													
									        		</label>
									    		</div>
									    	</div>
										</div>
									</div>
									<!-- <div class="column">
										<div class="ui black fluid button" clear-filter-button>
											Clear Filters
										</div>
									</div> -->
								</div>
							</div>
							<div class="twelve wide column">
								<div class="ui two column user distance grid">
									<div class="seven wide column user distance" style="padding-left:0">
										<p class="toptext">Please provide us your location to compute car distance</p>
										<div class="ui small form">
											<div class="inline fields">
												<div class="field" style="width: 90%">
													<div class="ui mini right labeled icon input">													
														<input type="text" placeholder="e.g. Brisbane" class="txt address" id="txt-address-<% tabIndex %>" user-location-action ng-model="tab.userLocation.location.value">
														<autocomplete data="tab.userLocations" selected="tab.userLocation.location"></autocomplete>
														<i class="loading icon" ng-if="tab.userLocationQuerying"></i>
													</div>
													<p class="toptext selected"> <span ng-if="tab.userLocation.location.selected != ''">Selected: </span> <% tab.userLocation.location.selected %></p>
										  		</div>
										  	</div>
									  	</div>								  	
									</div>
									<div class="nine wide view column">
										<div class="ui three column grid">
											<div class="seven wide column">
												<p class="toptext">Sort by</p>
												<div class="ui selection fluid dropdown sort" initialize-dropdown-action emit-name="sortListDropdownFinished" dropdown-model="tab.sort.column">
													<input type="hidden">
													<div class="default text">Sort by</div>
													<i class="dropdown icon"></i>
													<div class="menu">
														<div class="item" data-value="<% sortNode.id %>" ng-repeat="sortNode in sortList" emit-name="sortListDropdownFinished" watch-dropdown-item><% sortNode.label %></div>
													</div>
												</div>
											</div>
											<div class="four wide column">
												<div class="ui descending checkbox" sort-type-checkbox-action sort-reverse="tab.sort.reverse">
													<input type="checkbox">
													<label>Descending</label>
												</div>									 
											</div>
											<div class="five wide column">
												<div class="ui mini map button" map-view-button-action>
													<i class="fa fa-map-marker"></i> Map view
												</div>
											</div>
										</div>																											
									</div>
								</div>
								<div class="ui one column vehicles stackable grid">
									<!-- <div class="vehicle column" ng-repeat="vehicle in tab.vehicles | orderBy:tab.sort.column.value:tab.sort.reverse" ng-show="vehicle.is_shown == true"> -->
									<div class="vehicle column" ng-repeat="vehicle in tab.vehicles | orderBy:tab.sort.column.value:tab.sort.reverse" is-show-action="vehicle.is_shown">
										<div class="ui three column details grid">
											<div class="equal height three column row">
												<div class="three wide image detail column">
													<img class="car" ng-src="http://vroomvroomvroom.com.au/book/images/vehicles/<% vehicle.vehicleElemID %>.jpg" />
													<div class="ui one column grid">
														<div class="supplier column">
															<span>Supplied By</span>
															<img data-ng-src="{{ asset('themeBuilder/pages/resultPage/img/suppliers/icon-<% vehicle.supplierName %>.gif') }}" class="supplier logo" />
														</div>
													</div>
												</div>									
												<div class="six wide information detail column">
													<h4 class="ui header name">
														<% vehicle.vehicleName %>
														<div class="sub address header">
															<span>
																<i class="fa fa-plane enabled airport" ng-if="vehicle.depot_information.inAirport == 1" data-content="Car is in airport" data-variation="inverted" feature-action></i>
																<i class="fa fa-plane disabled airport" ng-if="vehicle.depot_information.inAirport != 1" data-content="Car is not in airport" data-variation="inverted" feature-action></i>
															</span>
															<% vehicle.depot_information.address %> | <span class="map" lat="<% vehicle.depot_information.lat %>" lng="<% vehicle.depot_information.lon %>" depot-address="<% vehicle.depot_information.address %>" show-car-from-map-action>SHOW MAP</span>
														</div>
													</h4>
													<div class="ui two column category grid">
														<div class="three wide column">
															<span>Category</span>
														</div>
														<div class="column">
															<span><% vehicle.categoryName %></span>
														</div>
													</div>
													<div class="ui two column class grid">
														<div class="three wide column">
															<span>Class</span>
														</div>
														<div class="column">
															<span><% vehicle.class %></span>
														</div>
													</div>
													<div class="ui one column additional grid">
														<div class="label column">
															<span>Features</span>
														</div>
														<div class="additional column">
															<span class="aircon">
																<i class="fa fa-asterisk enabled aircon" ng-if="vehicle.hasAircon == true" data-variation="inverted" data-content="Has airconditioner" feature-action></i>
																<i class="fa fa-asterisk disabled aircon" ng-if="vehicle.hasAircon != true" data-variation="inverted" data-content="Has no airconditioner" feature-action></i>
															</span>
															<span class="transmission" data-variation="inverted" data-content="<% vehicle.transmission.fullname %>" feature-action>
																<% vehicle.transmission.name %>
															</span>
															<span class="distance" data-variation="inverted" data-content="<% vehicle.distance %>" feature-action>
																<i class="fa fa-road distance"></i>
															</span>
															<span class="seater" data-variation="inverted" data-content="Seating capacity is <% vehicle.capacity %>" feature-action>
																<i class="fa fa-user seater"></i>
																<span class="count"><% vehicle.capacity %></span>
															</span>														
															<span class="door" data-variation="inverted" data-content="Door count is <% vehicle.door_count %>" feature-action>
																<img src="{{ asset('themeBuilder/pages/resultPage/img/icons/icon-door.png') }}" />
																<span class="count"><% vehicle.door_count %></span>
															</span>
															<span class="storage" data-variation="inverted" data-content="Car storage is <% vehicle.storage %>" feature-action>
																<i class="fa fa-suitcase storage"></i>
																<span class="count"><% vehicle.storage %></span>
															</span>
															<span class="user-distance">
																<div class="ui black label">
																	<span ng-if="(vehicle.userDistance == '')" data-variation="inverted" data-content="Please specify your location to enable this feature" feature-action>?</span>
																	<span ng-if="(vehicle.userDistance != '')" data-variation="inverted" data-content="Distance from your location" feature-action><% vehicle.userDistance %> <% distanceUnit.value %></span>
																</div>
															</span>														
														</div>
													</div>
												</div>
												<div class="three wide price detail column">
													<div class="ui price header">
														<% vehicle.currency %> <% vehicle.price %>
														<div class="sub header">														
															<% vehicle.currency %> <% (vehicle.price / 2) | priceFormatter %> /day
														</div>
													</div>
													<div class="ui fluid small primary book button">
														Book Now
													</div>
												</div>										
											</div>									
										</div>
										<!-- <div>
										</div> -->
									</div>							
								</div>
							</div>
						</div>
					</div>
					<div class="favorite column" ng-controller="FavoritesController">
						<div class="one column favorite tab grid">
							<div class="column">
								<h4 class="ui header">
									Favourite Tabs
								</h4>
							</div>
							<div class="column favorites list">
								<div ng-repeat="favoriteTab in favoriteTabs">
									<p class="location"><% favoriteTab.pickupLocation.value %></p>
									<p class="date">
										<% favoriteTab.pickupDate.display %> to
										<% favoriteTab.returnDate.display %>
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- <div class="partner footer" ng-controller="PartnerFooterController" page-footer-action="{{ $guid }}">
		</div> -->
		<div class="partner footer" html-builder current-html="currentHtml" current-html-type="htmlType" html-type="footer" show-modal = "showHtmlBuilderModal">
			@include('pages.partnerHtml.'.$guid.'.'.$pageFileName.'.footer')
		</div>

		<!-- This is for HtmlBuilder -->
		<html-builder-modal current-html="currentHtml" current-html-type="htmlType" show-modal = "showHtmlBuilderModal"></html-builder-modal>
		<!-- This is for HtmlBuilder -->

		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/jquery.min.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/angularjs/angular.min.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/semantic_ui/semantic.min.js') }}"></script>
		<script type="text/javascript" language="javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDDEDYiOI7-uFsbP8bgvzlkP4aRTF21Tqw&sensor=true&libraries=geometry,places"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/underscore/underscore-min.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/angularjs/angular-google-maps.min.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/angularjs/angular-sanitize.min.js') }}"></script>

		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/ion.rangeSlider.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/jquery-ui.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/m_datepicker/jquery.plugin.min.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/jquery/m_datepicker/jquery.datepick.min.js') }}"></script>
		
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/mobiscroll/mobiscroll.core.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/mobiscroll/mobiscroll.scroller.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/mobiscroll/mobiscroll.scroller.ios7.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vendor/mobiscroll/mobiscroll.datetime.js') }}"></script>
		
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/global/autocomplete.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/global/directive.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/global/service.js') }}"></script>
		
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/customer/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/age/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/country/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/location/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/vehicles/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/currency/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/distanceUnit/service.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/localstorage/service.js') }}"></script>
		
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/results/controller.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/results/service.js') }}"> </script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/results/directive.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/results/filter.js') }}"></script>
		<script type="text/javascript" language="javascript" src="{{ asset('themeBuilder/pages/resultPage/js/results/app.js') }}"></script>
	
		<!-- This is for CodeMirror -->
		<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/lib/codemirror.js') }}"></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/addon/hint/show-hint.js') }}"></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/addon/hint/xml-hint.js') }}"></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/addon/hint/html-hint.js') }}"></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/mode/xml/xml.js') }}"src=""></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/mode/javascript/javascript.js') }}"></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/mode/css/css.js') }}"src=""></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/vendor/codemirror/mode/htmlmixed/htmlmixed.js') }}"></script>
	  	<!-- This is for CodeMirror -->

	  	<!-- This is for HtmlBuilder -->
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/themeBuilder/htmlBuilder.js') }}"></script>
	  	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/themeBuilder/angularBackgroundSelector_.js') }}"></script>
	  	<script>
			guid = '{{$guid}}';
			pageFileName = '{{$pageFileName}}';
			baseUrl = '{{asset("/")}}';
			siteID = '{{$siteID}}';
		</script>
		<!-- This is for HtmlBuilder -->

	</body>
</html>