import { getSession } from '@/actions/session';
import { redirect } from 'next/navigation';
import React from 'react';

const page = async() => {
    const user = await getSession();
    if(user) {
        redirect('/dashboard/profile')
    }
    return (
        <div>
            <button onClick={() => { redirect('dashboard/profile')}}> Click to update profile </button>
        </div>
    );
};

export default page;