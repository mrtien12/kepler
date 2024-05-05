import { useState, useEffect } from 'react';
import { useAccounts } from './useAccount';

const category = [
    { group: "Budget Account", items: ['Checking', 'Savings', 'Credit Card'] },
    { group: "Mortages and Loans", items: ['Mortage', 'Auto Loan', 'Personal Loan'] }
];

function isLoans(accountType: string) {
    const categoryItem = category.find(
        (category) => category.items.includes(accountType)
    );
    return categoryItem?.group === "Mortages and Loans";
}


export function usePayee(currentAccount: string | undefined) {
    const accounts = useAccounts();
    const [payees, setPayees] = useState<string[]>([]);

    useEffect(() => {
        if (accounts.length > 0) {
            const filteredAccounts = accounts.filter(account => account.id !== currentAccount);
            // const paymentAccounts = filteredAccounts.filter(account => account.accountType ==='Credit Card')
            // const isLoanAccounts = filteredAccounts.filter(account => isLoans(account.accountType))
            let payeesData: string[] = []
            filteredAccounts.map((account) => {
                if (account.accountType === 'Credit Card' || isLoans(account.accountType)) {
                    payeesData.push(`Payment: ${account.accountName}`);
                } else {
                    payeesData.push(`from/to: ${account.accountName}`);
                }
                // No need to add a return for non-matching accounts
                ;
            });

            setPayees(payeesData);
        }
    }, [accounts, currentAccount]);  // Dependencies include accounts and currentAccount to refresh on their updates

    return payees;
}