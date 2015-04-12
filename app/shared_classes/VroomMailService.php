<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of VroomMailServices
 *
 * @author dcarungay
 */
class VroomMailServices {
    
    public static function sendNotificationEmail($email_template, $email_type, $data){
//        $data = array(
//            'name' => 'Dan',
//            'supplierConfirmation' => 'AV468465SS21',
//        );
//        Mail::send('emails.booking', $data, function($message){
//            $message->to('dgcarungay@gmail.com', 'Dan Carugay')->subject('Your Vroomvroomvroom booking was updated!');
//        });
        $mail_credentials = Config::get('global/mail_accounts.'.$email_type);
        Mail::send($email_template, $data, function($message) use($mail_credentials, $data) {
            $message->from($mail_credentials['email'], $mail_credentials['name']);
            $message->to($data['email'], $data['name'])->subject($data['subject']);
        });
    }
}