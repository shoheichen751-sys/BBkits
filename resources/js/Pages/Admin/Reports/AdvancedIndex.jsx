import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function AdvancedIndex({ reportTypes }) {
    const icons = {
        'chart-line': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        'currency-dollar': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        'presentation-chart-line': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
        ),
        'exclamation-triangle': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        'scissors': (
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z" />
            </svg>
        ),
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900">Relatórios Avançados</h2>
                        <p className="mt-1 text-sm text-gray-600">
                            Análises detalhadas e insights sobre inventário e custos
                        </p>
                    </div>
                    <Link href="/admin/reports" className="text-gray-600 hover:text-gray-900">
                        Relatórios Básicos
                    </Link>
                </div>
            }
        >
            <Head title="Relatórios Avançados" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reportTypes.map((report) => (
                            <Link
                                key={report.key}
                                href={`/admin/reports/advanced/${report.key}`}
                                className="block bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6 border border-gray-200 hover:border-pink-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="flex-shrink-0 p-3 bg-pink-50 rounded-lg text-pink-600">
                                        {icons[report.icon] || icons['chart-line']}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900">{report.name}</h3>
                                        <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Quick Stats */}
                    <div className="mt-12">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Atalhos Rápidos</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <Link
                                href="/admin/reports/advanced/forecast?forecast_days=7"
                                className="p-4 bg-blue-50 rounded-lg text-center hover:bg-blue-100 transition-colors"
                            >
                                <div className="text-sm font-medium text-blue-900">Previsão 7 dias</div>
                                <div className="text-xs text-blue-600 mt-1">Materiais críticos</div>
                            </Link>
                            <Link
                                href="/admin/reports/advanced/thread-usage"
                                className="p-4 bg-purple-50 rounded-lg text-center hover:bg-purple-100 transition-colors"
                            >
                                <div className="text-sm font-medium text-purple-900">Análise 80/20</div>
                                <div className="text-xs text-purple-600 mt-1">Eficiência de linhas</div>
                            </Link>
                            <Link
                                href="/admin/reports/advanced/wastage"
                                className="p-4 bg-red-50 rounded-lg text-center hover:bg-red-100 transition-colors"
                            >
                                <div className="text-sm font-medium text-red-900">Perdas do Mês</div>
                                <div className="text-xs text-red-600 mt-1">Ajustes e desperdícios</div>
                            </Link>
                            <Link
                                href="/admin/reports/advanced/cost-analysis"
                                className="p-4 bg-green-50 rounded-lg text-center hover:bg-green-100 transition-colors"
                            >
                                <div className="text-sm font-medium text-green-900">Análise Mensal</div>
                                <div className="text-xs text-green-600 mt-1">Custos por categoria</div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
