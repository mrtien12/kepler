import { useEffect,useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import { Budget } from "@/types/budget";
import {db} from '@/firebase';
import { collection, query, onSnapshot,where } from "firebase/firestore";
import parseTimeid from '@/utils/function/parseTimeid';

export default function useNotBudgetCategoryByTime(timeid: string){
    const [budgetids, setBudgetids] = useState<string[]>([]);
    const [allocation, setAllocation] = useState<number>(0);
    const {startDate,endDate} = parseTimeid(timeid);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'categories'), where('time', '>=', startDate), where('time', '<=', endDate));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const budgetids: string[] = querySnapshot.docs.map(doc => doc.id);
                const allocation: number = querySnapshot.docs.map(doc => doc.data().spent).reduce((a,b) => a+b, 0);
                setBudgetids(budgetids);
                setAllocation(allocation);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [session,timeid]);
    return {allocation,budgetids};

}