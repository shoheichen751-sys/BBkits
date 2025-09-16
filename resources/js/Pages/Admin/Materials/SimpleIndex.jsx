import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function SimpleIndex({ materials, filters, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Materials - Simple Version</h2>
                        <p className="mt-1 text-sm text-gray-600">Testing step by step</p>
                    </div>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h3 className="text-lg font-medium mb-4">Step 2: Import Test</h3>
                        <p>✅ AuthenticatedLayout works</p>
                        <p>✅ useState imported</p>
                        <p>✅ Head, Link, router, usePage imported</p>
                        <p>✅ toast imported</p>
                        <p>✅ usePage().props.auth.user works</p>
                        <p>Materials count: {materials?.data?.length || 0}</p>
                        <p>Stats total: {stats?.total || 0}</p>
                        <p>User role: {user?.role || 'unknown'}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}