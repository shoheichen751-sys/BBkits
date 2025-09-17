import { useState, useEffect } from 'react';
import { useForm, usePage, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import Modal from '@/Components/Modal';
import toast from 'react-hot-toast';

export default function OrderComments({ sale, users = [] }) {
    const [comments, setComments] = useState([]);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [editingComment, setEditingComment] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const { auth } = usePage().props;
    
    const { data, setData, post, put, processing, errors, reset } = useForm({
        comment: '',
        department: 'general',
        mention_user_id: null,
        is_internal: true
    });

    const loadComments = async () => {
        try {
            setLoading(true);
            const response = await fetch(`/order-comments?sale=${sale.id}`);
            const result = await response.json();
            setComments(result.data || []);
        } catch (error) {
            console.error('Error loading comments:', error);
            toast.error('Erro ao carregar comentários');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadComments();
    }, [sale.id]);

    const submitComment = (e) => {
        e.preventDefault();
        
        const action = editingComment ? 
            () => put(`/order-comments/${editingComment.id}`) :
            () => post(`/order-comments/${sale.id}`);
        
        action({
            onSuccess: () => {
                toast.success(editingComment ? 'Comentário atualizado!' : 'Comentário adicionado!');
                reset();
                setShowCommentForm(false);
                setEditingComment(null);
                loadComments();
            },
            onError: (errors) => {
                Object.values(errors).forEach(error => toast.error(error));
            }
        });
    };

    const deleteComment = (commentId) => {
        if (confirm('Tem certeza que deseja remover este comentário?')) {
            router.delete(`/order-comments/${commentId}`, {
                onSuccess: () => {
                    toast.success('Comentário removido!');
                    loadComments();
                }
            });
        }
    };

    const startEdit = (comment) => {
        setEditingComment(comment);
        setData({
            comment: comment.comment,
            department: comment.department,
            mention_user_id: comment.mention_user_id,
            is_internal: comment.is_internal
        });
        setShowCommentForm(true);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getDepartmentIcon = (department) => {
        const icons = {
            finance: '💰',
            production: '🏭',
            admin: '🛡️',
            sales: '💼',
            general: '💬'
        };
        return icons[department] || '💬';
    };

    const getDepartmentLabel = (department) => {
        const labels = {
            finance: 'Financeiro',
            production: 'Produção',
            admin: 'Administração',
            sales: 'Vendas',
            general: 'Geral'
        };
        return labels[department] || 'Geral';
    };

    const getUserDepartment = () => {
        if (auth.user.role === 'finance_admin') return 'finance';
        if (auth.user.role === 'production_admin') return 'production';
        if (auth.user.role === 'admin') return 'admin';
        return 'sales';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    💬 Comentários Internos
                    {comments.length > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-full">
                            {comments.length}
                        </span>
                    )}
                </h3>
                
                <PrimaryButton
                    onClick={() => {
                        setEditingComment(null);
                        setData({
                            comment: '',
                            department: getUserDepartment(),
                            mention_user_id: null,
                            is_internal: true
                        });
                        setShowCommentForm(true);
                    }}
                >
                    ➕ Adicionar Comentário
                </PrimaryButton>
            </div>

            {/* Comments List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="text-gray-500 mt-2">Carregando comentários...</p>
                    </div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">💭</div>
                        <p>Nenhum comentário ainda.</p>
                        <p className="text-sm">Seja o primeiro a comentar!</p>
                    </div>
                ) : (
                    comments.map((comment) => (
                        <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <span className="font-medium text-gray-900">
                                        {comment.user?.name || 'Usuário'}
                                    </span>
                                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center gap-1">
                                        {getDepartmentIcon(comment.department)}
                                        {getDepartmentLabel(comment.department)}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span>{formatDate(comment.created_at)}</span>
                                    {comment.mention_user_id && comment.mentioned_user && (
                                        <>
                                            <span className="text-gray-400">•</span>
                                            <span className="text-blue-600">
                                                mencionou @{comment.mentioned_user.name}
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                {comment.user_id === auth.user.id && (
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => startEdit(comment)}
                                            className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => deleteComment(comment.id)}
                                            className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="text-gray-800 whitespace-pre-wrap">
                                {comment.comment}
                            </div>
                            
                            {comment.updated_at !== comment.created_at && (
                                <div className="text-xs text-gray-400 mt-1">
                                    Editado em {formatDate(comment.updated_at)}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Comment Form Modal */}
            <Modal show={showCommentForm} onClose={() => setShowCommentForm(false)}>
                <div className="p-6">
                    <h2 className="text-xl font-semibold mb-4">
                        {editingComment ? '✏️ Editar Comentário' : '➕ Novo Comentário'}
                    </h2>
                    
                    <form onSubmit={submitComment} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Departamento
                            </label>
                            <select
                                value={data.department}
                                onChange={(e) => setData('department', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                                required
                            >
                                <option value="general">💬 Geral</option>
                                <option value="sales">💼 Vendas</option>
                                <option value="finance">💰 Financeiro</option>
                                <option value="production">🏭 Produção</option>
                                <option value="admin">🛡️ Administração</option>
                            </select>
                        </div>

                        {users.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Mencionar usuário (opcional)
                                </label>
                                <select
                                    value={data.mention_user_id || ''}
                                    onChange={(e) => setData('mention_user_id', e.target.value || null)}
                                    className="w-full rounded-md border-gray-300"
                                >
                                    <option value="">Ninguém</option>
                                    {users.filter(user => user.id !== auth.user.id).map((user) => (
                                        <option key={user.id} value={user.id}>
                                            @{user.name} ({user.role === 'admin' ? 'Admin' : user.role === 'finance_admin' ? 'Financeiro' : user.role === 'production_admin' ? 'Produção' : 'Vendas'})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Comentário
                            </label>
                            <textarea
                                value={data.comment}
                                onChange={(e) => setData('comment', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                                rows="4"
                                placeholder="Digite seu comentário..."
                                required
                            />
                            {errors.comment && (
                                <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_internal"
                                checked={data.is_internal}
                                onChange={(e) => setData('is_internal', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <label htmlFor="is_internal" className="text-sm text-gray-700">
                                Comentário interno (não visível ao cliente)
                            </label>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <SecondaryButton
                                type="button"
                                onClick={() => setShowCommentForm(false)}
                            >
                                Cancelar
                            </SecondaryButton>
                            
                            <PrimaryButton type="submit" disabled={processing}>
                                {editingComment ? '💾 Salvar' : '📝 Comentar'}
                            </PrimaryButton>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    );
}