<div ng-controller="completedFilesController">
    <div class="ui header">Completed Files</div>
    <div ng-if="!completedList.completedFolders.length">
        <span ng-if="!recordsLoaded">Loading records...</span>
        <span ng-if="recordsLoaded">No records found</span>
    </div>
    <div class="ui styled fluid accordion" ng-if="completedList.completedFolders.length" folders-accordion>
        <div class="title" ng-repeat-start="folder in completedList.completedFolders" folders-accordion-finish-render>
            <i class="folder icon"></i>
            [[folder.monthToProcess]]
        </div>
        <div class="content" ng-repeat-end>
            <div class="ui divided list">
              <div class="item" ng-repeat="file in completedList.completedList | filter:folder.monthToProcess">
                <div class="right floated compact" style="color:[[(file.status == 'Saved' ? 'green' : 'red')]]">[[file.status]]</div>
                <div class="content">
                  <div class="header" style="color:#444444">[[file.fileName]]</div>
                </div>
              </div>
            </div>
        </div>
    </div>

</div>
