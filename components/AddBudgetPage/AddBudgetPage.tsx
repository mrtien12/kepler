'use client'
import { db } from '@/firebase';
import { Button, Modal, Text } from '@mantine/core';
import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import parseTimeid from '@/utils/function/parseTimeid';
import useNotBudgetCategoryByTime from '@/hooks/useNotBudgetCategoryByTime';
import useBudgetCategoryByTime from '@/hooks/useBudgetCategoryByTime';
import BudgetPage from '@/types/budgetPage';

interface PageProps {
  time: Date | null;
}

export default function AddBudgetPage({ time }: PageProps) {
  const session = useSession();
  const userEmail = session.data?.user?.email;

  const [modalOpened, setModalOpened] = useState(false);
  const [existingPage, setExistingPage] = useState<BudgetPage | null>(null);

  if (time === null) {
    return null;
  }

  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const timeid = year.toString() + month.toString().padStart(2, '0');

  const { allocation, budgetids } = useBudgetCategoryByTime(timeid);
  const { actual, categoriesids } = useNotBudgetCategoryByTime(timeid);

  const { startDate, endDate } = parseTimeid(timeid);

  const addon: BudgetPage = {
    timeid,
    startDate,
    endDate,
    budgetCategories: budgetids,
    nonBudgetCategories: categoriesids,
    allocation,
    actual,
  };

  const checkExistingPage = async () => {
    if (!userEmail) return;

    const q = query(collection(db, 'users', userEmail, 'budgetPage'), where('timeid', '==', timeid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      setExistingPage(querySnapshot.docs[0].data() as BudgetPage);
      setModalOpened(true);
    } else {
      addPage(addon);
    }
  };

  const addPage = async (data: BudgetPage) => {
    if (!userEmail) return;

    const docRef = collection(db, 'users', userEmail, 'budgetPage');
    await addDoc(docRef, data);
    console.log('Document written with ID: ', docRef);
  };

  return (
    <>
      <Button onClick={checkExistingPage}>Add Budget Page</Button>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Duplicate Budget Page"
      >
        <Text>A budget page for the selected month already exists.</Text>
      </Modal>
    </>
  );
}
