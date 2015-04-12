<div id="upload-area" ng-controller="reconciliationController">
    <style>
        .ui-datepicker-calendar {
            display: none;
        }
    </style>
    <div class="ui header">Reconciliation - Import Files</div>
    <span>Select Month:</span>
    <div class="ui small icon input month-to-process">
        <input ng-model="monthToProcess" type="text" placeholder="Select month to process" month-to-process />
        <i class="black inverted calendar icon"></i>
    </div>
    <button class="ui small green button upload-button">
        <i class="plus icon"></i>
        Add files...
    </button>
    <div class="ui small blue button" start-multiple-upload>
        <i class="upload icon"></i>
        Start upload
    </div>
    <div class="ui small orange button" start-multiple-cancel>
        <i class="stop icon"></i>
        Cancel upload
    </div>
    <!--div class="ui small teal button" reconciliation-page>
        <i class="refresh icon"></i>
        Reconcile Files
    </div-->

    <div id="preview-area" class="ui divided list">
    </div>
</div>
