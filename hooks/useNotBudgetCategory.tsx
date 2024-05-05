import {db} from '@/firebase';
import {doc, getDoc,collection,query,onSnapshot, where} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Category } from '@/types/category';

export const useNotBudgetCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'categories')
            ,where('spent', '<', 0)
            ,where('budgetid', '==', '' )
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const categoriesData: Category[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    category: doc.data().category,
                    budgeted: doc.data().budgeted,
                    spent: doc.data().spent,
                    available: doc.data().available,
                    transactionids: doc.data().transactionids,
                    budgetid: doc.data().budgetid
                }));
                setCategories(categoriesData);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [session]);

    return categories;
}