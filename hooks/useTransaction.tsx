import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { useSession } from 'next-auth/react';
import { Transaction } from '@/types/transaction';

export function useTransactions(accountId: string) {
    const session = useSession();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(
                collection(db, 'users', session.data.user.email, 'accounts', accountId, 'transactions')
            );
            
            // Here we use onSnapshot instead of getDocs for real-time updates
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const transactionsData: Transaction[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    date: doc.data().date.toDate(),
                    category: doc.data().category,
                    memo: doc.data().memo,
                    amount: doc.data().amount,
                    type: doc.data().type,
                    frequency: doc.data().frequency,
                }));
                setTransactions(transactionsData);
                setStatus('success');
            }, (error) => {
                console.error('Error fetching transactions: ', error);
                setStatus('error');
            });

            // Cleanup subscription on component unmount
            return () => unsubscribe();
        }
    }, [session, accountId]);

    return { data: transactions, status };
}
