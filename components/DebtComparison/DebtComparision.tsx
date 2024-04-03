import { AreaChart } from "@mantine/charts";

interface DebtItem {
  amount: number;
  startDate: Date;
  interestRate: number;
  monthlyPayment: number;
  minimumPayment: number;
  desireMonths: Date ;
}

export const debtData: DebtItem = {
  amount: 10000,
  startDate: new Date(2022, 1, 1), // Note: Month is 0-indexed in JavaScript Dates (0 = January)
  interestRate: 0.05,
  monthlyPayment: 1000,
  minimumPayment: 50,
  desireMonths: new Date(2023,3)
};

const calculateVolatileDebtDataPoints = (debtItem: DebtItem, newMonthlyPayment: number) => {
  let originalBalance = debtItem.amount;
  let newBalance = debtItem.amount;
  const monthlyInterestRate = debtItem.interestRate / 12;
  const payments = [];
  let date = new Date(debtItem.startDate);

  while (originalBalance > 0 || newBalance > 0) {
    const interestOnOriginal = originalBalance * monthlyInterestRate;
    let principalOnOriginal = debtItem.monthlyPayment - interestOnOriginal;
    originalBalance -= principalOnOriginal;

    const interestOnNew = newBalance * monthlyInterestRate;
    let principalOnNew = newMonthlyPayment - interestOnNew;
    newBalance -= principalOnNew;

    if (originalBalance < 0) {
      originalBalance = 0;
    }
    if (newBalance < 0) {
      newBalance = 0;
    }

    payments.push({
      Date: date.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      amount: Number(originalBalance.toFixed(2)),
      simulated_amount: Number(newBalance.toFixed(2))
    });

    date.setMonth(date.getMonth() + 1); // Increment month by 1
  }

  return payments;
};

const calculateVolatileDebtDataPoints2 = (debtItem: DebtItem, newPayoffDate: Date) => {
  const monthlyInterestRate = debtItem.interestRate / 12;
  const desireMonths = (newPayoffDate.getFullYear() - debtItem.startDate.getFullYear()) * 12 + newPayoffDate.getMonth() - debtItem.startDate.getMonth();
  let originalBalance = debtItem.amount;
  let newBalance = debtItem.amount;
  const payments = [];
  // now what we need here we have desireMonths so we can calculate the new value that we need to pay to payoff the debt at the exact month given by the user 
  // for now im gonna calculate monthly payment by the formula of armortization 

  let monthlyPayment = (debtItem.amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -desireMonths));

  let date = new Date(debtItem.startDate);

  payments.push({
    Date: date.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
    amount: Number(originalBalance.toFixed(2)),
    simulated_amount: Number(newBalance.toFixed(2))
  });
  while (originalBalance > 0 || newBalance > 0) {
    const interestOnOriginal = originalBalance * monthlyInterestRate;
    let principalOnOriginal = monthlyPayment - interestOnOriginal;
    originalBalance -= principalOnOriginal;

    const interestOnNew = newBalance * monthlyInterestRate;
    let principalOnNew = monthlyPayment - interestOnNew;
    newBalance -= principalOnNew;

    if (originalBalance < 0) {
      originalBalance = 0;
    }
    if (newBalance < 0) {
      newBalance = 0;
    }

    payments.push({
      Date: date.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      amount: Number(originalBalance.toFixed(2)),
      simulated_amount: Number(newBalance.toFixed(2))
    });

    date.setMonth(date.getMonth() + 1); // Increment month by 1
  }

  return payments;

}



export function DebtComparision({ debtData, newMonthlyPayment, newPayoffDate }: { debtData: DebtItem; newMonthlyPayment: number; newPayoffDate: Date}) {
  // const data = calculateVolatileDebtDataPoints(debtData, newMonthlyPayment);
  const data1 = calculateVolatileDebtDataPoints2(debtData, newPayoffDate);
  console.log(data1);
  return (
    <AreaChart
      data={data1}
      h = {300}
      dataKey="Date"
      series={[
        {name: 'amount',color : 'blue'},
        {name: 'simulated_amount',color : 'red'}
        
      ]}
      style={{width: '100%', height: 400}}
        curveType='natural'
    />

    

  )
  // Here you would return your AreaChart component with the appropriate props
}
