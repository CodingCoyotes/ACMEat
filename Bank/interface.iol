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

interface BankInterface {
	RequestResponse: login(LoginRequest)(LoginResponse), report(ReportRequest)(ReportResponse)
	OneWay: withdraw(WithdrawRequest), deposit(DepositRequest), logout(OpMessage)
}