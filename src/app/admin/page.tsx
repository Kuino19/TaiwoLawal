import { BookOpen, Trophy, Users, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
    const stats = [
        { name: 'Total Books', stat: '12', icon: BookOpen, color: 'text-blue-500' },
        { name: 'Active Quizzes', stat: '5', icon: Trophy, color: 'text-yellow-500' },
        { name: 'Total Orders', stat: '25', icon: DollarSign, color: 'text-green-500' },
        { name: 'Registered Students', stat: '100+', icon: Users, color: 'text-purple-500' },
    ];

    return (
        <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-5">Start Managing</h3>
            <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((item) => (
                    <div
                        key={item.name}
                        className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                    >
                        <dt>
                            <div className={`absolute rounded-md p-3 ${item.color} bg-opacity-10 bg-current`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                            </div>
                            <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                        </dt>
                        <dd className="ml-16 pb-1 flex items-baseline sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
                    <p className="text-gray-500 text-sm">No recent activity yet.</p>
                </div>
            </div>
        </div>
    );
}
