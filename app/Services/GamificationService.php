<?php

namespace App\Services;

use App\Models\User;
use App\Models\Sale;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use App\Services\CommissionService;

class GamificationService
{
    private array $motivationalQuotes = [
        "Você não vende bolsas. Você entrega histórias, segurança e amor. 💼👶",
        "Cada venda é uma oportunidade de transformar a vida de uma família. ✨",
        "Sua determinação hoje constrói o futuro dos seus sonhos! 🌟",
        "Vendedoras BBKits não desistem - elas inspiram! 💪",
        "Uma mãe feliz com sua BBKit é a melhor propaganda que existe! 😊",
        "Você está ajudando a criar memórias preciosas para toda a vida! 💕",
        "Cada 'não' te aproxima de um grande 'sim'! Continue! 🔥",
        "Seu trabalho toca vidas e transforma histórias! 👑",
        "BBKits: Mais que bolsas, são companheiras de jornada! 🌈",
        "Você é uma embaixadora da qualidade e do amor materno! 💖",
        "Grandes vendas começam com grande paixão pelo que você faz! ⭐",
        "Cada cliente satisfeita é uma nova amiga da BBKits! 🤝",
        "Sua energia positiva é contagiante - use isso a seu favor! ⚡",
        "BBKits confia em você porque você faz a diferença! 🏆",
        "Transforme cada conversa em uma oportunidade de ouro! 💰"
    ];

    private array $dailyMotivationalQuotes = [
        'Cada venda é uma história de amor que você ajuda a criar. Continue brilhando!', // Domingo
        'Segunda-feira é o dia de novos começos! Que sua determinação seja maior que qualquer desafio!', // Segunda
        'Terça-feira de conquistas! Cada "não" te aproxima do "sim" que vai transformar o dia!', // Terça
        'Quarta-feira de foco total! Suas metas estão mais perto do que você imagina!', // Quarta
        'Quinta-feira de gratidão! Celebre cada pequena vitória, elas constroem grandes sucessos!', // Quinta
        'Sexta-feira de finalização! Termine a semana com chave de ouro e orgulho do seu trabalho!', // Sexta
        'Sábado de reflexão e preparação! Você é mais forte do que pensa e mais capaz do que imagina!' // Sábado
    ];

    private array $achievements = [
        'primeira_venda' => [
            'name' => 'Primeiro Passo',
            'description' => 'Realizou sua primeira venda!',
            'icon' => '🎯',
            'color' => 'green'
        ],
        'vendedora_mes' => [
            'name' => 'Vendedora do Mês',
            'description' => 'Foi a vendedora que mais vendeu este mês!',
            'icon' => '👑',
            'color' => 'yellow'
        ],
        'meta_40k' => [
            'name' => 'Destravou Comissão',
            'description' => 'Atingiu R$ 40.000 em vendas mensais!',
            'icon' => '🔓',
            'color' => 'blue'
        ],
        'meta_50k' => [
            'name' => 'Subiu de Nível',
            'description' => 'Atingiu R$ 50.000 em vendas mensais!',
            'icon' => '📈',
            'color' => 'purple'
        ],
        'meta_60k' => [
            'name' => 'Vendedora Elite',
            'description' => 'Atingiu R$ 60.000 em vendas mensais!',
            'icon' => '💎',
            'color' => 'pink'
        ],
        'sequencia_5' => [
            'name' => 'Em Chamas',
            'description' => '5 vendas aprovadas consecutivas!',
            'icon' => '🔥',
            'color' => 'red'
        ],
        'cliente_fiel' => [
            'name' => 'Fidelizadora',
            'description' => 'Cliente comprou novamente com você!',
            'icon' => '💝',
            'color' => 'indigo'
        ]
    ];

    public function getRandomMotivationalQuote(): string
    {
        return $this->motivationalQuotes[array_rand($this->motivationalQuotes)];
    }

    public function getDailyMotivationalQuote(): string
    {
        return $this->dailyMotivationalQuotes[date('w')];
    }

    public function getDetailedUserLevel(User $user): array
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;
        
