//This hook will return all the transactions of the user within a month like Apr, Mar, ... etc, this written using FireStore query 

// Path: hooks/useAllTransaction.tsx

import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, where,collectionGroup } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { Transaction } from '@/types/transaction';


export function useAllTransactions(startDate: Date, endDate: Date) {
    const session = useSession();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setMonth(startDate.getMonth() - 1);

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setMonth(endDate.getMonth() - 1);

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(
                collectionGroup(db,'transactions'),where(
                    'type', '==', "Expense"
                ),
                where(
                    'date', '>=', adjustedStartDate
                ),
                where(
                    'date', '<=', adjustedEndDate
                )
            );
            
            // Here we use onSnapshot instead of getDocs for real-time updates
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const transactionsData: Transaction[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    date: doc.data().date,
                    category: doc.data().category,
                    memo: doc.data().memo,
                    amount: doc.data().amount,
                    type: doc.data().type
                }));
                setTransactions(transactionsData);
            })
            return () => unsubscribe();
        }
    }, [session])
    return transactions;
}
