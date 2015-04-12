<div ng-controller = 'postReconciliationDetailsController'>
	<j-grid
        grid-columns="postReconciliationDetailsColumns"
        grid-id="postReconciliationDetails"
        grid-limit="10"
        grid-offset="0"
        grid-url="reconciliation/post-reconciliation-show-details/{{$fileID}}"
        grid-method="GET"
        grid-height="200px"
    ></j-grid>
</div>