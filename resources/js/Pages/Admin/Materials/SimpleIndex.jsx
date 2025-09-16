import { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import toast from 'react-hot-toast';

export default function SimpleIndex({ materials, filters, stats }) {
    const { auth } = usePage().props;
    const user = auth.user;
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    // Permission helpers
    const canEditMaterials = () => {
        return ['admin', 'manager', 'production_admin'].includes(user.role);
    };

    const canManageMaterials = () => {
        return ['admin', 'manager'].includes(user.role);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/materials', { search, status }, { preserveState: true });
    };
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
                        <h3 className="text-lg font-medium mb-4">Step 4: Event Handler Test</h3>
                        <p>✅ handleSearch function defined</p>
                        <p>✅ router.get with hardcoded URL</p>
                        <button
                            onClick={handleSearch}
                            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
                        >
                            🧪 Test handleSearch (router.get)
                        </button>
                        <p>Materials count: {materials?.data?.length || 0}</p>
                        <p>Stats total: {stats?.total || 0}</p>
                        <p>User role: {user?.role || 'unknown'}</p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}