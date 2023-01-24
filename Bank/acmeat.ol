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
	sid: fakeReqResponse.sid
}

execution{ concurrent }

init {
	keepRunning = true
}

main
{
    fakeReq( request )( response ) {
		// connect to DB
		with ( connectionInfo ) {
			.username = "alberto";
			.password = "password";
			.host = "";
			.database = "acmeat";
			.driver = "postgresql"
		};    
    	connect@Database( connectionInfo )( void );
		queryRequest =
			"SELECT id, name, bank_id FROM restaurants " +
			"WHERE name=:name;";
		restName = request.restName;
		queryRequest.name = restName;
		query@Database( queryRequest )( queryResponse );
		response.sid = csets.sid = new;
		if (#queryResponse.row < 1) {
			response.message = "An error has occured.\tRestaurant " + restName + " not found.";
			response.successfull = false
		} else {
			response.bill = double(20);
			response.restId = queryResponse.row[0].bank_id;
			response.successfull = true
		}
    }
}
