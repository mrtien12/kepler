import { AreaChart} from '@mantine/charts';

interface DebtItem {
  amount: number;
  startDate: Date;
  interestRate: number;
  monthlyPayment: number;
  minimumPayment: number;
}

export const debtData: DebtItem = {
  amount: 10000,
  startDate: new Date(2022, 1, 1),
  interestRate: 0.05,
  monthlyPayment: 1000,
  minimumPayment: 50,
};


const calculateDebtDataPoints = (debtItem: DebtItem) => {
    let balance = debtItem.amount;
    const monthlyInterestRate = debtItem.interestRate / 12;
    const payments = [];
    let date = new Date(debtItem.startDate);
    payments.push({
      Date: debtItem.startDate.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
      Debt: balance,
    });
    while (balance > 0) {
      const interest = balance * monthlyInterestRate;
      let principal = debtItem.monthlyPayment - interest;
      balance -= principal;
  
      if (balance < 0) {
        principal += balance; // Adjust the last payment
        balance = 0;
      }
  
      payments.push({
        Date: date.toLocaleDateString('default', { month: 'short', year: 'numeric' }),
        Debt: Number(balance.toFixed(2)), // Ensuring balance is converted to a number after toFixed
      });
  
      date.setMonth(date.getMonth() + 1); // Increment month by 1
    }
  
    return payments;
  };
  




export function DebtChart({ debtData }: { debtData: DebtItem }) {
    const data = calculateDebtDataPoints(debtData);
    console.log(data)
    return (
        <AreaChart
            data={data}
            h={300}            
            dataKey="Date"
            color="blue"
            series={[
                {name: 'Debt', color: 'indigo.6'}
            ]}
            style={{ width: '100%', height: 400 }}
            curveType='natural'
        />
    );
}
