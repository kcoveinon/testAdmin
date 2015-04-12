$('script').load(function () { 

	function getCurrentDate(){
		var currentDate = new Date();
		var dd = currentDate.getDate();
		var mm = currentDate.getMonth()+1;
		var yyyy = currentDate.getFullYear();

		if(dd<10) {
			dd='0'+dd;
		} 

		if(mm<10) {
			mm='0'+mm;
		} 

		currentDate = yyyy+'-'+mm+'-'+dd;
		
		return currentDate;
	}

	function reloadPickupDateTime(){
		var currentDate = getCurrentDate();
		
		pickupDateTimeValue = $('#frmPickupDateTime').val();
		pickupDate = pickupDateTimeValue.substring(0,10);
		
		if(currentDate<pickupDate){
			returnMinTime= false;
		}else{
			returnMinTime = 0;
		}
		
		$('#frmPickupDateTime').datetimepicker({
			inline:true,
			minDate: 'today',
			minTime: returnMinTime,
			format: 'Y-m-d H:i:00',
			roundTime:'ceil',
			step:15,
			scrollMonth:false,
			onChangeDateTime:function(){
				$('#frmReturnDateTime').datetimepicker('destroy');
				reloadReturnDateTime();
				$('#frmPickupDateTime').datetimepicker('destroy');
				reloadPickupDateTime();
		   }
		});
	}

	function reloadReturnDateTime(){
		pickupDateTimeValue = $('#frmPickupDateTime').val();
		pickupDate = pickupDateTimeValue.substring(0,10);
		pickupTime = pickupDateTimeValue.substring(11);
		
		if($('#frmReturnDateTime').val() < $('#frmPickupDateTime').val()){
			returnDateTimeValue = $('#frmPickupDateTime').val();
		}else{
			returnDateTimeValue = $('#frmReturnDateTime').val();
		}
		
		returnDate = returnDateTimeValue.substring(0,10);
		
		returnMinDate = pickupDate;
		if(pickupDate>=returnDate){
			returnMinTime = pickupDate;
		}else{
			returnMinTime = false;
		}
		
		$('#frmReturnDateTime').datetimepicker({
			inline:true,
			value: returnDateTimeValue,
			minDate: returnMinDate,
			minTime: returnMinTime,
			format: 'Y-m-d H:i:00',
			roundTime:'ceil',
			step:15,
			scrollMonth:false,
			onChangeDateTime:function(){
				$('#frmReturnDateTime').datetimepicker('destroy');
				reloadReturnDateTime();
			}
		});
	}


	reloadPickupDateTime();
	reloadReturnDateTime();
	
});