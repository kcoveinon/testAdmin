<!DOCTYPE html>
<html lang="en-US">
	<head>
		<meta charset="utf-8">
	</head>
	<body>

		<div>
			<p>Hi</p>
			<p>Thank you for booking with VroomVroomVroom!</p>
			<p>The requested equipment for Reservation {{$confirmationNumber}} is added to your booking by Redspot.</p>
			<ul>
			@foreach($extras as $extra)
			   <li>{{$extra['name']}}({{$extra['status']}}) x {{$extra['quantity']}} = {{$extra['total']}}</li> 
			@endforeach
			</ul>
			<p>The new total cost of your booking is {{$currency}} {{$totalPrice}}</p>
			<p>*Please be sure to check all straps for child seats are secure before leaving Pickup location.</p>
			<p>Reminder:
				<br>
				*Optional extra's attract the local depot tax and surcharges as per the supplier Terms and Conditions. "<span href="{{$termsAndConditionsLink}}">Click here for TnCs(tnc)</span>"
			</p>
			<p>*The automated reminder email sent 48 hours prior to pickup does not include amendments to bookings or the extra equipment details. Our team contacted the supplier direct on your behalf.</p>
		</div>
	</body>
</html>
