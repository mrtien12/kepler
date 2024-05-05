import {Modal,TextInput,NumberInput,Button,Select, Autocomplete} from '@mantine/core'
import {useForm} from '@mantine/form'
import {useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import {db} from '@/firebase'
import { Transaction } from '@/types/transaction'
import { doc, setDoc,where,updateDoc,collection,query,addDoc,getDocs,deleteDoc } from 'firebase/firestore'
import { useAllCategory } from '@/hooks/useAllCategory'
import { DatePickerInput } from '@mantine/dates'
interface EditModalProps {
    opened: boolean;
    onClose: () => void;
    accountId: string;
    oldTransaction: Transaction |null;
}


export default function EditModal({ opened, onClose,accountId,oldTransaction }: EditModalProps) {

    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )
    const categories = useAllCategory();
    const listofCategories = categories.map((category) => category.category);
    const form = useForm({
        initialValues: {
            date : oldTransaction?.date,
            category: oldTransaction?.category,
            memo: oldTransaction?.memo,
            amount: oldTransaction?.amount,
            type: oldTransaction?.type,

        },
    });



const handleSubmit = async (values: any) => {
    const transactionData = {
        date: values.date || oldTransaction?.date,
        category: values.category || oldTransaction?.category,
        memo: values.memo || oldTransaction?.memo,
        amount: values.amount !== undefined ? values.amount : oldTransaction?.amount,
        type: values.type || oldTransaction?.type,
    };
    const transactionId = oldTransaction!.id;
    const userEmail = session.data?.user?.email as string;
    const oldCategory = oldTransaction!.category;
    const newCategory = transactionData.category;
    
    // Update the transaction in Firestore
    await setDoc(doc(db, 'users', userEmail, 'accounts', accountId, 'transactions', transactionId), transactionData);
    console.log('Transaction updated successfully!');

    const categoriesRef = collection(db, 'users', userEmail, 'categories');

    if (oldCategory !== newCategory) {
        // Handle updating category details
        const oldCategoryQuery = query(categoriesRef, where("category", "==", oldCategory));
        const oldCategoryDoc = await getDocs(oldCategoryQuery);
        if (!oldCategoryDoc.empty) {
            const docRef = oldCategoryDoc.docs[0].ref;
            const oldData = oldCategoryDoc.docs[0].data() as any; // Assumption: data follows a known schema
            const newTransactionIds = oldData.transactionids.filter((id: string) => id !== transactionId);
            const newSpent = oldData.spent - oldTransaction!.amount;

            if (newTransactionIds.length === 0) {
                // Delete the old category if no transactions are left
                await deleteDoc(docRef);
                console.log('Old category deleted as it has no more transactions.');
            } else {
                // Update the old category with new transaction IDs and spent
                await updateDoc(docRef, {
                    transactionids: newTransactionIds,
                    spent: newSpent
                });
            }
        }

        // Add transaction ID to the new category or create it if it doesn't exist
        const newCategoryQuery = query(categoriesRef, where("category", "==", newCategory));
        const newCategoryDoc = await getDocs(newCategoryQuery);
        if (!newCategoryDoc.empty) {
            const docRef = newCategoryDoc.docs[0].ref;
            const newData = newCategoryDoc.docs[0].data() as any; // Assumption: data follows a known schema
            await updateDoc(docRef, {
                transactionids: [...newData.transactionids, transactionId],
                spent: newData.spent + transactionData.amount
            });
            console.log('Transaction ID added to existing new category.');
        } else {
            // Create a new category
            await addDoc(categoriesRef, {
                category: newCategory,
                budgeted: 0,
                spent: transactionData.amount,
                available: 0,
                transactionids: [transactionId]
            });
            console.log('New category created with transaction.');
        }
    } else {
        // If the category hasn't changed but other details might have, update spent amount in the same category
        const sameCategoryQuery = query(categoriesRef, where("category", "==", newCategory));
        const categoryDoc = await getDocs(sameCategoryQuery);
        if (!categoryDoc.empty) {
            const docRef = categoryDoc.docs[0].ref;
            const categoryData = categoryDoc.docs[0].data() as any; // Ensure proper type handling
            const newSpent = categoryData.spent - oldTransaction!.amount + transactionData.amount;
            await updateDoc(docRef, {
                spent: newSpent
            });
        }
    }

    onClose(); // Close the modal after successful submission
};

    

    return (
        <>
            <Modal opened={opened} onClose={onClose} title="Edit transaction">
                <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
                    
                    <DatePickerInput
                        label="Date"
                        required
                        placeholder={oldTransaction?.date.toLocaleDateString()}
                        {...form.getInputProps('date')}
                    />
                    <Select
                        label="Type"
                        data={['Expense', 'Income']}
                        placeholder={oldTransaction?.type}
                        {...form.getInputProps('type')}
                    />
                    <Autocomplete
                        label="Category"
                        
                        data={listofCategories}
                        placeholder={oldTransaction?.category}
                        {...form.getInputProps('category')}
                    />
                    <TextInput
                        label="Memo"
                        {...form.getInputProps('memo')}
                        placeholder={oldTransaction?.memo}

                    />
                    <NumberInput
                        label="Amount"
                        {...form.getInputProps('amount')}
                        placeholder={Math.abs(oldTransaction?.amount!).toString()}
                    />
                    <Button type="submit">Submit</Button>
                </form>
            </Modal>
        </>
    )
}
