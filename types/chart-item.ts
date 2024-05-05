export interface DebtItem {
	amount : number;
    startDate : Date;
    interestRate : number;
    monthlyPayment : number;
	minimumPayment : number;
    desireMonths : Date;
}