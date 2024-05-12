import { Modal, TextInput, Select, Button, NumberInput, Autocomplete } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useState } from 'react'
import {getAuth} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc,addDoc,getDocs,query,updateDoc, arrayUnion,where } from "firebase/firestore";
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
            payee: '',
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
        }
    
        // Add transaction to Firestore
        const transactionRef = await addDoc(collection(db, 'users', session.data?.user?.email as string, 'accounts', accountId, 'transactions'), transactionData);
    
        // Check if the category exists and update or create accordingly
        const categoriesRef = collection(db, 'users', session.data?.user?.email as string, 'categories');
        const querySnapshot = await getDocs(query(categoriesRef, where("category", "==", transactionData.category)));
        if (querySnapshot.empty) {
            // Category does not exist, create a new one
            await addDoc(categoriesRef, {
                category: transactionData.category,
                spent: transactionData.amount,
                available: 0,
                budgetid: '',
                transactionids: [transactionRef.id]  // Add new transaction ID
            });
        } else {
            // Category exists, update the existing category
            querySnapshot.forEach(async (doc) => {
                const categoryData = doc.data();
                await updateDoc(doc.ref, {
                    spent: categoryData.spent + transactionData.amount,  // Update spent amount
                    transactionids: arrayUnion(transactionRef.id)  // Add new transaction ID to array
                });
            });
        }
    
        console.log('Transaction added successfully!');
        form.reset()
        onClose(); // Close the modal after successful submission
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