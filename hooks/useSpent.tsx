import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { onSnapshot, doc, Firestore } from "firebase/firestore";
import { db } from "@/firebase";
import { Category } from "@/types/category";

export default function useSpent(categoryIds: string[]) {
    const [categories, setCategories] = useState<Record<string, Category | null>>({});
    const [loading, setLoading] = useState(true);
    const { data: session } = useSession();

    useEffect(() => {
        if (session?.user?.email && categoryIds.length > 0) {
            const unsubscribes = categoryIds.map(categoryId => {
                const docRef = doc(db, 'users',session.user!.email!, 'categories', categoryId);
                return onSnapshot(docRef, (docSnapshot) => {
                    setCategories(prev => ({
                        ...prev,
                        [categoryId]: docSnapshot.exists() ? docSnapshot.data() as Category : null
                    }));
                });
            });

            setLoading(false);
            return () => { unsubscribes.forEach(unsubscribe => unsubscribe()); };
        }
    }, [session, JSON.stringify(categoryIds)]); // Serialize categoryIds to ensure effect dependency works correctly

    return { categories, loading };
}
