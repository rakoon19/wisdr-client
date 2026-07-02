"use client";
import { Button } from '@heroui/react';
import React from 'react';

const DashboardPage = () => {
    return (
        <div>
           dashboard 
        <Button onClick={() => { window.location.href = '/dashboard/admin'; }}>Admin</Button>
        </div>
    );
};

export default DashboardPage;