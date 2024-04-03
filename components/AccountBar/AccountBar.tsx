import { IconCirclePlus } from "@tabler/icons-react";
import { Button } from "@mantine/core";
import AddTransactionModal from '@/components/AddTransaction/AddTransactionModal'
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useDisclosure } from "@mantine/hooks";
interface AccountBarProps {
    accountId: string;
}


export function AccountBar({accountId}: AccountBarProps) {

  const [opened,{open,close}] = useDisclosure(false);
  const session = useSession(
    {
      required: true,
      onUnauthenticated() {
        redirect('/signin');
      }
    }
  )
  return (
    <>
    <AddTransactionModal opened={opened} onClose={close} accountId={accountId} />
    <Button leftSection={<IconCirclePlus />} onClick={open}> Add Transaction </Button>
    </>
  )
}