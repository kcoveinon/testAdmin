<div ng-controller="reconciliationPageController">
    <div class="ui header">Reconciliation Page</div>
    <div ng-if="!forProcessList.forProcessFolders.length">
        <span ng-if="!recordsLoaded">Loading records...</span>
        <span ng-if="recordsLoaded">No records found</span>
    </div>
    <div class="ui styled fluid accordion" ng-if="forProcessList.forProcessFolders.length" folders-accordion>
        <div class="title" ng-repeat-start="folder in forProcessList.forProcessFolders" folders-accordion-finish-render>
            <i class="folder icon"></i>
            [[folder.monthToProcess]]
        </div>
        <div class="content" ng-repeat-end>
            <div class="ui divided list">
              <div class="item" ng-repeat="file in forProcessList.forProcessList | filter:folder.monthToProcess">
                <div class="right floated compact ui tiny blue button" process-file process-file-id="[[file.filesUploadedID]]" process-file-code="[[file.fileCode]]" process-month="[[file.monthToProcess]]">Process</div>
                <div class="content">
                  <div class="header" style="color:#444444">[[file.fileName]]</div>
                </div>
              </div>
            </div>
        </div>
    </div>

</div>
