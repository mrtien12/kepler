'use client'

import { AppShell,useMantineColorScheme, useMantineTheme } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {Navbar} from "@/components/Navbar/Navbar";
import {navLinks} from '@/config'


interface Props {
    children: React.ReactNode
}

export default function DashboardLayout(
    {children} : Props
) {

}