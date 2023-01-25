// ACMEat's client to model ACMEat's behaviour
// Only used for testing purposes
include "console.iol"
include "interface.iol"
include "database.iol"
include "string_utils.iol"

inputPort Acmeat {
    Location: "socket://localhost:2001"
    Protocol: soap
    Interfaces: AcmeatInterface
}

outputPort Bank {
	Location: "socket://localhost:2000"
	Protocol: soap
	Interfaces: BankInterface
}

cset {
	sid: FakeReqResponse.sid VerifyTokenRequest.sid VerifyTokenResponse.sid
}

execution {
	concurrent
}

init {
	keepRunning = true
}

main
{
	// Client's sent its order to ACMEat
	// ACMEat sent the request to the restaurant, who accepted and sent its bill
	// ACMEat searched for a delieverer and chose the cheaper
	// ACMEat calculates the total bill = rBill + dBill + commission
	// ACMEat sends its IBAN and the total bill to the user and waits for a token
    fakeReq( fRequest )( fResponse ) {
		// Connect to DB
		with ( connectionInfo ) {
			.username = "alberto";
			.password = "password";
			.host = "";
			.database = "acmeat";
			.driver = "postgresql"
		};
    	connect@Database( connectionInfo )( void );
		// Check that the restaurant exists in the database
		// Nb: this isn't needed in the real application, as the client would choose
		// between proposed restaurants
		synchronized( db_access ) {
			queryRequest =
				"SELECT id, name, bank_id FROM restaurants " +
				"WHERE name=:name;";
			restName = fRequest.order.restName;
			queryRequest.name = restName;
			query@Database( queryRequest )( queryResponse )
		};
		fResponse.sid = csets.sid = new;
		if ( #queryResponse.row < 1 ) {
			fResponse.message = "An error has occured.\tRestaurant " + restName + " not found.";
			fResponse.successfull = false
		} else {
			fResponse.successfull = true
		}
		// ACMEat knows its IBAN: it's '5ba5f372-78af-4e1f-ad8d-9bfd82020d24'
		fResponse.iban = "5ba5f372-78af-4e1f-ad8d-9bfd82020d24";
		rBill = 20; // Restaurant bill
		dBill = 2.5; // Delieverer bill
		commission = 0.5; // Commission price
		tBill = rBill + dBill + commission; // Total bill
		fResponse.bill = tBill
    };
	verifyToken( vRequest )( vResponse ) {
		vResponse.sid = vRequest.sid;
		// Ask to the bank the report of the operation relative to the token
		token = vRequest.token;
		lRequest.username = "acmeat";
		lRequest.password = "password";
		login@Bank( lRequest )( lResponse );
		bankSid = lResponse.sid;
		oRequest.sid = bankSid;
		oRequest.token = token;
		operationReport@Bank( oRequest )( oResponse );
		opMessage.sid = bankSid;
		logout@Bank( opMessage );
		vResponse.successfull = oResponse.successfull
		// Nb: here, Acmeat only verified the operation was successfull, not that the token hans't already been used
		// vResponse.successfull = ( Acmeat.checkIfTokenHasAlreadyBeenUsed(token) && oResponse.successfull )
		// This has not been modeled in this simulation, but must be done in the real application
	}
}