        // Calculate monthly sales
        $monthlySalesTotal = $user->sales()
            ->where('status', 'aprovado')
            ->whereYear('payment_date', $currentYear)
            ->whereMonth('payment_date', $currentMonth)
            ->get()
            ->sum(function ($sale) {
                if ($sale->hasPartialPayments()) {
                    return $sale->getCommissionBaseAmountForPayments();
                }
                return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
            });

        // Calculate commission using CommissionService
        $commissionService = new CommissionService();
        $monthlyProgress = $commissionService->getMonthlyProgress($user, $currentMonth, $currentYear);
        $monthlyCommission = $monthlyProgress['commission_total'];

        // Define goals
        $salesGoal = $user->monthly_goal ?: 40000;
        $actualGoal = max($salesGoal, 40000);

        // Calculate progress percentages
        $salesGoalProgress = ($monthlySalesTotal / $actualGoal) * 100;
        $commissionGoalProgress = ($monthlyCommission / 1000) * 100;
        $overallProgress = ($salesGoalProgress + $commissionGoalProgress) / 2;

        // Determine level based on overall progress
        if ($overallProgress >= 100) {
            $level = 5;
            $icon = '👑';
            $message = 'Rainha das Vendas - Você é inspiração para todas!';
            $progressToNext = 100;
        } elseif ($overallProgress >= 75) {
            $level = 4;
            $icon = '⭐';
            $message = 'Vendedora Expert - Quase na realeza!';
            $progressToNext = (($overallProgress - 75) / 25) * 100;
        } elseif ($overallProgress >= 50) {
            $level = 3;
            $icon = '💎';
            $message = 'Vendedora Avançada - Brilhando cada vez mais!';
            $progressToNext = (($overallProgress - 50) / 25) * 100;
        } elseif ($overallProgress >= 25) {
            $level = 2;
            $icon = '🌟';
            $message = 'Vendedora Crescente - No caminho do sucesso!';
            $progressToNext = (($overallProgress - 25) / 25) * 100;
        } else {
            $level = 1;
            $icon = '🌱';
            $message = 'Vendedora Iniciante - Pronta para brilhar!';
            $progressToNext = ($overallProgress / 25) * 100;
        }

