import {db} from '@/firebase';
import {doc, getDoc,collection,query,onSnapshot, where} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Category } from '@/types/category';
import parseTimeid from '@/utils/function/parseTimeid';

export default function useNotBudgetCategoryByTime(timeid: string){
    const [categoriesids, setCategories] = useState<string[]>([]);
    const [actual, setActual] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const {startDate,endDate} = parseTimeid(timeid);
    const session = useSession();
    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'categories'), where('startDate', '>=', startDate), where('startDate', '<=', endDate));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const categoriesids: string[] = querySnapshot.docs.map(doc => doc.id);
                const spent: number = querySnapshot.docs.map(doc => doc.data().spent).reduce((a,b) => a+b, 0);

                setCategories(categoriesids);
                setActual(spent);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [session,timeid]);
    return {actual,categoriesids};
}