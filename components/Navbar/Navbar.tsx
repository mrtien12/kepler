'use client';

import { Button,ScrollArea,Text } from '@mantine/core';
import { collection, getDocs } from "firebase/firestore";
import classes from './Navbar.module.css';
import { NavLinksGroup } from './NavLinksGroup';
import AddAccountModal from '@/components/AddAccount/AddAccountModal'
import {IconLogout,IconCirclePlus,IconReport,IconPaperBag,IconWallet,IconCreditCardPay} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks';
import {signOut, useSession} from 'next-auth/react';
import { redirect } from 'next/navigation';
import {db} from '@/firebase';
import { useAccounts } from '@/hooks/useAccount';
import { NavItem } from '@/types/nav-item';
import { DebtSimulator } from '../DebtSimulator/DebtSimulator';

interface Props {
	data: NavItem[];
	hidden?: boolean;
}


export function Navbar({ data }: Props) {
	const session = useSession(
		{
			required: true,
			onUnauthenticated() {
				redirect('/signin');
			}
		}
	)

	// user_accounts = await getDocs(collection(db, 'accounts', session.user.id));
	
	const links = data.map(item => <NavLinksGroup key={item.label} {...item} />);

	
	const [opened,{open,close}] = useDisclosure(false);
	const [openedDebt,handler] = useDisclosure(false);
	return (
		<>
			<Text>{session.data?.user?.email}</Text>
			<AddAccountModal opened={opened} onClose={close} />
			<DebtSimulator opened={openedDebt} onClose={handler.close} />
			<Button className={classes.button} leftSection={<IconWallet />}> Budget </Button>
			<Button className={classes.button} leftSection={<IconReport />}> Reports </Button>
			<Button className={classes.button} leftSection={<IconPaperBag />}> All Accounts </Button>
			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
			</ScrollArea>
			<Button className = {classes.button} leftSection={<IconCirclePlus />} onClick={open}> Add Account </Button>
			<Button className={classes.button} leftSection={<IconCreditCardPay />} onClick={handler.open}>Debt Simulator</Button>
			<Button className={classes.button} leftSection={<IconLogout />}
			onClick={() => signOut()}
			> Log out </Button>


			
		</>
	);
}

// Navbar.requireAuth = true;