<?php

class ReconciliationController extends BaseAdminController {

    public function getImportFiles() {
        return View::make('pages.reconciliation.importFiles');      
    }

    public function postUpload() {

        $file = Input::file('file');
        $monthToProcess = Input::get('monthToProcess');
        $originalFileName = $file->getClientOriginalName();
        $extension = File::extension($file->getClientOriginalName());
        $savedFileName = "fileUploaded".uniqid().'.'.$extension;
        $tempFilesPath = app_path().'/temporary_files/'.$monthToProcess;

        $upload_success = $file->move($tempFilesPath, $savedFileName); 
        
        $inputs = array(
            'fileName'=>$originalFileName,
            'fileCode'=>$savedFileName,
            'monthToProcess'=>$monthToProcess,
            'filesUploaded_statusID'=>1
        );
        
        FilesUploaded::saveUploadedFile($inputs);
        
    }
    
    public function getForProcessList() {
    
        $forProcessList = FilesUploaded::getForProcessList();
        $forProcessFolders = FilesUploaded::getForProcessFolders();
        
        $forProcessList=array(
            'forProcessList'=>$forProcessList,
            'forProcessFolders'=>$forProcessFolders
        );

        return $forProcessList;
    }

    public function getProcessedList() {
    
        $processedList = FilesUploaded::getProcessedList();
        $processedFolders = FilesUploaded::getProcessedFolders();
        
        $processedList=array(
            'processedList'=>$processedList,
            'processedFolders'=>$processedFolders
        );

        return $processedList;
    }

    public function getCompletedList() {
    
        $completedList = FilesUploaded::getCompletedList();
        $completedFolders = FilesUploaded::getCompletedFolders();
        
        $completedList=array(
            'completedList'=>$completedList,
            'completedFolders'=>$completedFolders
        );

        return $completedList;
    }

    public function postProcessFile() {
        
        $fileID = Input::get('fileID');
        $fileCode = Input::get('fileCode');
        $processMonth = Input::get('processMonth');
        //var_dump($processMonth);
        $path = app_path().'/temporary_files/'.$processMonth;

        $file = File::get($path.'/'.$fileCode);

        $fh = fopen($path.'/'.$fileCode, 'r' ); // 1

        $inputs = array();

        if( $fh ) { 

            while ( ( $row = fgetcsv( $fh ) ) !== false ) { // 3


               /* array_push($inputs, array(
                    'filesUploadedID'=>$fileID,
                    'supplierConfirmation'=>$row[0],
                    'commissionCostFile'=>$row[1],
                    'currencyCode'=>$row[2],
                    'bookingStatus'=>'',
                    'filesUploaded_record_statusID'=>1
                ));*/

                
                $inputs = array(
                    'filesUploadedID'=>$fileID,
                    'supplierConfirmation'=>$row[0],
                    'commissionCostFile'=>$row[1],
                    'currencyCode'=>$row[2],
                    'bookingStatus'=>'',
                    'filesUploaded_record_statusID'=>1
                );
                
                FilesUploadedRecord::saveFileRecord($inputs);

                //var_dump($supplierConfirmation);
                
                //$bookingCommissionAmount = Booking::getBookingCommissionAmount($supplierConfirmation);

                //var_dump($bookingCommissionAmount);
                //echo '<br>';

            }

            //var_dump($inputs);

            //FilesUploadedRecord::saveFileRecord($inputs);

            //FilesUploadedRecord::verifyRecords($inputs); //Verify the records first if okay for reconciliation (Not yet available. For discussion)

            FilesUploadedRecord::reconcileFileRecords($fileID);

            //FilesUploadedRecord::createUnseenRecords($inputs); //Create booking for records that doesn't exist (Not yet available. For discussion)

            //$goodRecords = FilesUploadedRecord::getGoodRecords($fileID);
            
            $summary = FilesUploadedRecord::getSummary($fileID);

            //var_dump($summary);

            //var_dump($goodRecords);

            //FilesUploaded::setFileProcessed($fileID, $goodRecords);


            FilesUploaded::setProcessedAndSaveSummary($fileID, $summary);
            //return $summary;


          
        }

        fclose( $fh );
        
        //return 'done';
        return 'done';
        //var_dump($files);
        //return $forProcessList;
    }

    public function postPostProcessFile() {

        $fileID = Input::get('fileID');
        $action = Input::get('action');
        $newStatus = ($action==='Save') ? 3 : 4;

        FilesUploaded::setFileStatus($fileID, $newStatus);

    }

    public function postPostReconciliationShowSummary(){

        $fileID = Input::get('fileID');
        $summary = FilesUploaded::getFileSummary($fileID);

        return $summary;

    }

    public function getPostReconciliationDetailsView($fileID){

        return View::make('pages.reconciliation.postReconciliationDetails')->with('fileID',$fileID);   

    }

    public function postPostReconciliationShowDetails(){

        $fileID = Input::get('fileID');
        $summary = FilesUploaded::getFileName($fileID);

        return $summary;

    }

    public function getPostReconciliationShowDetails($fileID, $grid_variables = array()){

        $base_columns = array(
            'PRDSupplierConfirmation' => 'filesUploaded_record.supplierConfirmation',
            'PRDCurrencyCode' => 'filesUploaded_record.currencyCode',
            'PRDCommissionCost' => 'filesUploaded_record.commissionCostFile',
            'PRDCommissionCostExpected' => 'filesUploaded_record.commissionCostExpected',
            'PRDDifference' => 'filesUploaded_record.commissionCostDifference',
        );
        JGrid::initialize($grid_variables, $base_columns);
        $details = FilesUploadedRecord::getFileDetailsGrid($grid_variables, $fileID);
        return Response::json($details);

    }
}

