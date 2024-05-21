import {Modal} from '@mantine/core'
import {useSession} from 'next-auth/react'
import {redirect} from 'next/navigation'
import {db} from '@/firebase'
import {doc, deleteDoc, getDocs,updateDoc, query,collection,where} from 'firebase/firestore'
interface DeleteBudgetModalProps {
    opened: boolean,
    onClose: () => void,
    budgetId: string
}


export default function DeleteBudgetModal({opened, onClose, budgetId}: DeleteBudgetModalProps){
    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )

    const handleDelete = async () => {
        const userEmail = session.data?.user?.email as string;
        const budgetRef = doc(db, 'users', userEmail, 'budgets', budgetId);
        await deleteDoc(budgetRef);
        console.log('Budget deleted successfully!');

        // Reset the field of budgetId in the category document
        // Reference to the category document
        // There will be only one doc that has that category 
        const categoriesRef = collection(db, 'users', userEmail, 'categories');
        const categoryQuery = query(categoriesRef, where("budgetid", "==", budgetId));
        const categoryDocs = await getDocs(categoryQuery);
        if (!categoryDocs.empty) {
            categoryDocs.forEach(async (doc1) => {
                await updateDoc(doc1.ref, {
                    budgetid: ""
                });
                console.log('Category updated successfully!');
            });
        }

        onClose();

    }

    return (
        

        <>
            <Modal opened={opened} onClose={onClose} title="Delete Budget" size="sm">
                <p>Are you sure you want to delete this budget?</p>
                <div style={{display: 'flex', justifyContent: 'flex-end', marginTop: '20px'}}>
                    <button onClick={handleDelete} style={{marginRight: '10px'}}>Delete</button>
                    <button onClick={onClose}>Cancel</button>
                </div>
            </Modal>
        </>
    )
}