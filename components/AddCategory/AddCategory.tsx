// import { Category } from "@/types/category";
// import { useDisclosure } from "@mantine/hooks";
// import { db } from "@/firebase";
// import { useSession } from "next-auth/react";
// import { useForm } from "@mantine/form";
// import { redirect } from "next/navigation";
// import { Popover,Button,Group,TextInput} from "@mantine/core";
// import { ActionIcon } from "@mantine/core";
// import { IconHeartUp } from "@tabler/icons-react";
// import { addDoc, collection } from "firebase/firestore";

// interface AddCategoryProps {
//     categoryGroupId: string;
// }
// export default function AddCategory({categoryGroupId}: AddCategoryProps) {
//     const session = useSession(
//         {
//             required: true,
//             onUnauthenticated() {
//                 redirect('/signin');
//             }
//         }   
//     )

//     const form = useForm({
//         initialValues: {
//             category: '',
//             budgeted: 0,
//             spent: 0,
//             available: 0,
//             budgetid: '',
//             transactionids: []
//         },
//     });

//     const [opened, {open, close}] = useDisclosure(false);

//     const handleClose = () => {
//         form.reset()
//         close()
//     }

//     const addCategorytoFirebase = async (categoryGroupId: string, category: Category) => {
//         await addDoc(collection(db, 'users', session.data?.user?.email as string, 'categoryGroup', categoryGroupId, 'categories'), category);
//     }


//     const handleSubmit = async (values: Category) => {
//         await addCategorytoFirebase(categoryGroupId, values)
//         handleClose()
//     }
//     console.log(categoryGroupId)
//     return (
//         <Popover opened={opened} onClose={handleClose}>

//             <Popover.Target>
//                 <ActionIcon variant="light"
//                     onClick={open}
            
//                 >
//                     <IconHeartUp />
//                 </ActionIcon>
//             </Popover.Target>
//             <Popover.Dropdown>
//                 <form onSubmit={form.onSubmit(handleSubmit)}>
//                     <TextInput 
//                         label = "Category"
//                         placeholder = "Category"
//                         {...form.getInputProps('category')}
//                     />
//                 <Group justify='flex-end'>
//                     <Button type='submit'>
//                         Ok
//                     </Button>

//                     <Button variant="light" onClick={close}>
//                         Cancel
//                     </Button>
//                 </ Group>
//                 </form>
//             </Popover.Dropdown>
//         </Popover>
//     )

// }