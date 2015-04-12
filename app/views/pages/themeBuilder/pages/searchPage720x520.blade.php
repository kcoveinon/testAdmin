<!DOCTYPE html>
<html lang="en">
<head>
	<script type="text/javascript" src="{{ asset('themeBuilder/searchPageWidget/angular.min.js') }}"></script>
	<script type="text/javascript" src="{{ asset('themeBuilder/searchPageWidget/jquery.min.js') }}"></script>
	<script type="text/javascript" src="{{ asset('themeBuilder/pages/searchPage720x520/jquery.datetimepicker.js') }}"></script>
	<script type="text/javascript" src="{{ asset('themeBuilder/searchPageWidget/semantic.min.js') }}"></script>

	<link href="{{ asset('themeBuilder/pages/searchPage720x520/searchForm.css') }}" rel="stylesheet"/>
	<link href="{{ asset('themeBuilder/pages/searchPage720x520/effects.css') }}" rel="stylesheet"/>
	<link href="{{ asset('themeBuilder/pages/searchPage720x520/jquery.datetimepicker.css') }}" rel="stylesheet"/>
	<link href="{{ asset('themeBuilder/searchPageWidget/semantic.css') }}" rel="stylesheet"/>

	<link rel="stylesheet" type="text/css" href="{{ asset('assets/css/themeBuilder/pages/themeBuilder.css') }}" />
	<style id="iframeStylePreview">
	</style>
</head>

<body>
<div id="searchPage720x520" class="body" style="width:100%">
	<div class="widget sp720x520-box1 sp720x520-box-effect1">
		<div class="sp720x520-box2 sp720x520-pickup">
			<div class="sp720x520-text1 sp720x520-text-effect1">Pickup</div>
			<div>
				<span style="color:#888888;">Please select your pickup location</span> <br>
				City: 
				<div class="ui icon input">	
					<input class="selectedPickupLocation" type="text" ng-model="selectedPickupLocation.value" pickup-location-action>
					<autocomplete data="locationList" selected="selectedPickupLocation"></autocomplete>
					<i class="loading icon" ng-if="autocompleteLoading"></i>
				</div>
					<!--input 	
							class="searchBox sp720x520-input-effect1 sp720x520-othereffects1" 
							type="text" 
							name="frmPickupLocationDisplay" 
							id="frmPickupLocationDisplay" 
							ng-model="SelectPickupLocation" 
							placeholder="Select Pickup Location" 
						-->
				<!--input name="frmPickupLocationID" id="frmPickupLocationID" ng-model="SelectedPickupID"  ng-hide="hidden" style="display:none;"-->
				
			</div>
			<div style="display:inline-block; position:absolute; top:140px;">
				<input type="text" name="frmPickupDateTime" id="frmPickupDateTime" value="" ng-model="frmPickupDateTime">
			</div>
		</div>
		<div class="sp720x520-box2 sp720x520-return">
			<div class="sp720x520-text1 sp720x520-text-effect1">Return</div>
			<div>
				<span style="color:#888888;">Return to the same location:</span>
				<input 
					type="checkbox" 
					name="frmRet2SameLoc" 
					id="frmRet2SameLoc" 
					ng-model="hideRetLoc" 
					ng-click="isCollapsed = !isCollapsed; SelectedReturnID = SelectedPickupID;" 
					disabled="disable"
				>
				<div ng-hide="isCollapsed" class="return-location">
					City:	<input 	
								class="searchBox sp720x520-input-effect1 sp720x520-othereffects1" 
								type="text" 
								name="frmReturnLocationDisplay"
								id="frmReturnLocationDisplay"
								ng-model="SelectReturnLocation" 
								placeholder="Select Return Location"
							>
					<input name="frmReturnLocationID" id="frmReturnLocationID" ng-model="SelectedReturnID" ng-hide="hidden" style="display:none;">
				</div>
				
			</div>
			<div style="display:inline-block; position:absolute; top:140px;">
				<input type="text" name="frmReturnDateTime" id="frmReturnDateTime" value="" ng-model="frmReturnDateTime" >
			</div>
		</div>
		<div class="sp720x520-box3">
			I Live in:
			<select name="frmCitizenCountryID" id="frmCitizenCountryID" class="sp720x520-ddlist-effect1" style="width:50%; margin-right:100px;" ng-model="frmCitizenCountryID" >
				<option value='AU'>Australia</option>
			</select>

			Driver Age:
			<select name="frmDriverAge" id="frmDriverAge" class="sp720x520-ddlist-effect1" style="width:11%;" ng-model="frmDriverAge" >
				<option value="25">25+</option>
			</select>
			<input name="frmPartnerID" id="frmPartnerID" ng-model="partnerID" ng-hide="hidden" style="display:none;">
			<input type="submit" name="btnSearchVehicles" id="btnSearchVehicles" value="Search Vehicles" class="sp720x520-button1 sp720x520-button-effect1" ng-model="btnSearchVehicles" ng-click="searchVehiclesAJAX()">
		</div>
	</div>


	<script>
		$('#frmPickupDateTime').datetimepicker({
			inline: true,
			format: 'Y-m-d H:i:00'
		});
		
		$('#frmReturnDateTime').datetimepicker({
			inline: true,
			format: 'Y-m-d H:i:00'
		});		
	</script>

	<script type="text/javascript" language="javascript" src="{{ asset('assets/js/themeBuilder/pages/themeBuilder.js') }}"></script>
	
</div>
</body>
</html>

