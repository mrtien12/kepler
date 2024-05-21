import {db} from '@/firebase';
import {doc, getDoc,collection,query,onSnapshot, where} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Category } from '@/types/category';
import parseTimeid from '@/utils/function/parseTimeid';
import { start } from 'repl';

export default function useNotBudgetCategory(timeid : string){
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    const {startDate,endDate} = parseTimeid(timeid);  
    console.log(startDate,endDate)  
    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'categories')
            ,where('spent', '<', 0)
            ,where('budgetid', '==', '' ),
            where('startDate', '>=', startDate),
            where('startDate', '<=', endDate)
            );
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const categoriesData: Category[] = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    category: doc.data().category,
                    budgeted: doc.data().budgeted,
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