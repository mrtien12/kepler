'use client'

import { AppShell,useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {Navbar} from "@/components/Navbar/Navbar";
import { getAuth } from "firebase/auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import {auth} from '@/firebase';
import { IconComponents, IconDashboard, IconLock, IconMoodSmile } from '@tabler/icons-react';
import { useAccounts } from "@/hooks/useAccount";
import { NavItem } from '@/types/nav-item';
interface Props {
    children: React.ReactNode
}

export default function LoggedinLayout(
    {children} : Props
) {
    const session = useSession(
		{
			required: true,
			onUnauthenticated() {
				redirect('/signin');
			}
		}
	)

    
    const accounts = useAccounts();
    const budgetAccounts = accounts.filter(account => ['Checking', 'Savings', 'Credit Card'].includes(account.accountType));
    const loanAccounts = accounts.filter(account => ['Mortage', 'Auto Loan', 'Personal Loan'].includes(account.accountType));
    const navLinks: NavItem[] = [
        {
            label: 'Budgeted',
            icon: IconComponents,
            initiallyOpened: true,
            links: budgetAccounts.map(account => ({
                label: account.accountName,
                link: `/accounts/${account.id}`,
                balance: account.accountBalance
            }))
        },
        {
            label: 'Loans',
            icon: IconLock,
            initiallyOpened: true,
            links: loanAccounts.map(account => ({
                label: account.accountName,
                link: `/accounts/${account.id}`,
                balance: account.accountBalance
            }))
        }
    ];

    const [opened, {toggle}] = useDisclosure();
    const {colorScheme} = useMantineColorScheme();
    const theme = useMantineTheme();
    const bg = colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0];
    
    return (
        <AppShell
        header={{ height: 20 }}
        footer={{ height: 20 }}
        navbar={{ width: 250, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        aside={{ width: 300, breakpoint: 'md', collapsed: { desktop: false, mobile: true } }}
        padding="md"
        >
            <AppShell.Navbar>
                <Navbar data={navLinks} hidden={!opened} />
            </AppShell.Navbar>
            <AppShell.Main  style={{ paddingTop: '4rem' }}>
                {children}
            </AppShell.Main>
        </AppShell>
    )
}