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

type ReportRequest: void {
	.sid: string
}

type ReportResponse: void {
	.sid: string
	.message*: string
}

type WithdrawRequest: void {
	.sid: string
	.amount: int
}

type DepositRequest: void {
	.sid: string
	.amount: int
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


// ACMEat types
type fakeReqRequest: void {
	.restName: string
}

type fakeReqResponse: void {
	.sid: string
	.bill?: double
	.restId?: string
	.message?: string
	.successfull?: bool
}

// Interfaces
interface BankInterface {
	RequestResponse: login(LoginRequest)(LoginResponse), report(ReportRequest)(ReportResponse), paymentTo(PaymentRequest)(PaymentResponse)
	OneWay: withdraw(WithdrawRequest), deposit(DepositRequest), logout(OpMessage)
}


interface AcmeatInterface {
	RequestResponse: fakeReq(fakeReqRequest)(fakeReqResponse)
}