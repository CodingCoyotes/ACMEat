include "console.iol"
include "interface.iol"
include "database.iol"

inputPort Bank {
	Location: "socket://localhost:2000"
	Protocol: soap
	Interfaces: BankInterface
}

cset {
	sid: OpMessage.sid WithdrawRequest.sid DepositRequest.sid ReportRequest.sid ReportResponse.sid
}

execution{ concurrent }

init {
	keepRunning = true
}

main
{
	login( lrequest )( lresponse ) {
		// connect to DB
		with ( connectionInfo ) {
			.username = "bank_service";
			.password = "password";
			.host = "";
			.database = "bank_database";
			.driver = "postgresql"
		};

		connect@Database( connectionInfo )( void );

		// print inserted content
		queryRequest =
			"SELECT id, name, count FROM bank_users " +
			"WHERE name=:name;";
		username = lrequest.name;
		queryRequest.name = username;
		query@Database( queryRequest )( queryResponse );

		lresponse.sid = csets.sid = new;
		if (#queryResponse.row < 1) {
			lresponse.message = "An error has occured.\tUser " + username + " not found."
			lresponse.successfull = false
		} else {
			lresponse.message = "You are logged in."
			lresponse.successfull = true
			println@Console("User " + username + " logged in.")() // DEBUG
		}
	};
	while( keepRunning ){
		[ withdraw( wrequest )] {
			synchronized(db_access) {
				queryRequest =
					"SELECT count, report FROM bank_users " +
					"WHERE name=:name;";
				queryRequest.name = username;
				query@Database( queryRequest )( queryResponse );
				update@Database(
					"update bank_users set count=:count, report=:report where name=:name" {
						.count = queryResponse.row[0].count - wrequest.amount,
						.report = queryResponse.row[0].report + "Withdrawn " + wrequest.amount + "\n",
						.name = username
					}
				)(dbresponse.status)
			};
			println@Console( "User "+username+" withdrawn: "+wrequest.amount )() // DEBUG
		}
		[ deposit( drequest )] {
			synchronized(db_access) {
				queryRequest =
					"SELECT count, report FROM bank_users " +
					"WHERE name=:name;";
				queryRequest.name = username;
				query@Database( queryRequest )( queryResponse );
				update@Database(
					"update bank_users set count=:count, report=:report where name=:name" {
						.count = queryResponse.row[0].count + drequest.amount,
						.report = queryResponse.row[0].report + "Deposited " + drequest.amount + "\n",
						.name = username
					}
				)(dbresponse.status)
			};
			println@Console( "User " + username + " deposited: " + drequest.amount )()
		}
		[ report( request )( response ) {
			response.sid = request.sid;
			synchronized(db_access) {
				queryRequest =
					"SELECT report, count FROM bank_users " +
					"WHERE name=:name;";
				queryRequest.name = username;
				query@Database( queryRequest )( queryResponse );
				response.message += queryResponse.row[0].report + "Currently available: " + queryResponse.row[0].count
			}
		}]
		[ logout( request )] { 
			println@Console("User "+username+" logged out.")(); // DEBUG
			keepRunning = false
		}
	}
}