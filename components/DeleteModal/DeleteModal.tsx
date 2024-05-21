import { Modal, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { db } from '@/firebase';
import { Transaction } from '@/types/transaction';
import { doc, setDoc, deleteField, deleteDoc, collection, query, getDocs, getDoc, updateDoc, where } from 'firebase/firestore';

interface DeleteModalProps {
  opened: boolean;
  onClose: () => void;
  accountId: string;
  oldTransaction: Transaction | null;
}

export default function DeleteModal({ opened, onClose, accountId, oldTransaction }: DeleteModalProps) {
  const session = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/signin');
    }
  });

  const form = useForm();

  const handleDelete = async () => {
    if (!oldTransaction) return;
    
    const transactionId = oldTransaction.id;
    const userEmail = session.data?.user?.email as string;

    // Reference to the transaction document
    const transactionRef = doc(db, 'users', userEmail, 'accounts', accountId, 'transactions', transactionId);

    // Retrieve the transaction data
    const transactionDoc = await getDoc(transactionRef);
    const transactionData = transactionDoc.data();
    if (!transactionData) return;

    const accountRef = doc(db, 'users', userEmail, 'accounts', accountId);

    const accountDoc = await getDoc(accountRef);

    const accountData = accountDoc.data();
    if (!accountData) return;
    // Update the account balance
    if (transactionData.type === 'Expense') {
      await updateDoc(accountRef, {
        accountBalance: accountData.accountBalance - oldTransaction.amount
      });
    } else if (transactionData.type === 'Income') {
      await updateDoc(accountRef, {
        accountBalance: transactionData.accountBalance + oldTransaction.amount
      });
    }

    // Delete the transaction
    await deleteDoc(transactionRef);
    console.log('Transaction deleted successfully!');

    // Check if the category needs to be updated or deleted
    const categoriesRef = collection(db, 'users', userEmail, 'categories');
    const categoryQuery = query(categoriesRef, where("transactionids", "array-contains", transactionId));
    const categoryDocs = await getDocs(categoryQuery);
    
    if (!categoryDocs.empty) {
      categoryDocs.forEach(async (doc1) => {
        const categoryData = doc1.data();

        // Remove transaction ID from the category
        const updatedTransactionIds = categoryData.transactionids.filter((id: string) => id !== transactionId);

        if (updatedTransactionIds.length === 0 && categoryData.budgetid === "") {
          // Delete the category if no transactions are left
          await deleteDoc(doc1.ref);
          console.log('Category deleted successfully because it had no more transactions.');
        } else {
          // Update the category with the new transaction ID list and adjust spent amount if needed
          await updateDoc(doc1.ref, {
            transactionids: updatedTransactionIds,
            spent: categoryData.spent - oldTransaction.amount
          });
        }
      });
    }

    onClose(); // Close the modal after handling the deletion
  }

  return (
    <Modal opened={opened} onClose={onClose} title="Delete transaction">
      <form onSubmit={form.onSubmit(() => handleDelete())}>
        <p>Are you sure you want to delete this transaction?</p>
        <Button type="submit" color="red">Delete</Button>
      </form>
    </Modal>
  );
}
