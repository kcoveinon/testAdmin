<div class="ui modal">
	<div class="header ng-cloak" ng-cloak>
		[[content.title]]
	</div>
	<div class="content">
		<div class="ui inverted dimmer" custom-dimmer watch="content.body.dimmer">
			<div class="ui medium text loader">Loading</div>
		</div>
		<div custom-modal-content="content.body">
		</div>
	</div>
	<div class="actions">
		<div style="display:inline-block;" ng-repeat="action in content.actions.custom" compile-button="action"></div>
		<div class="ui button [[content.actions.approve.class]]" ng-show="content.actions.approve.show">[[content.actions.approve.name]]</div>
		<div class="ui button [[content.actions.deny.class]]" ng-show="content.actions.deny.show">[[content.actions.deny.name]]</div>
		<div class="ui button [[content.actions.close.class]]" ng-show="content.actions.close.show">[[content.actions.close.name]]</div>
	</div>
</div>