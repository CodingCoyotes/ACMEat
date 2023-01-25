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
	sid: OpMessage.sid WithdrawRequest.sid DepositRequest.sid ReportRequest.sid ReportResponse.sid PaymentRequest.sid PaymentResponse.sid OperationReportRequest.sid OperationReportResponse.sid CancelOperationRequest.sid CancelOperationResponse.sid
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
			query@Database( queryRequest )( queryResponse )
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
				lResponse.successfull = true
				//println@Console("User " + username + " logged in.")() // DEBUG
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
							.amount = wRequest.amount,
							.type = 0, // 0: withdraw, 1: deposit, 2: move
							.token = token
						}
					)(dbresponse.status)
			}
			//println@Console( "User " + username + " withdrawn: " + wRequest.amount )() // DEBUG
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
							.amount = dRequest.amount,
							.type = 1, // 0: withdraw, 1: deposit, 2: move
							.token = token
						}
					)(dbresponse.status)
			}
			//println@Console( "User " + username + " deposited: " + dRequest.amount )() // DEBUG
		}
		[ report( rRequest )( rResponse ) {
			rResponse.sid = rRequest.sid;
			synchronized( db_access ) {
				queryRequest =
					"SELECT source_user, dest_user, amount, type, token FROM operations " +
					"WHERE source_user=:username OR dest_user=:username;";
				queryRequest.username = username;
				query@Database( queryRequest )( queryResponse );
				for ( i = 0, i < #queryResponse.row, i++) {
					rResponse.report[i].source_user = queryResponse.row[i].source_user
					rResponse.report[i].dest_user = queryResponse.row[i].dest_user
					rResponse.report[i].amount = queryResponse.row[i].amount
					rResponse.report[i].type = queryResponse.row[i].type
					rResponse.report[i].token = queryResponse.row[i].token
				}		
			}
		}]
		[ operationReport( oRequest )( oResponse ) {
			oResponse.sid = oRequest.sid;
			synchronized( db_access ) {
				queryRequest =
					"SELECT source_user, dest_user, amount, type, token FROM operations " +
					"WHERE (source_user=:username OR dest_user=:username) AND token::text=:token;";
				queryRequest.username = username;
				queryRequest.token = oRequest.token;
				query@Database( queryRequest )( queryResponse );
				if ( #queryResponse.row < 1 ) {
					oResponse.successfull = false
				} else {
					oResponse.report.source_user = queryResponse.row[0].source_user;
					oResponse.report.dest_user = queryResponse.row[0].dest_user;
					oResponse.report.amount = queryResponse.row[0].amount;
					oResponse.report.type = queryResponse.row[0].type;
					oResponse.report.token = queryResponse.row[0].token;
					oResponse.successfull = true
				}
			}
		}]
		[ cancelOperation( cRequest )( cResponse ) {
			cResponse.sid = cRequest.sid;
			token = cRequest.token;
			synchronized( db_access ) {
				queryRequest =
					"SELECT source_user, dest_user, amount, type, token FROM operations " +
					"WHERE (source_user=:username OR dest_user=:username) AND token::text=:token;";
				queryRequest.username = username;
				queryRequest.token = token;
				query@Database( queryRequest )( queryResponse );
				if ( #queryResponse.row < 1 ) {
					cResponse.message = "Error: operation not found.";
					cResponse.successfull = false
				} else {
					source_user = queryResponse.row[0].source_user;
					dest_user = queryResponse.row[0].dest_user;
					amount = queryResponse.row[0].amount;
					// Revert payment (invert source and dest user)
					// withdraw from dest_user
					queryRequest =
						"SELECT balance FROM users " +
						"WHERE username=:username;";
					queryRequest.username = dest_user;
					query@Database( queryRequest )( queryResponse );
					update@Database(
						"update users set balance=:balance where username=:username" {
							.balance = queryResponse.row[0].balance - amount,
							.username = dest_user
						}
					)(dbresponse.status);
					// deposit to source_user
					queryRequest =
						"SELECT balance FROM users " +
						"WHERE username=:toUser;";
					queryRequest.toUser = source_user;
					query@Database( queryRequest )( queryResponse );
					update@Database(
						"update users set balance=:balance where username=:toUser" {
							.balance = queryResponse.row[0].balance + amount,
							.toUser = source_user
						}
					)(dbresponse.status);
					// Delete operation
					update@Database(
						"delete from operations where token::text=:token" {
							.token = token
						}
					)(dbresponse.status);
					cResponse.message = "OK";
					cResponse.successfull = true
				}
			}
		}]
		[ logout( request )] { 
			//println@Console("User " + username + " logged out.")(); // DEBUG
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
					//println@Console( "Moved " + pRequest.amount + " from " + username +" to " + toUser )() // DEBUG
					
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