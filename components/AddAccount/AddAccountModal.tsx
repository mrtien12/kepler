// import { Modal, TextInput ,Select, Button,NumberInput } from "@mantine/core";
// import { Input, InputBase, Combobox, useCombobox } from '@mantine/core';
// import {useForm} from '@mantine/form';
// import {useState } from 'react'
// interface AddAccountModalProps {
//     opened: boolean;
//     onClose: () => void;

// }
// const category = 
// [       
//     {group:"Budget Account",items:['Checking','Savings','Credit Card']},
//     {group:"Mortages and Loans",items:['Mortage','Auto Loan','Personal Loan']},
//     {group:"Tracking Account",items:['Liability','Asset']}

// ]


// function isLoans(accountType: string){
  
//   const categoryItem = category.find(
//     (category) => category.items.includes(accountType)
//   );

//   // Return true if the category group is "Mortgages and Loans"
//   return categoryItem?.group === "Mortages and Loans";
// }

// export default function AddAccountModal(AddAccountModalProps: AddAccountModalProps) {

//   const form = useForm({
//     initialValues: {
//       accountName: '',
//       accountType: '',
//       accountBalance: '',
//       interest: ''
//     },
    


//   });

  

//   const [value, setValue] = useState<string | null>(null); 


//   return (
//   <>
//     <Modal  opened={AddAccountModalProps.opened} 
//             onClose = {AddAccountModalProps.onClose}
//             title="Add an account">
//             <form onSubmit={form.onSubmit((values) => console.log(values))}>
//               <TextInput
//               label = "Give it a nickname"
//               required
//               placeholder = "Account Name"
//               value = {form.values.accountName}
//               {...form.getInputProps('accountName')}

//             />
//               <Select 
//                 label = "Account Type"
//                 placeholder="Select account type"
//                 data={category}
//                 value={form.values.accountType}
//                 {...form.getInputProps('accountType')}
                
//               />

//               <NumberInput
//                 label="Starting Balance"
//                 placeholder="0"
//                 value={form.values.accountBalance}
//                 {...form.getInputProps('accountBalance')}
//               />


//               <Button type="submit" mt="md"></Button>




//             </form>



//     </Modal>
//     </>
//   );

// }


import { Modal, TextInput, Select, Button, NumberInput } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useState } from 'react'
import {getAuth} from 'firebase/auth';
import { getFirestore, collection, doc, setDoc,addDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import {db} from '@/firebase';
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import { useAccounts } from "@/hooks/useAccount";
interface AddAccountModalProps {
    opened: boolean;
    onClose: () => void;
}


const category = [       
    { group: "Budget Account", items: ['Checking', 'Savings', 'Credit Card'] },
    { group: "Mortages and Loans", items: ['Mortage', 'Auto Loan', 'Personal Loan'] }
];

function isLoans(accountType: string ) {
    const categoryItem = category.find(
        (category) => category.items.includes(accountType)
    );
    return categoryItem?.group === "Mortages and Loans";
}

export default function AddAccountModal({ opened, onClose }: AddAccountModalProps) {
    
    const session = useSession(
		{
			required: true,
			onUnauthenticated() {
				redirect('/signin');
			}
		}
    )
    
    
    const form = useForm({
        initialValues: {
            accountName: '',
            accountType: 'Checking',
            accountBalance: '',
            interest: '',
            payment: ''
        },
    });




    const [showInterest, setShowInterest] = useState(false);

    // This function updates both the form value and the condition for showing the interest input
    const handleAccountTypeChange = (value: string |null) => {
        setShowInterest(isLoans(value!));
        form.setValues({'accountType': value! })
    };

    const addAccountToFirestore = async (accountData: any) => {
        if (isLoans(accountData.accountType) || accountData.accountType === 'Credit Card') {
            // If the account type belongs to "Mortages and Loans" or "Budget Account" (Credit Card), change the balance to negative if not 0
            if (parseFloat(accountData.accountBalance) !== 0) {
                accountData.accountBalance = -Math.abs(parseFloat(accountData.accountBalance));
            }

        }
            // Add account data to Firestore
            await addDoc(collection(db, 'users', session.data?.user?.email as string , 'accounts'), accountData);
            
            console.log('Account added successfully!');
        
    };

    const handleClose = () => {
        form.reset(); // Reset the form when closing the modal
        onClose(); // Call the original onClose function passed as prop
        handleAccountTypeChange('Checking')
        
    };

    return (
        <>
            <Modal opened={opened} onClose={handleClose} title="Add an account">
                <form onSubmit={form.onSubmit((values) => addAccountToFirestore(values)
                    .then(() =>{
                        handleClose();
                    }))}>
                    <TextInput
                        label="Give it a nickname"
                        required
                        placeholder="Account Name"
                        {...form.getInputProps('accountName')}
                    />
                    <Select 
                        label="Account Type"
                        placeholder="Select account type"
                        data={category}
                        value={form.values.accountType}
                        onChange={handleAccountTypeChange}
                    />
                    <NumberInput
                        label="Starting Balance"
                        placeholder="0"
                        {...form.getInputProps('accountBalance')}
                    />
                    {showInterest && (
                        <NumberInput
                            label="Interest Rate (%)"
                            placeholder="Enter interest rate"
                            {...form.getInputProps('interest')}
                        />
                        
                    )}

                    {showInterest && (
                        <NumberInput 
                            label="Monthly Payment (%)"
                            placeholder="Enter monthly payment"
                            {...form.getInputProps('payment')}
                        />
                    )}
                    <Button type="submit" mt="md">Submit</Button>
                </form>
            </Modal>
        </>
    );
}
