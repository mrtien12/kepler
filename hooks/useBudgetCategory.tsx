import {db} from '@/firebase';
import {doc, getDoc,collection,query,onSnapshot, where} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { SpendingBudget, SavingsBudget, DebtPaymentBudget } from '@/types/budget';
import { redirect } from 'next/navigation';

//take 3 as 3 data types: SpendingBudget, SavingsBudget, DebtPaymentBudget

export function useBudgetCategory() {
    const [budgetedCategories, setBudgetedCategories] = useState<any[]>([]);
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
            const q = query(collection(db, 'users', session?.data?.user?.email as string, 'budgets'));
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const budgetData: any[] = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    if (data.type === 'spending') {
                        const budget: SpendingBudget = {
                            name: data.name,
                            categoryId: data.categoryId,
                            value: data.value,
                            type: data.type,
                            frequency: data.frequency
                        }
                        return budget;
                    } else if (data.type === 'savings') {
                        const budget: SavingsBudget = {
                            name: data.name,
                            categoryId: data.categoryId,
                            value: data.value,
                            type: data.type,
                            date: data.date
                        }
                        return budget;
                    } else if (data.type === 'debt') {
                        const budget: DebtPaymentBudget = {
                            name: data.name,
                            categoryId: data.categoryId,
                            value: data.value,
                            type: data.type,
                            date: data.date
                        }
                        return budget;
                    }
                });
                setBudgetedCategories(budgetData);
            });
            return () => unsubscribe();
        }
    }, [session]);

    return budgetedCategories;
}