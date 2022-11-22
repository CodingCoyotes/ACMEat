include "console.iol"
include "ui/ui.iol"
include "ui/swing_ui.iol"
include "interface.iol"

outputPort Bank {
	//Location: "socket://bank.isos.fermitech.info:2000"
	//Location: "socket://51.75.207.207:2000"
	Location: "socket://localhost:2000"
	Protocol: soap
	Interfaces: BankInterface
}

main
{
	showInputDialog@SwingUI( "Insert your name" )( request.name );
	keepRunning = true;
	login@Bank( request )( response );
	sid = response.sid;
	println@Console( "Server Responded: " + response.message + "\t sid: "+sid )();
	if (response.successfull) {
		while( keepRunning ){
			showInputDialog@SwingUI( "Choose an operation:\n1) Withdraw\n2) Deposit\n3) Report\n4) Pay to\n0)Logout")( input );
			if (input == "1") {
				showInputDialog@SwingUI( "Amount to withdraw")(withdrawRequest.amount);
				withdrawRequest.amount = int(withdrawRequest.amount);
				withdrawRequest.sid = sid;
				withdraw@Bank(withdrawRequest)
			} else if (input == "2") {
				showInputDialog@SwingUI( "Amount to deposit")(depositRequest.amount);
				depositRequest.amount = int(depositRequest.amount);
				depositRequest.sid = sid;
				deposit@Bank(depositRequest)
			} else if (input == "3") {
				rrequest.sid = sid;
				report@Bank(rrequest)(rresponse);
				println@Console(rresponse.message)()
			} else if (input == "4") {
				showInputDialog@SwingUI( "Amount to pay")(prequest.amount);
				prequest.amount = int(prequest.amount);
				showInputDialog@SwingUI( "Payment to")(prequest.toUser);
				prequest.sid = sid;
				paymentTo@Bank(prequest)(presponse);
				if (presponse.successfull) {
					println@Console(presponse.token)()
				} else {
					println@Console(presponse.message)()
				}
			} else if (input == "0") {
				opMessage.sid = sid;
				opMessage.message = input;
				logout@Bank( opMessage );
				keepRunning = false
			} else {
				println@Console("Error")()
			}
		}
	}
}
