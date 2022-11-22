type LoginRequest: void {
	.name: string
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

type ReportResponse: void{
	.sid: string
	.message?: string
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
	.amount: int
}

type PaymentResponse: void {
	.sid: string
	.message?: string
	.token?: string
	.successfull?: bool
}

interface BankInterface {
	RequestResponse: login(LoginRequest)(LoginResponse), report(ReportRequest)(ReportResponse), paymentTo(PaymentRequest)(PaymentResponse)
	OneWay: withdraw(WithdrawRequest), deposit(DepositRequest), logout(OpMessage)
}