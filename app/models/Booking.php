<?php

class Booking extends BaseModel {

    protected $table = "booking";
    protected $primaryKey = 'bookingID';

    public static function getCustomerEmailWithUpcomingBooking($dateFrom, $dateTo) {

        $qBuilder = self::select('customer_email','customer_firstName','customer_lastName')
            ->where('datePickedUp', '>=', $dateFrom)
            ->where('datePickedUp', '<', $dateTo);
        
        return $qBuilder->get();
    }
 	
 	public static function getBookingCommissionAmount($supplierConfirmation) {

        $record = self::select('commissionAmount')
            ->where('supplierConfirmation', '=', $supplierConfirmation)
            ->get();

        return $record;
    }
 	
}
