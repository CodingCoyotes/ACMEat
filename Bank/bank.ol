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

execution {
	concurrent
}

init {
	keepRunning = true
}

main
{
	login( lRequest )( lResponse ) {
		// Connect to DB
		with ( connectionInfo ) {
			.username = "alberto";
			.password = "password";
			.host = "";
			.database = "bank";
			.driver = "postgresql"
		};
		connect@Database( connectionInfo )( void );
		synchronized( db_access ) {
			queryRequest =
				"SELECT username, password FROM users " +
				"WHERE username=:username;";
			username = lRequest.username;
			queryRequest.username = username;
			query@Database( queryRequest )( queryResponse );
		};
		lResponse.sid = csets.sid = new;
		if ( #queryResponse.row < 1 ) {
			lResponse.message = "An error has occured.\tUser " + username + " not found.";
			lResponse.successfull = false
		} else {
			if ( lRequest.password != queryResponse.row[0].password ) {
				lResponse.message = "An error has occured.\t Wrong password for user " + username + ".";
				lResponse.successfull = false
			} else {
				lResponse.message = "You are logged in.";
				lResponse.successfull = true;
				println@Console("User " + username + " logged in.")() // DEBUG
			}
		}
	};
	while( keepRunning ){
		[ withdraw( wRequest )] {
			synchronized( db_access ) {
				queryRequest =
					"SELECT balance FROM users " +
					"WHERE username=:username;";
				queryRequest.username = username;
				query@Database( queryRequest )( queryResponse );
				update@Database(
					"update users set balance=:balance where username=:username" {
						.balance = queryResponse.row[0].balance - wRequest.amount,
						.username = username
					}
				)( dbresponse.status )
				getRandomUUID@StringUtils()( id )
				getRandomUUID@StringUtils()( token )
				update@Database(
						"insert into operations(id, source_user, amount, type, token) values (:id::uuid, :fromUser, :amount, :type, :token::uuid)" {
							.id = id,
							.fromUser = username,
							.amount = pRequest.amount,
							.type = 0, // 0: withdraw, 1: deposit, 2: move
							.token = token
						}
					)(dbresponse.status);
			};
			println@Console( "User " + username + " withdrawn: " + wRequest.amount )() // DEBUG
		}
		[ deposit( dRequest )] {
			synchronized( db_access ) {
				queryRequest =
					"SELECT balance FROM users " +
					"WHERE username=:username;";
				queryRequest.username = username;
				query@Database( queryRequest )( queryResponse );
				update@Database(
					"update users set balance=:balance where username=:username" {
						.balance = queryResponse.row[0].balance + dRequest.amount,
						.username = username
					}
				)( dbresponse.status )
				getRandomUUID@StringUtils()( id )
				getRandomUUID@StringUtils()( token )
				update@Database(
						"insert into operations(id, dest_user, amount, type, token) values (:id::uuid, :toUser, :amount, :type, :token::uuid)" {
							.id = id,
							.toUser = username,
							.amount = pRequest.amount,
							.type = 1, // 0: withdraw, 1: deposit, 2: move
							.token = token
						}
					)(dbresponse.status);
			};
			println@Console( "User " + username + " deposited: " + dRequest.amount )() // DEBUG
		}
		[ report( rRequest )( rResponse ) {
			rResponse.sid = request.sid;
			synchronized( db_access ) {
				queryRequest =
					"SELECT source_user, dest_user, amount, type FROM operations " +
					"WHERE fromUser=:username OR toUser=:username;";
				queryRequest.username = username;
				query@Database( queryRequest )( queryResponse );
				
				rResponse.message = queryResponse.row[0].report + "Currently available: " + queryResponse.row[0].count + "\n"
			}
		}]
		[ logout( request )] { 
			println@Console("User " + username + " logged out.")(); // DEBUG
			keepRunning = false
		}

		// ACMEAT
		// ACMEAT dice al Client di pagare e si mette in attesa di ricevere il token
		// Il Client viene rediretto al pagamento, inserisce i suoi dati e quando ha pagato la banca invia il token
		// Il Client poi reinvierà il token ad ACMEAT che si occuperà di verificare con la banca che l'operazione sia andata a buon fine
		[ paymentTo( pRequest )( pResponse ) {
			// payment from client (which may vary) to ACMEat
			// from: based on login
			// to: ACMEat (which must be specified, bank is generalized)
			// print inserted content
			pResponse.sid = pRequest.sid;
			synchronized(db_access) {
				// check if toUser exists
				queryRequest =
					"SELECT id, username, balance FROM users " +
					"WHERE id::text=:toUser;";
				toUser = pRequest.toUser;
				queryRequest.toUser = toUser;
				query@Database( queryRequest )( queryResponse );
				if (#queryResponse.row < 1) {
					pResponse.successfull = false
					pResponse.message = "An error has occured.\tUser " + toUser + " not found."
				} else {
					toUserName = queryResponse.row[0].username;
					pResponse.successfull = true
					// withdraw from fromUser
					queryRequest =
						"SELECT balance FROM users " +
						"WHERE username=:username;";
					queryRequest.username = username;
					query@Database( queryRequest )( queryResponse );
					update@Database(
						"update users set balance=:balance where username=:username" {
							.balance = queryResponse.row[0].balance - pRequest.amount,
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
							.balance = queryResponse.row[0].balance + pRequest.amount,
							.toUser = toUser
						}
					)(dbresponse.status)
					println@Console( "Moved " + pRequest.amount + " from " + username +" to " + toUser )() // DEBUG
					
					// TODO generate token and store in transaction database
					// https://docs.jolie-lang.org/v1.10.x/language-tools-and-standard-library/standard-library-api/string_utils.html#getRandomUUID
					getRandomUUID@StringUtils()( id )
					getRandomUUID@StringUtils()( token )
					update@Database(
						"insert into operations(id, source_user, dest_user, amount, type, token) values (:id::uuid, :fromUser, :toUser, :amount, :type, :token::uuid)" {
							.id = id,
							.fromUser = username,
							.toUser = toUserName,
							.amount = pRequest.amount,
							.type = 2, // 0: deposit, 1: withdraw, 2: move
							.token = token
						}
					)(dbresponse.status);
					pResponse.token = token
				}
			}
		} ]
	}
}