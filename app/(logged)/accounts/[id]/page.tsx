'use client'
import { MonthPickerInput } from "@mantine/dates"
import {DebtChart} from '@/components/DebtChart/DebtChart'
import {DebtItem} from '@/types/chart-item'
import { DebtComparision } from "@/components/DebtComparison/DebtComparision"
import {AccountBar} from '@/components/AccountBar/AccountBar'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
import { useTransactions } from "@/hooks/useTransaction"
import TransactionTable  from '@/components/TransactionTable/TransactionTable'


export default function AccountDetails(
    {params}: {params: {id: string}}
)
{   
    // const debtData1: DebtItem = {
    //     amount: 10000,
    //     startDate: new Date(2022, 1, 1),
    //     interestRate: 0.05,
    //     monthlyPayment: 1000,
    //     minimumPayment: 50,
    //   };
    // const date = new Date(2023,3)

    const session = useSession(
		{
			required: true,
			onUnauthenticated() {
				redirect('/signin');
			}
		}
	)
    const data = useTransactions(params.id);
    console.log(data.data);
    const [opened,{open,close}] = useDisclosure(false);
    return (
        <>
        
            {/* <h1>Debt Chart</h1> */}
            {/* <DebtChart debtData={debtData1}/> */}
            {/* <h1>Debt Comparison</h1>
            <h1>Account Details</h1> */}
            <AccountBar accountId={params.id}/>
            <p>Account ID: {params.id}</p>
            <TransactionTable transactions={data.data}/>
            



        </>
        
    )
}