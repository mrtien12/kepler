import React, {useMemo, useState} from 'react';
import { useForm } from '@mantine/form'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { db } from '@/firebase'
import { Category } from '@/types/category'
import { collection, getDocs, query } from 'firebase/firestore'
import { Paper, Text } from '@mantine/core'

export default function CategoryTable() {
    const session = useSession(
        {
            required: true,
            onUnauthenticated() {
                redirect('/signin');
            }
        }
    )
    return (
        <Paper shadow='xs' p="x1">
            <Text> heloow </Text>
        </Paper>
    )
}