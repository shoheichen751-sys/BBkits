import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function LowStockAlerts({ alerts }) {
    const formatStock = (stock, unit) => {
        return Number(stock).toLocaleString('pt-BR', { minimumFractionDigits: 3 }) + ' ' + unit;
    };

    const MaterialRow = ({ material, isCritical }) => (
        <tr className={isCritical ? 'bg-red-50' : 'bg-yellow-50'}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${isCritical ? 'bg-red-100' : 'bg-yellow-100'}`}>
                        {isCritical ? '!' : ''}
                    </span>
                    <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{material.material_name}</div>
                    </div>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    isCritical ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {isCritical ? 'CRITICAL' : 'LOW'}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatStock(material.current_stock, material.unit)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatStock(material.reserved_stock, material.unit)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <span className={isCritical ? 'text-red-600' : 'text-yellow-600'}>
                    {formatStock(material.available_stock, material.unit)}
                </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {formatStock(material.minimum_stock, material.unit)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Link
                    href={`/admin/materials/${material.material_id}/edit`}
                    className="text-purple-600 hover:text-purple-900"
                >
                    Edit
                </Link>
            </td>
        </tr>
    );

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Low Stock Alerts</h2>
                        <p className="mt-1 text-sm text-gray-600">Materials that need attention due to low or critical stock levels</p>
                    </div>
                    <Link
                        href="/admin/materials"
                        className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        Back to Materials
                    </Link>
                </div>
            }
        >
            <Head title="Low Stock Alerts" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-red-500">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                            <span className="text-red-600 text-lg font-bold">!</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Critical (No Stock)</dt>
                                            <dd className="text-2xl font-bold text-red-600">{alerts.total_critical}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-yellow-500">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                            <span className="text-yellow-600 text-lg font-bold">!</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Low Stock</dt>
                                            <dd className="text-2xl font-bold text-yellow-600">{alerts.total_low}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg border-l-4 border-blue-500">
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-blue-600 text-lg font-bold">#</span>
                                        </div>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Total Alerts</dt>
                                            <dd className="text-2xl font-bold text-blue-600">{alerts.total_critical + alerts.total_low}</dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Critical Stock Table */}
                    {alerts.critical.length > 0 && (
                        <div className="bg-white shadow rounded-lg mb-6">
                            <div className="px-4 py-5 border-b border-gray-200 bg-red-50">
                                <h3 className="text-lg font-medium text-red-800">Critical - No Available Stock</h3>
                                <p className="text-sm text-red-600">These materials have zero or negative available stock and require immediate attention.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {alerts.critical.map((material) => (
                                            <MaterialRow key={material.material_id} material={material} isCritical={true} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Low Stock Table */}
                    {alerts.low.length > 0 && (
                        <div className="bg-white shadow rounded-lg">
                            <div className="px-4 py-5 border-b border-gray-200 bg-yellow-50">
                                <h3 className="text-lg font-medium text-yellow-800">Low Stock - Below Minimum</h3>
                                <p className="text-sm text-yellow-600">These materials are running low and should be restocked soon.</p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reserved</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Minimum</th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {alerts.low.map((material) => (
                                            <MaterialRow key={material.material_id} material={material} isCritical={false} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* No Alerts */}
                    {alerts.critical.length === 0 && alerts.low.length === 0 && (
                        <div className="bg-white shadow rounded-lg p-8 text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-green-600 text-2xl">OK</span>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">All Stock Levels Normal</h3>
                            <p className="text-gray-500 mt-2">No materials are currently below minimum stock levels.</p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
