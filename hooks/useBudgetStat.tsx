import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import BudgetPage from "@/types/budgetPage";
import {db} from '@/firebase';
import { collection, query, onSnapshot,where } from "firebase/firestore";

export default function useBudgetStat() {
    const [budgetPages, setbudgetPage] = useState<BudgetPage[]>([]);
    const [loading, setLoading] = useState(true);
    const session = useSession();
    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, 'users', session.data?.user?.email as string, 'budgetPage'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const budgetPages: BudgetPage[] = querySnapshot.docs.map(doc => {
                    return {
                        timeid: doc.data().timeid,
                        startDate: doc.data().startDate.toDate(),
                        endDate: doc.data().endDate.toDate(),
                        budgetCategories: doc.data().budgetCategories,
                        nonBudgetCategories: doc.data().nonBudgetCategories,
                        allocation: doc.data().allocation,
                        actual: doc.data().actual
                    }
                });
                
                setbudgetPage(budgetPages);
                setLoading(false);
            });
            return () => unsubscribe();
        }
    }, [session]);
    return budgetPages;
    
    }