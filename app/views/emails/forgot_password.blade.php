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
                To proceed in creating a new password, please access this link <a href="{{ $forgotPasswordLink }}" target="_blank">{{ $forgotPasswordLink }}</a>
                <br /><br />
                The link will expire once you've succesfully create your new password.
                <br /><br />
                <span style="color: #777; font-style:italic">Disclaimer: this is an automated e-mail. Please do not reply.</span>
            </p>            
        </div>
    </body>
</html>
