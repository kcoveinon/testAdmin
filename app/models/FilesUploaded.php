
<?php

class FilesUploaded extends BaseModel {
    protected $table = "filesUploaded";
    protected $primaryKey = 'filesUploadedID';

    protected $guarded = array('id', 'filesUploadedID');

    public static function saveUploadedFile($inputs) {

    	//var_dump ($inputs);
        self::create($inputs);
        
        //return $id;
    }

    public static function getForProcessList() {
    
        $qBuilder = self::select('filesUploadedID','fileName','fileCode','monthToProcess')
            ->where('filesUploaded_statusID', '=', 1);
        
        return $qBuilder->get();
        
    }

    public static function getForProcessFolders() {
    
        $qBuilder = self::select('monthToProcess')
            ->where('filesUploaded_statusID', '=', 1)
            ->groupBy('monthToProcess');
        
        return $qBuilder->get();
        
    }

    public static function getProcessedList() {
    
        $qBuilder = self::select('filesUploadedID','fileName','goodRecords','monthToProcess')
            ->where('filesUploaded_statusID', '=', 2);
        
        return $qBuilder->get();
        
    }

    public static function getProcessedFolders() {
    
        $qBuilder = self::select('monthToProcess')
            ->where('filesUploaded_statusID', '=', 2)
            ->groupBy('monthToProcess');
        
        return $qBuilder->get();
        
    }

    public static function getCompletedList() {
    
        $qBuilder = self::select('filesUploadedID','fileName','filesUploaded_statusID','monthToProcess')
            ->where('filesUploaded_statusID', '>', 2);
        
        return $qBuilder->get();
        
    }

    public static function getCompletedFolders() {
    
        $qBuilder = self::select('monthToProcess')
            ->where('filesUploaded_statusID', '>', 2)
            ->groupBy('monthToProcess');
        
        return $qBuilder->get();
        
    }

    public static function getFileSummary($fileID){

        $qBuilder = self::select('fileName', 'totalBooking', 'totalExistingBooking', 'totalUnknownBooking', 'toleranceRateLow', 'toleranceRateHigh', 'totalOutOfToleranceRangeBookingLow', 'totalOutOfToleranceRangeBookingHigh', 'totalCommissionCostExpected', 'totalCommissionCostFile', 'totalCommissionCostDifference')
            ->where('filesUploadedID', '=', $fileID);
        
        return $qBuilder->get()->toArray()[0];

    }

    public static function getFileName($fileID){

        $qBuilder = self::select('fileName')
            ->where('filesUploadedID', '=', $fileID);
        
        return $qBuilder->get()->toArray()[0];

    }

    public static function setFileProcessed($fileID, $goodRecords) {
    
        self::where('filesUploadedID', '=', $fileID)
            ->update(array('filesUploaded_statusID'=>2, 'goodRecords'=>$goodRecords));

    }

    public static function setProcessedAndSaveSummary($fileID, $summary) {

        $summary['filesUploaded_statusID'] = 2;
    
        self::where('filesUploadedID', '=', $fileID)
            ->update($summary);

    }

    public static function setFileStatus($fileID, $newStatus) {
    
        self::where('filesUploadedID', '=', $fileID)
            ->update(array('filesUploaded_statusID'=>$newStatus));

    }
 
}