<!DOCTYPE html>
<html>
    <head>
        <meta charset="UTF-8">
        <title></title>
    </head>
    <body>
        <div>
            
            <p> 
                Hi {{ $name }},                
                <br/><br/>
                Your password has been successfully changed. You could proceed to login <a href="{{ $vroomAdminLink }}" target="_blank">here</a>
                <br /><br />
                <span style="color: #777; font-style:italic">Disclaimer: this is an automated e-mail. Please do not reply.</span>
            </p>            
        </div>
    </body>
</html>
