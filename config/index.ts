import { IconComponents, IconDashboard, IconLock, IconMoodSmile } from '@tabler/icons-react';
import { NavItem } from '@/types/nav-item';

export const navLinks: NavItem[] = [

	{
		label: 'Components',
		icon: IconComponents,
		initiallyOpened: false,
		links: [
			{
				label: 'Table',
				link: '/dashboard/table',
			},
			{
				label: 'Form',
				link: '/dashboard/form',
			},
		],
	},
	{
		label: 'Auth',
		icon: IconLock,
		initiallyOpened: false,
		links: [
			{
				label: 'Login',
				link: '/login',
			},
			{
				label: 'Register',
				link: '/register',
			},
		],
	},
	
];