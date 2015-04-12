<div class="ui form">
    <div class="field">
        <label>Login/View As:</label>
        <dropdown-list
            ng-model ="frmPartnerID" 
            list="company in companyList"
            list-display="company.companyName"
            list-value="company.companyID"
            dropdown-class="ui selection dropdown"
            dropdown-style="font-size:14px"
            placeholder = "Select Partner"
            testing = "companyList"
        ></dropdown-list>
    </div>
</div>