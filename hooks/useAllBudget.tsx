import {Budget} from '@/types/budget'
import {doc, getDoc,collection,query,onSnapshot} from 'firebase/firestore';
import {db} from '@/firebase';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
export default function useAllBudget(){
    const [budgets, setBudget] = useState<Budget[]>([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'budgets'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const budgets: Budget[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    categoryId: doc.data().categoryId,
                    value: doc.data().value,
                    type: doc.data().type,
                    budgetType: doc.data().budgetType,
                    time: doc.data().time,
                    timestart: doc.data().timestart
                }));
                setBudget(budgets);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [session]);

    return budgets;
}