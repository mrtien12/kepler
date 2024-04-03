import { Modal, TextInput, Select, Button, NumberInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useState } from 'react'
import {getAuth} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc,addDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import {db} from '@/firebase';
import { redirect } from "next/navigation";
interface AddTransactionModalProps {
    opened: boolean;
    onClose: () => void;
    accountId: string;
}

export default function AddTransactionModal({ opened, onClose,accountId }: AddTransactionModalProps) {
    
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
            date : '',
            payee: '',
            category: '',
            memo: '',
            outflow: 0,
            inflow: 0

        },
    });

    const handleSubmit = async (transactionData: any) => {
        // Add transaction data to Firestore under the specified account
        await addDoc(collection(db, 'users', session.data?.user?.email as string , 'accounts', accountId, 'transactions'), transactionData);
        console.log('Transaction added successfully!');
        onClose(); // Close the modal after successful submission
    };

    return (
        <>
            <Modal opened={opened} onClose={onClose} title="Add a transaction">
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    <TextInput
                        label="Date"
                        required
                        type="date"
                        {...form.getInputProps('date')}
                    />
                    <TextInput
                        label="Payee"
                        required
                        {...form.getInputProps('payee')}
                    />
                    <TextInput
                        label="Category"
                        {...form.getInputProps('category')}
                    />
                    <TextInput
                        label="Memo"
                        {...form.getInputProps('memo')}
                    />
                    <NumberInput
                        label="Outflow"
                        placeholder="0"
                        {...form.getInputProps('outflow')}
                    />
                    <NumberInput 
                        label="Inflow"
                        placeholder="0"
                        {...form.getInputProps('inflow')}
                    />
                    <Button type="submit" mt="md">Submit</Button>
                </form>
            </Modal>
        </>
    );



   
}