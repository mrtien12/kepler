import { IconCirclePlus,IconTrash } from "@tabler/icons-react";
import { Button, Text } from "@mantine/core";
import AddTransactionModal from '@/components/AddTransaction/AddTransactionModal'
import { useDisclosure } from "@mantine/hooks";
import {modals} from '@mantine/modals'
import { getFirestore,deleteDoc, collection, doc, setDoc,addDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import {db} from '@/firebase';
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
interface AccountBarProps {
    accountId: string;
}


export function AccountBar({accountId}: AccountBarProps) {

  const router = useRouter();
  const [opened,{open,close}] = useDisclosure(false);
  const session = useSession(
    {
      required: true,
      onUnauthenticated() {
        redirect('/signin');
      }
    }
  )

  const deleteAccountinFirebase = async (accountId : string) => {
    await deleteDoc(doc(db,'users', session.data?.user?.email as string, "accounts", accountId));
    router.push('/dashboard/20244');
    console.log("hate u ")
  }
  const openModal = () => modals.openConfirmModal({
    title: 'Bạn chắc chứ',
    children: (
      <Text size="sm">
        Bạn có đồng ý xóa tài khoản này không ? (Các giao dịch liên quan đến tài khoản cũng sẽ bị xóa)
      </Text>
    ),
    labels: { confirm: 'Confirm', cancel: 'Cancel' },
    onCancel: () => console.log('Cancel'),
    onConfirm: () => deleteAccountinFirebase(accountId)
  });
 




  return (
    <>
    <AddTransactionModal opened={opened} onClose={close} accountId={accountId} />
    <Button leftSection={<IconCirclePlus />} onClick={open}> Add Transaction </Button>
    <Button leftSection={<IconTrash />} onClick={openModal}> Delete Account </Button>
    </>
  )
}