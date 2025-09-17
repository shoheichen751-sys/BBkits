import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ auth, notifications = [] }) {
    const [processing, setProcessing] = useState(false);

    const markAsRead = (notificationId) => {
        setProcessing(true);
        router.post(route('notifications.mark-as-read', notificationId), {}, {
            onFinish: () => setProcessing(false)
        });
    };

    const markAllAsRead = () => {
        setProcessing(true);
        router.post(route('notifications.mark-all-read'), {}, {
            onFinish: () => setProcessing(false)
        });
    };

    const getNotificationIcon = (type) => {
        const icons = {
            sale_approved: '🎉',
            sale_rejected: '❌',
            new_sale: '📋',
            goal_reached: '🎯',
            payment_approved: '✅',
            payment_rejected: '❌',
            payment_uploaded: '💰',
            production_started: '🏭',
            photo_sent: '📸',
            photo_approved: '✅',
            photo_rejected: '❌',
            order_shipped: '🚚',
            final_payment_reminder: '💰',
            new_user_registration: '👩‍💼'
        };
        return icons[type] || '📌';
    };

    const getTimeAgo = (date) => {
        const now = new Date();
        const notificationDate = new Date(date);
        const diffInSeconds = Math.floor((now - notificationDate) / 1000);

        if (diffInSeconds < 60) return 'agora mesmo';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutos atrás`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} horas atrás`;
        if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} dias atrás`;
        
        return notificationDate.toLocaleDateString('pt-BR');
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Notificações {unreadCount > 0 && `(${unreadCount} não lidas)`}
                    </h2>
                    {unreadCount > 0 && (
                        <PrimaryButton
                            onClick={markAllAsRead}
                            disabled={processing}
                            className="text-sm"
                        >
                            Marcar todas como lidas
                        </PrimaryButton>
                    )}
                </div>
            }
        >
            <Head title="Notificações" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            {notifications.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔔</div>
                                    <p className="text-gray-500">Nenhuma notificação no momento</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 rounded-lg border ${
                                                notification.read
                                                    ? 'bg-gray-50 border-gray-200'
                                                    : 'bg-pink-50 border-pink-200'
                                            } transition-colors duration-200`}
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    <div className="text-2xl">
                                                        {getNotificationIcon(notification.type)}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${
                                                            notification.read ? 'text-gray-600' : 'text-gray-900 font-medium'
                                                        }`}>
                                                            {notification.message}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {getTimeAgo(notification.created_at)}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification.id)}
                                                        disabled={processing}
                                                        className="text-xs text-pink-600 hover:text-pink-800 font-medium"
                                                    >
                                                        Marcar como lida
                                                    </button>
                                                )}
                                            </div>
                                            
                                            {notification.data && (
                                                <div className="mt-2 pl-11">
                                                    {notification.data.sale_id && (
                                                        <a
                                                            href={`/sales/${notification.data.sale_id}`}
                                                            className="text-xs text-pink-600 hover:text-pink-800"
                                                        >
                                                            Ver detalhes →
                                                        </a>
                                                    )}
                                                    {notification.data.user_id && notification.type === 'new_user_registration' && (
                                                        <a
                                                            href={route('admin.users.index')}
                                                            className="text-xs text-pink-600 hover:text-pink-800"
                                                        >
                                                            Gerenciar usuários →
                                                        </a>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}