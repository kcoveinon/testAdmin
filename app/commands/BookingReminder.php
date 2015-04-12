<?php

use Illuminate\Console\Command;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Input\InputArgument;

class BookingReminder extends Command {

	/**
	 * The console command name.
	 *
	 * @var string
	 */
	protected $name = 'user:send-booking-reminder';

	/**
	 * The console command description.
	 *
	 * @var string
	 */
	protected $description = 'This will send email to the customers with booking for tomorrow';

	/**
	 * Create a new command instance.
	 *
	 * @return void
	 */
	public function __construct()
	{
		parent::__construct();
	}

	/**
	 * Execute the console command.
	 *
	 * @return mixed
	 */
	public function fire()
	{


		$email_type = 'notification';
        $email_template = 'emails.booking.bookingReminder';
        //$data = Booking::getBookingBySupplierConfirmation($supplierConfirmation)->first()->toArray();
        $currentDateTime = new DateTime();
        $currentDateTime->add(new DateInterval('P01D'));
        $currentDateTime->format('Y-m-d H:i:s');

        $currentDate = date_format($currentDateTime, 'Y-m-d');
        $currentTime = date_format($currentDateTime, 'H:00:00');

        $currentDate = '2014-08-10';
        
        $dateFrom = $currentDate.' '.$currentTime;

        $currentDateTime->add(new DateInterval('PT01H'));
        $currentTime = date_format($currentDateTime, 'H:00:00');

        $dateTo = $currentDate.' '.$currentTime;

        //$data = Booking::getCustomerEmailWithUpcomingBooking($dateFrom, $dateTo)->toArray();

        //$this->line($data[0]["customer_email"]);
        //$this->line($data);

        
        $data = [
        	"customer_email" => "joefrey@vroomvroomvroom.com.au",
        	"customer_firstName" => "Joefrey",
        	"customer_lastName" => "Cabanilla",
        ];        

        //$sendingStatus = MailSender::sendAnEmail($email_template, $email_type, $data);

        $mail_credentials = Config::get('global/mail_accounts.' . $email_type);
        try {
            Mail::send($email_template, $data, function($message) use($mail_credentials, $data) {
                $message->from($mail_credentials['email'], $mail_credentials['name']);
                $message->to($data['customer_email'], $data['customer_firstName'] . ' ' . $data['customer_lastName'])->subject('Your Booking Notification');
            });

            $sendingStatus = 'Mail sent!';
            
        } catch (Exception $ex) {

        	$sendingStatus = 'Mail sending failed.';
        	
        }

		$this->line($sendingStatus);
		
	}

	/**
	 * Get the console command arguments.
	 *
	 * @return array
	 */
	/*
	protected function getArguments()
	{
		return array(
			array('example', InputArgument::REQUIRED, 'An example argument.'),
		);
	}
	*/
	/**
	 * Get the console command options.
	 *
	 * @return array
	 */
	/*
	protected function getOptions()
	{
		return array(
			array('example', null, InputOption::VALUE_OPTIONAL, 'An example option.', null),
		);
	}
	*/
}
