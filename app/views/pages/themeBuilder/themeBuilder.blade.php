	<div class="window" ng-controller="themeBuilderController" style="position:fixed; top:75px; right:0px; left:0px; bottom:0px; background-color:#ffffff;" main-window>
		<script>
			siteID = '{{$siteID}}';
		</script>
		
		<div class="mainDiv" >
			<page-list-modal></page-list-modal>
			<div class="generatorDivWrapper hideOnMouseIdle" side-bar="sideBarStatus" hide-on-mouse-idle>
				<div class="generatorDiv" the-configurator></div>
				<div class="fadingTop"></div>
				<div class="fadingBottom"></div>
				<div class="saveTheme" ng-click="saveTheme()" save-theme>Save Theme</div>
			</div>
			<div class="generatorDivSwitch hideOnMouseIdle ui black huge launch right attached button" side-bar-toggle tile-button>
				<i class="icon magic"></i>
				<span class="text" >Menu</span>
			</div>
			<div class="pageSelect hideOnMouseIdle ui black launch right attached button" tile-button page-select>
				<i class="icon list layout"></i>
				<span class="text" >Page Selection</span>
			</div>
			<div class="resizeWindow hideOnMouseIdle ui black launch right attached button" tile-button resize-window>
				<i class="icon desktop"></i>
				<span class="text" >Toggle Screen</span>
			</div>
			<div class="revertChanges hideOnMouseIdle ui black launch right attached button" tile-button revert-changes>
				<i class="icon refresh"></i>
				<span class="text" >Revert Changes</span>
			</div>
			<div class="restoreDefault hideOnMouseIdle ui black launch right attached button" tile-button restore-default>
				<i class="icon refresh"></i>
				<span class="text" >Restore Default</span>
			</div>
			<div class="googleAnalytics hideOnMouseIdle ui black launch right attached button" tile-button google-analytics>
				<i class="icon code"></i>
				<span class="text" >Google Analytics</span>
			</div>
			<div class="body formDiv">
				<iframe id="iframeStylePreview" src="" style="width:100%; height:98%; padding:0; border:0;" iframe-style-preview></iframe>
			</div>		
		</div>

		<!-- This is for HtmlBuilder -->
		<html-builder-modal current-html="currentHtml" current-html-type="htmlType" show-modal = "showHtmlBuilderModal" page-selected = "pageSelected"></html-builder-modal>
		<!-- This is for HtmlBuilder -->
	</div>

