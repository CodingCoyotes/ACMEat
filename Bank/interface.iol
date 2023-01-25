// Bank types
type LoginRequest: void {
	.username: string
	.password: string
}

type LoginResponse: void {
	.sid: string
	.message?: string
	.successfull?: bool
}

type OpMessage: void{
	.sid: string
	.message?: string
}

type WithdrawRequest: void {
	.sid: string
	.amount: double
}

type DepositRequest: void {
	.sid: string
	.amount: double
}

type ReportRequest: void {
	.sid: string
}

type ReportResponse: void {
	.sid: string
	.report*: void {
		source_user?: string
		dest_user?: string
		amount: double
		type: int
		token?: string
	}
}

type PaymentRequest: void {
	.sid: string
	.toUser: string
	.amount: double
}

type PaymentResponse: void {
	.sid: string
	.message?: string
	.token?: string
	.successfull?: bool
}

type OperationReportRequest: void {
	.sid: string
	.token: string
}

type OperationReportResponse: void {
	.sid: string
	.successfull: bool
	.report?: void {
		source_user?: string
		dest_user?: string
		amount: double
		type: int
		token?: string
	}
}


// ACMEat types
type FakeReqRequest: void {
	.order: void {
		.restName: string
		// ...
	}
}

type FakeReqResponse: void {
	.sid: string
	.iban: string
	.bill?: double
	.message?: string
	.successfull?: bool
}

type VerifyTokenRequest: void {
	.sid: string
	.token: string
}

type VerifyTokenResponse: void {
	.sid: string
	.successfull: bool
}


// Interfaces
interface BankInterface {
	RequestResponse: login(LoginRequest)(LoginResponse), report(ReportRequest)(ReportResponse), operationReport(OperationReportRequest)(OperationReportResponse), paymentTo(PaymentRequest)(PaymentResponse)
	OneWay: withdraw(WithdrawRequest), deposit(DepositRequest), logout(OpMessage)
}


interface AcmeatInterface {
	RequestResponse: fakeReq(FakeReqRequest)(FakeReqResponse), verifyToken(VerifyTokenRequest)(VerifyTokenResponse)
}