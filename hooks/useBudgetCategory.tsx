import {db} from '@/firebase';
import {doc, getDoc,collection,query,onSnapshot, where} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import parseTimeid from '@/utils/function/parseTimeid';
// import { SpendingBudget, SavingsBudget, DebtPaymentBudget } from '@/types/budget';
import { redirect } from 'next/navigation';

//take 3 as 3 data types: SpendingBudget, SavingsBudget, DebtPaymentBudget

export function useBudgetCategory(timeid: string) {
    const [budgetedCategories, setBudgetedCategories] = useState<any[]>([]);
    const {startDate,endDate} = parseTimeid(timeid);

    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )

    useEffect(() => {
        if (session.data?.user?.email) {
            const q = query(collection(db, "users", session.data.user.email, "budgets"),where("timestart", ">=", startDate),where("timestart", "<=", endDate));
            const unsubscribe = onSnapshot(q, async (snapshot) => {
                const budgetedCategories = snapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                });
                setBudgetedCategories(budgetedCategories);
            });
            return unsubscribe;
        }
    }, [session]);

    return budgetedCategories;
}