import { useEffect, useState } from 'react';
import { db } from '@/firebase';
import { collection, query, onSnapshot } from 'firebase/firestore';
import { useSession } from 'next-auth/react';

export interface Account {
    id: string;
    accountName: string;
    accountBalance: number;
    accountType: string;
    interestRate: number;
    payment: number;
}

export function useAccounts() {
    const session = useSession();
    const [accounts, setAccounts] = useState<Account[]>([]);

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session?.data?.user?.email as string, 'accounts'));
            
            // Here we use onSnapshot instead of getDocs for real-time updates
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const accountsData: Account[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    accountName: doc.data().accountName,
                    accountBalance: doc.data().accountBalance,
                    accountType: doc.data().accountType,
                    interestRate: doc.data().interestRate,
                    payment: doc.data().payment
                    
                }));
                setAccounts(accountsData);
            });

            // Cleanup subscription on component unmount
            return () => unsubscribe();
        }
    }, [session]);

    return accounts;
}
