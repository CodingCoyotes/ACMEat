include "console.iol"
include "interface.iol"
include "database.iol"
include "string_utils.iol"

inputPort Bank {
	Location: "socket://localhost:2000"
	Protocol: soap
	Interfaces: BankInterface
}

cset {
	sid: OpMessage.sid WithdrawRequest.sid DepositRequest.sid ReportRequest.sid ReportResponse.sid PaymentRequest.sid PaymentResponse.sid
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
			.username = "alberto";
			.password = "password";
			.host = "";
			.database = "bank";
			.driver = "postgresql"
		};

		connect@Database( connectionInfo )( void );

		// print inserted content
		queryRequest =
			"SELECT id, username, password, balance FROM users " +
			"WHERE username=:username;";
		username = lrequest.username;
		queryRequest.username = username;
		query@Database( queryRequest )( queryResponse );

		lresponse.sid = csets.sid = new;
		if (#queryResponse.row < 1) {
			lresponse.message = "An error has occured.\tUser " + username + " not found.";
			lresponse.successfull = false
		} else {
			if (lrequest.password != queryResponse.row[0].password) {
				lresponse.message = "An error has occured.\t Wrong password for user " + username + ".";
				lresponse.successfull = false
			} else {
				fromUserId = int(queryResponse.id);
				lresponse.message = "You are logged in.";
				lresponse.successfull = true;
				println@Console("User " + username + " logged in.")() // DEBUG
			}
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
				response.message = queryResponse.row[0].report + "Currently available: " + queryResponse.row[0].count + "\n"
			}
		}]
		[ logout( request )] { 
			println@Console("User "+username+" logged out.")(); // DEBUG
			keepRunning = false
		}

		// ACMEAT
		// ACMEAT dice al Client di pagare e si mette in attesa di ricevere il token
		// Il Client viene rediretto al pagamento, inserisce i suoi dati e quando ha pagato la banca invia il token
		// Il Client poi reinvierà il token ad ACMEAT che si occuperà di verificare con la banca che l'operazione sia andata a buon fine
		[ paymentTo( prequest )( presponse ) {
			// payment from client (which may vary) to ACMEat
			// from: based on login
			// to: ACMEat (which must be specified, bank is generalized)
			// print inserted content
			presponse.sid = prequest.sid;
			synchronized(db_access) {
				// check if toUser exists
				queryRequest =
					"SELECT id, username, balance FROM users " +
					"WHERE id::text=:toUser;";
				toUser = prequest.toUser;
				queryRequest.toUser = toUser;
				query@Database( queryRequest )( queryResponse );
				if (#queryResponse.row < 1) {
					presponse.successfull = false
					presponse.message = "An error has occured.\tUser " + toUser + " not found."
				} else {
					toUserName = queryResponse.row[0].username;
					presponse.successfull = true
					// withdraw from fromUser
					queryRequest =
						"SELECT balance FROM users " +
						"WHERE username=:username;";
					queryRequest.username = username;
					query@Database( queryRequest )( queryResponse );
					update@Database(
						"update users set balance=:balance where username=:username" {
							.balance = queryResponse.row[0].balance - prequest.amount,
							.username = username
						}
					)(dbresponse.status)
					// TODO: INSERT INTO OPERATIONS
					// deposit to toUser
					queryRequest =
						"SELECT balance FROM users " +
						"WHERE id::text=:toUser;";
					queryRequest.toUser = toUser;
					query@Database( queryRequest )( queryResponse );
					update@Database(
						"update users set balance=:balance where id::text=:toUser" {
							.balance = queryResponse.row[0].balance + prequest.amount,
							.toUser = toUser
						}
					)(dbresponse.status)
					println@Console( "Moved " + prequest.amount + " from " + username +" to " + toUser )() // DEBUG
					
					// TODO generate token and store in transaction database
					// https://docs.jolie-lang.org/v1.10.x/language-tools-and-standard-library/standard-library-api/string_utils.html#getRandomUUID
					getRandomUUID@StringUtils()( id )
					getRandomUUID@StringUtils()( token )
					update@Database(
						"insert into operations(id, source_user, dest_user, amount, type, token) values (:id::uuid, :fromUser, :toUser, :amount, :type, :token::uuid)" {
							.id = id,
							.fromUser = username,
							.toUser = toUserName,
							.amount = prequest.amount,
							.type = 2, // 0: deposit, 1: withdraw, 2: move
							.token = token
						}
					)(dbresponse.status);
					presponse.token = token
				}
			}
		} ]
	}
}