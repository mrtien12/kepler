import { Modal, TextInput, Select, Button, NumberInput, Autocomplete } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useState } from 'react'
import {getAuth} from 'firebase/auth';
import { getFirestore,increment, collection, doc, setDoc,addDoc,getDocs,query,updateDoc, arrayUnion,where } from "firebase/firestore";
import { useSession } from "next-auth/react";
import {db} from '@/firebase';
import { redirect } from "next/navigation";
import { usePayee } from "@/hooks/usePayee";
import { DatePickerInput } from "@mantine/dates";
import { useAllCategory } from "@/hooks/useAllCategory";

interface AddTransactionModalProps {
    opened: boolean;
    onClose: () => void;
    accountId: string;
}

export default function AddTransactionModal({ opened, onClose,accountId }: AddTransactionModalProps) {
    

    const [value, setValue] = useState('');
    const [amount, setAmount] = useState(0);
    const [type, setType] = useState('Expense');

    const categories = useAllCategory();
    const listofCategories = categories.map((category) => category.category);
    const session = useSession(
		{
			required: true,
			onUnauthenticated() {
				redirect('/signin');
			}
		}
    )

    
    const form = useForm({
        initialValues: {
            date : new Date(),
            category: '',
            memo: '',
            amount: 0,
            type: 'Expense',
            frequency: 'Never'

        },
        validate:{
            amount: (value) => {
                if (value <= 0) {
                    return 'Amount must be greater than 0';
                }
            }
        }
    });


    const handleSubmit = async (transactionData: any) => {
        // Adjust amount for expense type
        if (transactionData.type === 'Expense') {
            transactionData.amount = -Math.abs(transactionData.amount);
        } else {
            transactionData.amount = Math.abs(transactionData.amount);
        }
    
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        const transactionDate = new Date(transactionData.date);
        transactionDate.setHours(0, 0, 0, 0); // Normalize the transaction date
        if (transactionDate > today) {
        
            // Schedule the transaction
            await scheduleTransaction(transactionData, transactionDate);
        }

        else {
            if (transactionData.frequency === 'Never') {
                // Update the account balance
                const transactionRef = await addDoc(collection(db, 'users', session.data?.user?.email as string, 'accounts', accountId, 'transactions'), transactionData);
                await updateAccountBalance(accountId, transactionData.amount);
                await updateOrCreateCategory(transactionData, transactionRef.id);
            }
            else {
                // Schedule the transaction
                const transactionRef = await addDoc(collection(db, 'users', session.data?.user?.email as string, 'accounts', accountId, 'transactions'), transactionData);
                await updateAccountBalance(accountId, transactionData.amount);
                await scheduleTransaction(transactionData, transactionDate);
                await updateOrCreateCategory(transactionData, transactionRef.id);
            }
        }
    
        console.log('Transaction processed successfully!');
        form.reset();
        onClose(); // Close the modal after successful submission
    };
    
    const updateAccountBalance = async (accountId: string, amount: number) => {
        const accountRef = doc(db, 'users', session.data?.user?.email as string, 'accounts', accountId);
    
        // Atomically increment the account balance by the transaction amount
        await updateDoc(accountRef, {
            accountBalance: increment(amount)
        });
    };
    const updateOrCreateCategory = async (transactionData: any, transactionId: string) => {
        const categoriesRef = collection(db, 'users', session.data?.user?.email as string, 'categories');
        const querySnapshot = await getDocs(query(categoriesRef, where("category", "==", transactionData.category)));
    
        if (querySnapshot.empty) {
            // Category does not exist, create a new one
            await addDoc(categoriesRef, {
                category: transactionData.category,
                spent: transactionData.amount,
                available: 0,
                budgetid: '',
                startDate: transactionData.date,
                transactionids: [transactionId]
            });
        } else {
            // Category exists, update the existing category
            querySnapshot.forEach(async (doc) => {
                const categoryData = doc.data();
                await updateDoc(doc.ref, {
                    spent: categoryData.spent + transactionData.amount,
                    transactionids: arrayUnion(transactionId)
                });
            });
        }
    };
    
    const scheduleTransaction = async (transactionData: any, startDate: Date) => {
        const scheduledRef = collection(db, 'users', session.data?.user?.email as string, 'scheduled');
        let upcomingDate = calculateNextDate(startDate, transactionData.frequency);
    
        // Create the scheduled transaction
        await addDoc(scheduledRef, {
            ...transactionData,
            startDate: startDate,
            upcomingDate: upcomingDate
        });
    };
    
    const calculateNextDate = (startDate: Date, frequency: string): Date => {
        let nextDate = new Date(startDate);
        switch (frequency) {
            case 'Daily':
                nextDate.setDate(nextDate.getDate() + 1);
                break;
            case 'Weekly':
                nextDate.setDate(nextDate.getDate() + 7);
                break;
            case 'Twice a month':
                nextDate.setDate(nextDate.getDate() + 15);
                break;
            case 'Monthly':
                nextDate.setMonth(nextDate.getMonth() + 1);
                break;
            case 'Yearly':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                break;
        }
        return nextDate;
    };
    
    

    const handleClose = () => {
        form.reset()      
        onClose()
    }


    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="Add a transaction">
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <Select
                        label="Type"
                        data={['Expense', 'Income']}
                        placeholder="Type"
                        {...form.getInputProps('type')}
                    />
                    <DatePickerInput
                        label="Date"
                        required
                        placeholder={new Date().toLocaleDateString()}
                        {...form.getInputProps('date')}
                    />

                    <Autocomplete
                        label="Category"
                        data={listofCategories}
                        required
                        {...form.getInputProps('category')}
                    />
                    <TextInput
                        label="Memo"
                        {...form.getInputProps('memo')}
                    />
                    <NumberInput
                        label="Amount"
                        required
                        placeholder="Amount"
                        {...form.getInputProps('amount')}
                    />

                    <Select 
                        label="Frequency"
                        data={
                            [
                                "Never",
                                "Daily",
                                "Weekly",
                                "Twice a month",
                                "Monthly",
                                "Yearly"
                            ]
                        }
                        {...form.getInputProps('frequency')}

                    />
                    <Button type="submit" mt="md">Submit</Button>
                </form>
            </Modal>
        </>
    );



   
}