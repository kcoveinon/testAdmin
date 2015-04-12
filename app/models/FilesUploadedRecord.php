
<?php

class FilesUploadedRecord extends BaseModel {
    protected $table = "filesUploaded_record";
    protected $primaryKey = 'filesUploaded_recordID';

    protected $guarded = array('id', 'filesUploaded_recordID');

    public static function saveFileRecord($inputs) {
  
        self::create($inputs);
        //self::firstOrCreate($inputs);
        

    }

    public static function getGoodRecords($fileID) {

        $totalRecords = count(self::where('filesUploadedID', '=', $fileID)->get());
        $goodRecords = count(self::where('filesUploadedID', '=', $fileID)->where('isRecordOk', '=', 1)->get());

        return ($goodRecords/$totalRecords)*100;

    }

    public static function getSummary($fileID) {

        //$totalRecords = count(self::where('filesUploadedID', '=', $fileID)->get());
        //$goodRecords = count(self::where('filesUploadedID', '=', $fileID)->where('isRecordOk', '=', 1)->get());

        $queryResult = self::select(
                DB::raw('count(*) as totalBooking'),
                DB::raw('sum(isRecordOk) as goodRecords'),
                DB::raw('sum(isRecordExisting) as totalExistingBooking'),
                DB::raw('sum(commissionCostExpected) as totalCommissionCostExpected'),
                DB::raw('sum(commissionCostFile) as totalCommissionCostFile'),
                DB::raw('sum(commissionCostDifference) as totalCommissionCostDifference')
            )
            ->where('filesUploadedID', '=', $fileID)
            ->get()->toArray();

        
        $summary = $queryResult[0];

        $summary['goodRecords'] = ($summary['goodRecords']/$summary['totalBooking'])*100;
        $summary['totalUnknownBooking'] = $summary['totalBooking'] - $summary['totalExistingBooking'];
        $summary['toleranceRateLow'] = 5;
        $summary['toleranceRateHigh'] = 5;

        $summary['totalOutOfToleranceRangeBookingLow'] = count(self::where('filesUploadedID', '=', $fileID)->where('commissionCostFile','<',DB::raw('`commissionCostExpected` * '.strval(100-$summary['toleranceRateLow'])/100))->get());
        $summary['totalOutOfToleranceRangeBookingHigh'] = count(self::where('filesUploadedID', '=', $fileID)->where('commissionCostFile','>',DB::raw('`commissionCostExpected` * '.strval(100+$summary['toleranceRateHigh'])/100))->get());
        
        /*echo "<pre>";
        print_r(DB::getQueryLog());
        echo "</pre>";die();*/

        return $summary;
        //return $qBuilder->get();

        //return ($goodRecords/$totalRecords)*100;
        
    }

    public static function reconcileFileRecords($fileID) {

        /*with(new Booking)->timestamps = false;
        
        self::where('filesUploadedID', '=', $fileID)
            ->join('booking', 'filesUploaded_record.supplierConfirmation', '=', 'booking.supplierConfirmation')
            ->update(array(
                'filesUploaded_record.status' => 'Reconciled',
                'filesUploaded_record.isRecordOk' => DB::raw('IF(filesUploaded_record.commissionAmount=booking.commissionAmount, 1, 0)')
            ))
            ->get();*/
        
        //We are using query builder for now to avoid the updated_at ambiguity error
        /*
        return DB::Table('filesUploaded_record')
            ->join('booking', 'filesUploaded_record.supplierConfirmation', '=', 'booking.supplierConfirmation')
            ->where('filesUploaded_record.filesUploadedID', 'booking.supplierConfirmation')
            ->get();
        */
        
        $FilesUploadedRecordTable = self::getTableName();
        $BookingTable = Booking::getTableName();

        DB::Table($FilesUploadedRecordTable)
            ->leftJoin($BookingTable, $FilesUploadedRecordTable . '.supplierConfirmation', '=', $BookingTable . '.supplierConfirmation')
            ->where($FilesUploadedRecordTable . '.filesUploadedID', $fileID)
            ->where($FilesUploadedRecordTable . '.filesUploaded_record_statusID', 1)
            //->where($BookingTable . '.isReconciliated', 0) //This is commented for now to include the records that are not in the database. Later on, we should create the records first before going to this process
            ->update(array(
                $FilesUploadedRecordTable . '.commissionCostExpected' =>  DB::raw('`'.$BookingTable . '`.commissionAmount'),
                $FilesUploadedRecordTable . '.commissionCostDifference' =>  DB::raw('`'.$FilesUploadedRecordTable.'`.commissionCostFile - IF(`'.$BookingTable.'`.bookingID IS NULL, 0,`'.$BookingTable.'`.commissionAmount)'),
                $FilesUploadedRecordTable . '.filesUploaded_record_statusID' => 2,
                $FilesUploadedRecordTable . '.updated_at'=>date('Y-m-d H:i:s'),
                $FilesUploadedRecordTable . '.isRecordOk' => DB::raw('IF((`'. $FilesUploadedRecordTable .'`.commissionCostFile)*0.95<=`' . $BookingTable . '`.commissionAmount && (`' . $FilesUploadedRecordTable . '`.commissionCostFile)*1.05>=`' . $BookingTable . '`.commissionAmount , 1, 0)'),
                $FilesUploadedRecordTable . '.isRecordExisting' => DB::raw('IF(`'.$BookingTable.'`.bookingID IS NULL, 0, 1)')
            ))
        ;
        

    }


    public static function getFileDetailsGrid($grid_variables = array(), $fileID = null) {

        $qBuilder = self::select($grid_variables['columns'])->where('filesUploadedID', '=', $fileID);
        $arr = JGrid::process($grid_variables, $qBuilder);
        
        return $arr;
        

    }
    
   
 
}