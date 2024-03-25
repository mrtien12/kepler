'use client';

import { Button,ScrollArea,Text } from '@mantine/core';
import { collection, getDocs } from "firebase/firestore";
import { NavItem } from '@/types/nav-item';
import classes from './Navbar.module.css';
import { NavLinksGroup } from './NavLinksGroup';
import AddAccountModal from '@/components/AddAccount/AddAccountModal'
import {IconLogout,IconCirclePlus,IconReport,IconPaperBag,IconWallet} from '@tabler/icons-react'
import { useDisclosure } from '@mantine/hooks';
import {signOut, useSession} from 'next-auth/react';
import { redirect } from 'next/navigation';
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
	
	const links = data.map(item => <NavLinksGroup key={item.label} {...item} />);
	const [opened,{open,close}] = useDisclosure(false);
	return (
		<>

			<Text> {session?.data?.user?.name} </Text>
			<AddAccountModal opened={opened} onClose={close} />
			<Button className={classes.button} leftSection={<IconWallet />}> Budget </Button>
			<Button className={classes.button} leftSection={<IconReport />}> Reports </Button>
			<Button className={classes.button} leftSection={<IconPaperBag />}> All Accounts </Button>
			<ScrollArea className={classes.links}>
				<div className={classes.linksInner}>{links}</div>
				<Button className = {classes.button} leftSection={<IconCirclePlus />} onClick={open}> Add Account </Button>
			</ScrollArea>
			<Button className={classes.button} leftSection={<IconLogout />}
			onClick={() => signOut()}
			> Log out </Button>
			
		</>
	);
}

// Navbar.requireAuth = true;