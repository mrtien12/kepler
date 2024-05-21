import {Category} from '@/types/category'
import {doc, getDoc,collection,query,onSnapshot} from 'firebase/firestore';
import {db} from '@/firebase';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
export const useAllCategory = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'categories'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const categoriesData: Category[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    category: doc.data().category,
                    spent: doc.data().spent,
                    available: doc.data().available,
                    transactionids: doc.data().transactionids,
                    budgetid: doc.data().budgetid,
                    startDate: doc.data().startDate.toDate()
                }));
                setCategories(categoriesData);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [session]);

    return categories;
}