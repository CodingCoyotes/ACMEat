// ACMEat's client's client to model client's behaviours
// Only used for testing purposes
include "console.iol"
include "ui/ui.iol"
include "ui/swing_ui.iol"
include "interface.iol"

outputPort Bank {
	Location: "socket://localhost:2000"
	Protocol: soap
	Interfaces: BankInterface
}

outputPort Acmeat {
	Location: "socket://localhost:2001"
	Protocol: soap
	Interfaces: AcmeatInterface
}

main
{
    // The user exchanged various messages with ACMEat
    // In one message we suppose the user to ask for a specific restaurant
    // We suppose the restaurant is available and accepts the order
    // As a last step, ACMEat sent to the client the bank_id of the restaurant as weel as the bill
	showInputDialog@SwingUI( "Insert restaurant name" )( restName );
	fRequest.restName = restName;
    fakeReq@Acmeat( fRequest )( fResponse );
    if ( fResponse.successfull ) {
        acmeatSid = fResponse.sid;
		bill = fResponse.bill;
        restId = fResponse.restId;
        println@Console("Bill " + bill + " Restaurant " + restName + " Id " + restId)() // DEBUG

		// At this point, ACMEat expects the client to pay the restaurant using the given bank_id
		showInputDialog@SwingUI( "Insert your username" )( lRequest.username );
		showInputDialog@SwingUI( "Insert your password" )( lRequest.password );
		login@Bank( lRequest )( lResponse );
		bankSid = lResponse.sid;
		println@Console( "Server Responded: " + lResponse.message + "\t sid: "+ bankSid )();
		if (lResponse.successfull) {
			pRequest.sid = bankSid;
			pRequest.toUser = restId;
			pRequest.amount = bill;
			paymentTo@Bank(pRequest)(pResponse);
			if (pResponse.successfull) {
				println@Console(pResponse.token)()
			} else {
				println@Console(pResponse.message)()
			}
			opMessage.sid = bankSid;
			logout@Bank( opMessage )
		}
	} else {
		println@Console( fResponse.message )() // DEBUG
	}
}