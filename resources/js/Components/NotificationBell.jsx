import { useState, useEffect } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellIconSolid } from '@heroicons/react/24/solid';
import axios from 'axios';

export default function NotificationBell() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get('/notifications/unread-count', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            setUnreadCount(response.data.count);
        } catch (error) {
            // Silently handle errors to avoid console spam
            setUnreadCount(0);
        }
    };

    const fetchNotifications = async () => {
        try {
            const response = await axios.get('/notifications', {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            setNotifications(response.data.notifications || []);
        } catch (error) {
            // Silently handle errors
            setNotifications([]);
        }
    };

    const markAsRead = async (notificationId) => {
        try {
            await axios.post(`/notifications/${notificationId}/read`, {}, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            fetchUnreadCount();
            fetchNotifications();
        } catch (error) {
            // Silently handle errors
        }
    };

    const markAllAsRead = async () => {
        try {
            await axios.post('/notifications/mark-all-read', {}, {
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            setUnreadCount(0);
            fetchNotifications();
        } catch (error) {
            // Silently handle errors
        }
    };

    const handleBellClick = () => {
        setShowDropdown(!showDropdown);
        if (!showDropdown) {
            fetchNotifications();
        }
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'sale_approved':
                return '✅';
            case 'sale_rejected':
                return '❌';
            case 'new_sale':
                return '📋';
            case 'goal_reached':
                return '🎯';
            default:
                return '📢';
        }
    };

    const getNotificationColor = (type) => {
        switch (type) {
            case 'sale_approved':
                return 'bg-green-100 text-green-800';
            case 'sale_rejected':
                return 'bg-red-100 text-red-800';
            case 'new_sale':
                return 'bg-blue-100 text-blue-800';
            case 'goal_reached':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="relative">
            <button
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
                {unreadCount > 0 ? (
                    <BellIconSolid className="h-6 w-6 text-pink-600" />
                ) : (
                    <BellIcon className="h-6 w-6 text-gray-600" />
                )}
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transform translate-x-1/2 -translate-y-1/2">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {showDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                    <div className="bg-gradient-to-r from-pink-50 to-purple-50 px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-800">Notificações</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={markAllAsRead}
                                    className="text-sm text-pink-600 hover:text-pink-800 font-medium"
                                >
                                    Marcar todas como lidas
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200 ${
                                        !notification.read ? 'bg-pink-50' : ''
                                    }`}
                                    onClick={() => !notification.read && markAsRead(notification.id)}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className={`p-2 rounded-full ${getNotificationColor(notification.type)}`}>
                                            <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm text-gray-800">{notification.message}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(notification.created_at).toLocaleString('pt-BR')}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="w-2 h-2 bg-pink-500 rounded-full mt-2"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <BellIcon className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-500">Nenhuma notificação no momento</p>
                            </div>
                        )}
                    </div>

                    {notifications.length > 0 && (
                        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                            <a
                                href="/notifications"
                                className="text-sm text-pink-600 hover:text-pink-800 font-medium block text-center"
                            >
                                Ver todas as notificações
                            </a>
                        </div>
                    )}
                </div>
            )}

            {showDropdown && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                ></div>
            )}
        </div>
    );
}