        return [
            'level' => $level,
            'icon' => $icon,
            'message' => $message,
            'progress' => round($progressToNext, 2),
            'overallProgress' => round($overallProgress, 2),
            'salesProgress' => round($salesGoalProgress, 2),
            'commissionProgress' => round($commissionGoalProgress, 2),
            'currentCommission' => $monthlyCommission,
            'currentSales' => $monthlySalesTotal,
            'salesGoal' => $actualGoal,
            'commissionGoal' => 1000
        ];
    }

    public function getTopPerformersForDashboard(): array
    {
        $currentYear = Carbon::now()->year;
        $currentMonth = Carbon::now()->month;

        $topPerformers = User::where('role', 'vendedora')
            ->with(['sales' => function ($query) use ($currentYear, $currentMonth) {
                $query->where('status', 'aprovado')
                      ->whereYear('payment_date', $currentYear)
                      ->whereMonth('payment_date', $currentMonth);
            }])
            ->get()
            ->map(function ($user) {
                $salesCount = $user->sales->count();
                $totalRevenue = $user->sales->sum('received_amount');
                
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'sales_count' => $salesCount,
                    'total_revenue' => $totalRevenue
                ];
            })
            ->sortByDesc('total_revenue')
            ->take(10)
            ->values();

        return $topPerformers->map(function ($performer, $index) {
            $position = $index + 1;
            $user = User::find($performer['id']);
            $level = $this->getUserLevel($user);
            
            return [
                'position' => $position,
                'user' => [
                    'id' => $performer['id'],
                    'name' => $performer['name'],
                    'email' => $performer['email'],
                    'role' => $performer['role']
                ],
                'monthly_total' => $performer['total_revenue'],
                'monthly_sales_count' => $performer['sales_count'],
                'level' => $level,
                'badge' => $this->getPositionBadge($position),
                'motivational_message' => $this->getPositionMotivationalMessage($position, $performer['total_revenue']),
                'turnaround_alert' => null // Simplified for now
            ];
        })->toArray();
    }

    public function getUserPositionInRanking(User $user): ?int
    {
        $topPerformers = collect($this->getTopPerformersForDashboard());
        
        $userPerformer = $topPerformers->firstWhere('user.id', $user->id);
        
        return $userPerformer ? $userPerformer['position'] : null;
    }

    public function getUserLevel(User $user): array
    {
        $monthlyTotal = $this->getMonthlyTotal($user);
        
        if ($monthlyTotal >= 60000) {
            return [
                'level' => 'Elite',
                'icon' => '💎',
                'color' => 'from-pink-500 to-purple-600',
                'progress' => 100,
                'nextTarget' => null,
                'message' => 'Parabéns! Você atingiu o nível máximo!'
            ];
        } elseif ($monthlyTotal >= 50000) {
            return [
                'level' => 'Avançada',
                'icon' => '📈',
                'color' => 'from-purple-500 to-indigo-600',
                'progress' => (($monthlyTotal - 50000) / 10000) * 100,
                'nextTarget' => 60000,
                'message' => 'Quase Elite! Faltam ' . number_format(60000 - $monthlyTotal, 2, ',', '.') . ' para o próximo nível!'
            ];
        } elseif ($monthlyTotal >= 40000) {
            return [
                'level' => 'Intermediária',
                'icon' => '🔓',
                'color' => 'from-blue-500 to-purple-600',
                'progress' => (($monthlyTotal - 40000) / 10000) * 100,
                'nextTarget' => 50000,
                'message' => 'Você desbloqueou comissões! Próxima meta: R$ 50.000'
            ];
        } else {
            return [
                'level' => 'Iniciante',
                'icon' => '🎯',
                'color' => 'from-green-500 to-blue-600',
                'progress' => ($monthlyTotal / 40000) * 100,
                'nextTarget' => 40000,
                'message' => 'Continue vendendo para desbloquear comissões!'
            ];
        }
    }

    public function getMonthlyRanking(): array
    {
        $users = User::where('role', 'vendedora')
            ->withSum([
                'sales as monthly_total' => function ($query) {
                    $query->where('status', 'aprovado')
                        ->whereYear('payment_date', Carbon::now()->year)
                        ->whereMonth('payment_date', Carbon::now()->month);
                }
            ], 'received_amount')
            ->withCount([
                'sales as monthly_sales_count' => function ($query) {
                    $query->where('status', 'aprovado')
                        ->whereYear('payment_date', Carbon::now()->year)
                        ->whereMonth('payment_date', Carbon::now()->month);
                }
            ])
            ->get()
            ->map(function ($user) {
                // Calculate monthly total manually to avoid DB::raw issues
                $monthlyTotal = Sale::where('user_id', $user->id)
                    ->where('status', 'aprovado')
                    ->whereYear('payment_date', Carbon::now()->year)
                    ->whereMonth('payment_date', Carbon::now()->month)
                    ->with('payments')
                    ->get()
                    ->filter(function ($sale) {
                        // Only include fully paid sales for commission calculation
                        return $sale->hasPartialPayments() ? $sale->isFullyPaid() : true;
                    })
                    ->sum(function ($sale) {
                        if ($sale->hasPartialPayments()) {
                            return $sale->getCommissionBaseAmountForPayments();
                        }
                        return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
                    });
                
                $user->monthly_total = $monthlyTotal;
                return $user;
            })
            ->filter(function ($user) {
                return $user->monthly_total > 0;
            })
            ->sortByDesc('monthly_total')
            ->values()
            ->map(function ($user, $index) {
                $level = $this->getUserLevel($user);
                $position = $index + 1;
                
                return [
                    'position' => $position,
                    'user' => $user,
                    'monthly_total' => $user->monthly_total,
                    'monthly_sales_count' => $user->monthly_sales_count ?? 0,
                    'level' => $level,
                    'badge' => $this->getPositionBadge($position),
                    'motivational_message' => $this->getPositionMotivationalMessage($position, $user->monthly_total),
                    'turnaround_alert' => $this->getTurnaroundAlert($user, $position, $users->toArray())
                ];
            });

        return $users->take(3)->toArray();
    }

    public function getUserAchievements(User $user): array
    {
        $achievements = [];
        $monthlyTotal = $this->getMonthlyTotal($user);
        $salesCount = $this->getMonthlySalesCount($user);

        // Primeira venda
        if ($salesCount > 0) {
            $achievements[] = $this->achievements['primeira_venda'];
        }

        // Metas de valor
        if ($monthlyTotal >= 40000) {
            $achievements[] = $this->achievements['meta_40k'];
        }
        if ($monthlyTotal >= 50000) {
            $achievements[] = $this->achievements['meta_50k'];
        }
        if ($monthlyTotal >= 60000) {
            $achievements[] = $this->achievements['meta_60k'];
        }

        // Vendedora do mês
        $ranking = $this->getMonthlyRanking();
        if (!empty($ranking) && $ranking[0]['user']->id === $user->id) {
            $achievements[] = $this->achievements['vendedora_mes'];
        }

        return $achievements;
    }

    public function getGamificationData(User $user): array
    {
        return [
            'level' => $this->getUserLevel($user),
            'achievements' => $this->getUserAchievements($user),
            'motivationalQuote' => $this->getRandomMotivationalQuote(),
            'ranking' => $this->getMonthlyRanking(),
            'userPosition' => $this->getUserPosition($user),
        ];
    }

    private function getMonthlyTotal(User $user): float
    {
        return $user->sales()
            ->where('status', 'aprovado')
            ->whereYear('payment_date', Carbon::now()->year)
            ->whereMonth('payment_date', Carbon::now()->month)
            ->get()
            ->sum(function ($sale) {
                return ($sale->received_amount ?: 0) - ($sale->shipping_amount ?: 0);
            });
    }

    private function getMonthlySalesCount(User $user): int
    {
        return $user->sales()
            ->where('status', 'aprovado')
            ->whereYear('payment_date', Carbon::now()->year)
            ->whereMonth('payment_date', Carbon::now()->month)
            ->count();
    }

    private function getUserPosition(User $user): int
    {
        $ranking = $this->getMonthlyRanking();
        foreach ($ranking as $position => $data) {
            if ($data['user']->id === $user->id) {
                return $position + 1;
            }
        }
        return 0; // Not in ranking
    }

    private function getPositionBadge(int $position): array
    {
        switch ($position) {
            case 1:
                return [
                    'icon' => '🥇',
                    'color' => 'text-yellow-500',
                    'bg_color' => 'bg-yellow-50',
                    'border_color' => 'border-yellow-300',
                    'gradient' => 'from-yellow-400 to-yellow-600',
                    'name' => '1º Lugar',
                    'title' => 'Campeã do Mês! 👑'
                ];
            case 2:
                return [
                    'icon' => '🥈',
                    'color' => 'text-gray-500',
                    'bg_color' => 'bg-gray-50',
                    'border_color' => 'border-gray-300',
                    'gradient' => 'from-gray-400 to-gray-600',
                    'name' => '2º Lugar',
                    'title' => 'Vice-Campeã! 🌟'
                ];
            case 3:
                return [
                    'icon' => '🥉',
                    'color' => 'text-orange-600',
                    'bg_color' => 'bg-orange-50',
                    'border_color' => 'border-orange-300',
                    'gradient' => 'from-orange-400 to-orange-600',
                    'name' => '3º Lugar',
                    'title' => 'Terceiro Lugar! 🎉'
                ];
            default:
                return [
                    'icon' => '🏅',
                    'color' => 'text-blue-500',
                    'bg_color' => 'bg-blue-50',
                    'border_color' => 'border-blue-300',
                    'gradient' => 'from-blue-400 to-blue-600',
                    'name' => $position . 'º Lugar',
                    'title' => 'Top ' . $position . '! 💪'
                ];
        }
    }

    private function getPositionMotivationalMessage(int $position, float $monthlyTotal): array
    {
        switch ($position) {
            case 1:
                return [
                    'type' => 'champion',
                    'title' => '🏆 Vendedora Campeã BBKits!',
                    'message' => 'Parabéns! Você está liderando o ranking e inspirando toda a equipe com seu desempenho excepcional!',
                    'emoji' => '👑',
                    'color' => 'text-yellow-600',
                    'bg_color' => 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                ];
            case 2:
                return [
                    'type' => 'vice_champion',
                    'title' => '🌟 Vice-Campeã BBKits!',
                    'message' => 'Excelente trabalho! Você está entre as melhores e muito próxima da liderança!',
                    'emoji' => '🥈',
                    'color' => 'text-gray-600',
                    'bg_color' => 'bg-gradient-to-r from-gray-400 to-gray-600'
                ];
            case 3:
                return [
                    'type' => 'third_place',
                    'title' => '🎉 Terceiro Lugar BBKits!',
                    'message' => 'Ótimo desempenho! Você está no pódio e tem potencial para subir ainda mais!',
                    'emoji' => '🥉',
                    'color' => 'text-orange-600',
                    'bg_color' => 'bg-gradient-to-r from-orange-400 to-orange-600'
                ];
            default:
                if ($monthlyTotal < 10000) {
                    return [
                        'type' => 'encouragement',
                        'title' => '🚀 Você é capaz de virar o jogo!',
                        'message' => 'Cada grande vendedora começou do zero. Sua dedicação e persistência vão te levar ao topo! Continue firme!',
                        'emoji' => '💪',
                        'color' => 'text-purple-600',
                        'bg_color' => 'bg-gradient-to-r from-purple-400 to-pink-500'
                    ];
                } else {
                    return [
                        'type' => 'growth',
                        'title' => '📈 Vendedora em Ascensão!',
                        'message' => 'Você está construindo um ótimo resultado! Continue assim e logo estará no pódio!',
                        'emoji' => '🌟',
                        'color' => 'text-indigo-600',
                        'bg_color' => 'bg-gradient-to-r from-indigo-400 to-purple-600'
                    ];
                }
        }
    }

    private function getTurnaroundAlert(User $user, int $position, array $allUsers): ?array
    {
        if ($position === 1) {
            return null; // First place doesn't need turnaround alerts
        }

        $currentTotal = $user->monthly_total;
        $targetPosition = $position - 1;
        
        // Find the user in the target position
        $targetUser = collect($allUsers)->firstWhere('position', $targetPosition);
        
        if (!$targetUser) {
            return null;
        }

        $targetTotal = $targetUser['monthly_total'];
        $amountNeeded = $targetTotal - $currentTotal + 1; // +1 to actually overtake
        
        if ($amountNeeded <= 0) {
            return null;
        }

        $positionNames = [
            1 => '1º lugar',
            2 => '2º lugar',
            3 => '3º lugar'
        ];

        $targetName = $positionNames[$targetPosition] ?? ($targetPosition . 'º lugar');
        $encouragementMessages = [
            2 => 'Você está quase lá! A liderança está ao seu alcance!',
            3 => 'O pódio está esperando por você! Vamos conquistar!',
            4 => 'Mais uma posição e você estará no pódio!',
        ];

        return [
            'show' => true,
            'type' => 'turnaround',
            'target_position' => $targetPosition,
            'target_position_name' => $targetName,
            'current_position' => $position,
            'amount_needed' => $amountNeeded,
            'target_total' => $targetTotal,
            'current_total' => $currentTotal,
            'title' => "🎯 Oportunidade de Ultrapassagem!",
            'message' => "Você está a apenas R$ " . number_format($amountNeeded, 2, ',', '.') . " de ultrapassar o {$targetName}!",
            'encouragement' => $encouragementMessages[$targetPosition] ?? 'Continue assim! Você pode subir mais uma posição!',
            'icon' => '🏃‍♀️',
            'color' => 'text-green-600',
            'bg_color' => 'bg-green-50',
            'border_color' => 'border-green-300'
        ];
    }
}