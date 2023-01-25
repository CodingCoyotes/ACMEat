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
	// Specifically, he sent an order specifying the restaurant name
    // We suppose the restaurant is available and accepts the order
	// We also expect a delieverer to have accepted the delivery
    // As a last step, ACMEat sent to the client its id (IBAN) as weel as the total bill
	showInputDialog@SwingUI( "Insert restaurant name" )( restName );
	fRequest.order.restName = restName;
    fakeReq@Acmeat( fRequest )( fResponse );
    if ( fResponse.successfull ) {
        acmeatSid = fResponse.sid;
		bill = fResponse.bill; // Total bill, i.e., amount to pay to ACMEat
        iban = fResponse.iban; // ACMEat IBAN
		// At this point, ACMEat expects the client to pay the bill using the given IBAN
		loggedIn = false;
		while( !loggedIn ) {
			showInputDialog@SwingUI( "Insert your username" )( lRequest.username );
			showInputDialog@SwingUI( "Insert your password" )( lRequest.password );
			login@Bank( lRequest )( lResponse );
			bankSid = lResponse.sid;
			loggedIn = lResponse.successfull;
			println@Console( "Bank responded: " + lResponse.message)()
		}
		pRequest.sid = bankSid;
		pRequest.toUser = iban;
		pRequest.amount = bill;
		paymentTo@Bank( pRequest )( pResponse );
		if ( pResponse.successfull ) {
			token = pResponse.token
		} else {
			println@Console( pResponse.message )()
		}
		opMessage.sid = bankSid;
		logout@Bank( opMessage )
		// At this point the client sends the token to ACMEat so it can verify the payment
		vRequest.sid = acmeatSid;
		vRequest.token = token;
		verifyToken@Acmeat( vRequest )( vResponse );
		if ( vResponse.successfull ) {
			println@Console("OK")()
		} else {
			println@Console("NOT OK")()
		}
	} else {
		println@Console( fResponse.message )()
	}
}