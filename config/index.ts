import { IconComponents, IconDashboard, IconLock, IconMoodSmile } from '@tabler/icons-react';
import { NavItem } from '@/types/nav-item';

export const navLinks: NavItem[] = [

	{
		label: 'Budgeted',
		icon: IconComponents,
		initiallyOpened: true,
		links: [
			{
				label: 'Table',
				link: '/dashboard/table',
				balance: 1000
			},
			{
				label: 'Form',
				link: '/dashboard/form',
				balance: -1000
			},
		],
	},
	{
		label: 'Loan',
		icon: IconLock,
		initiallyOpened: true,
		links: [
			{
				label: 'Login',
				link: '/login',
				balance: -1000
			},
			{
				label: 'Register',
				link: '/register',
				balance: -1000
			},
		],
	},
	
];