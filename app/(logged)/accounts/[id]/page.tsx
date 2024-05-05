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
import EditModal from '@/components/EditModal/EditModal'
import { Transaction } from '@/types/transaction'
import { useState } from "react";
import CustomDatePicker from '@/components/CustomDatePicker/CustomDatePicker'
import DeleteModal from "@/components/DeleteModal/DeleteModal"
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
    const [opened,{open,close}] = useDisclosure(false);
    const [openedEdit, Edithandler] = useDisclosure(false);
    const [openedDelete, Deletehandler] = useDisclosure(false);
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
    const handleEdit = (id: string) => {
        const transactionToEdit = data.data.find((transaction) => transaction.id === id);
        if (transactionToEdit) {
            setSelectedTransaction(transactionToEdit);
            Edithandler.open();
        }
        console.log(transactionToEdit);
    }
    const handleDelete = (id: string) => {
        const transactionToDelete = data.data.find((transaction) => transaction.id === id);
        if (transactionToDelete) {
            setSelectedTransaction(transactionToDelete);
            Deletehandler.open();
        }
        console.log(`Delete ${id}`);
        
    }
    const debtData1: DebtItem = {
        amount: 10000,
        startDate: new Date(2022, 1, 1),
        interestRate: 0.05,
        monthlyPayment: 1000,
        minimumPayment: 50,
        desireMonths: new Date(2025, 1, 1),
        
    };

    
    console.log(data.data)
    return (
        <>
        
            
            <h1>Account Details</h1> 
            
            <AccountBar accountId={params.id}/>
            <p>Account ID: {params.id}</p>
            <EditModal opened={openedEdit} onClose={Edithandler.close} accountId={params.id} oldTransaction={selectedTransaction}/>    
            <DeleteModal opened={openedDelete} onClose={Deletehandler.close} accountId={params.id} oldTransaction={selectedTransaction}/>
            <TransactionTable 
                transactions={data.data}
                onDelete={handleDelete}
                onEdit={handleEdit}
            />
            {/* <h1>Debt Chart</h1>
            <DebtChart debtData={debtData1}/>
            <h1>Debt Comparison</h1> */}
            {/* <DebtComparision debtData={debtData1} newPayoffDate={new Date(2024)} /> */}


        </>
        
    )
}