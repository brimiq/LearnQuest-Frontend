import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Users, BookOpen, Shield, Clock, CheckCircle2, XCircle, Search, ChevronDown, TrendingUp } from 'lucide-react';
import clsx from 'clsx';
import { toast } from 'sonner';
import adminService from '../services/adminService';

interface AdminStats {
  total_users: number;
  total_learners: number;
  total_contributors: number;
  total_paths: number;
  published_paths: number;
  pending_approvals: number;
  total_resources: number;
  active_challenges: number;
  new_users_this_week: number;
}

interface PendingPath {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  creator_name: string;
  creator_email: string;
  created_at: string;
}

interface ManagedUser {
  id: number;
  username: string;
  email: string;
  role: string;
  xp: number;
  points: number;
  created_at: string;
  avatar_url: string;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingPaths, setPendingPaths] = useState<PendingPath[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'overview' | 'approvals' | 'users'>('overview');
  const [roleFilter, setRoleFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [statsData, pathsData, usersData] = await Promise.all([
        adminService.getStats().catch(() => null),
        adminService.getPendingPaths().catch(() => []),
        adminService.getUsers().catch(() => ({ users: [] }))
      ]);
      if (statsData) setStats(statsData);
      setPendingPaths(pathsData || []);
      setUsers(usersData?.users || usersData || []);
    } catch (e) {
      console.error('Admin load error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (pathId: number) => {
    try {
      const res = await adminService.approvePath(pathId);
      toast.success(res.message || 'Path approved!');
      setPendingPaths(prev => prev.filter(p => p.id !== pathId));
      if (stats) setStats({ ...stats, pending_approvals: stats.pending_approvals - 1, published_paths: stats.published_paths + 1 });
    } catch { toast.error('Failed to approve'); }
  };

  const handleReject = async (pathId: number) => {
    try {
      const res = await adminService.rejectPath(pathId, 'Does not meet quality standards');
      toast.success(res.message || 'Path rejected');
      setPendingPaths(prev => prev.filter(p => p.id !== pathId));
      if (stats) setStats({ ...stats, pending_approvals: stats.pending_approvals - 1 });
    } catch { toast.error('Failed to reject'); }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await adminService.changeUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${newRole}`);
    } catch { toast.error('Failed to update role'); }
  };

  const loadUsers = async () => {
    try {
      const data = await adminService.getUsers({ role: roleFilter || undefined, search: searchQuery || undefined });
      setUsers(data?.users || data || []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    if (activeSection === 'users') loadUsers();
  }, [roleFilter, searchQuery, activeSection]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Users', value: stats?.total_users || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Learning Paths', value: stats?.total_paths || 0, icon: BookOpen, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Pending Approvals', value: stats?.pending_approvals || 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { label: 'New This Week', value: stats?.new_users_this_week || 0, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-base-content flex items-center gap-3">
            <Shield className="text-primary" size={28} /> Admin Dashboard
          </h1>
          <p className="text-base-content/60 mt-1">Manage your platform</p>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2 bg-base-200 p-1 rounded-xl border border-base-300 w-fit">
        {(['overview', 'approvals', 'users'] as const).map(section => (
          <button
            key={section}
            onClick={() => setActiveSection(section)}
            className={clsx(
              "px-5 py-2 rounded-lg text-sm font-medium capitalize transition-colors",
              activeSection === section ? "bg-primary text-primary-content" : "text-base-content/60 hover:bg-base-300"
            )}
          >
            {section}
            {section === 'approvals' && (stats?.pending_approvals || 0) > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-error text-white text-xs rounded-full">{stats?.pending_approvals}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-base-200 p-6 rounded-2xl border border-base-300 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-base-content/60">{stat.label}</p>
                    <h3 className="text-3xl font-bold mt-1 text-base-content">{stat.value.toLocaleString()}</h3>
                  </div>
                  <div className={clsx("p-3 rounded-xl", stat.bg, stat.color)}>
                    <stat.icon size={22} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
              <h3 className="font-bold text-base-content mb-4">Role Distribution</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/60">Learners</span>
                  <span className="font-bold text-base-content">{stats?.total_learners || 0}</span>
                </div>
                <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${stats ? (stats.total_learners / stats.total_users) * 100 : 0}%` }}></div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-base-content/60">Contributors</span>
                  <span className="font-bold text-base-content">{stats?.total_contributors || 0}</span>
                </div>
                <div className="h-2 bg-base-300 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: `${stats ? (stats.total_contributors / stats.total_users) * 100 : 0}%` }}></div>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
              <h3 className="font-bold text-base-content mb-4">Content Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-base-content/60">Published Paths</span>
                  <span className="font-bold text-base-content">{stats?.published_paths || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-base-content/60">Total Resources</span>
                  <span className="font-bold text-base-content">{stats?.total_resources || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-base-content/60">Active Challenges</span>
                  <span className="font-bold text-base-content">{stats?.active_challenges || 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-base-200 p-6 rounded-2xl border border-base-300">
              <h3 className="font-bold text-base-content mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => setActiveSection('approvals')} className="w-full py-2.5 bg-primary text-primary-content rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                  Review Pending ({stats?.pending_approvals || 0})
                </button>
                <button onClick={() => setActiveSection('users')} className="w-full py-2.5 bg-base-300 text-base-content rounded-lg text-sm font-medium hover:bg-base-300/80 transition-colors">
                  Manage Users
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Approvals Section */}
      {activeSection === 'approvals' && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-base-content">Pending Approvals</h2>
          {pendingPaths.length === 0 ? (
            <div className="bg-base-200 rounded-2xl border border-base-300 p-12 text-center">
              <CheckCircle2 size={48} className="mx-auto text-success mb-4" />
              <h3 className="text-lg font-bold text-base-content mb-1">All caught up!</h3>
              <p className="text-base-content/60">No learning paths pending approval.</p>
            </div>
          ) : (
            pendingPaths.map(path => (
              <motion.div
                key={path.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-base-200 rounded-2xl border border-base-300 p-6 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-base-content">{path.title}</h3>
                      <span className="px-2 py-0.5 bg-base-300 rounded text-xs font-medium text-base-content/60">{path.category}</span>
                      <span className="px-2 py-0.5 bg-base-300 rounded text-xs font-medium text-base-content/60 capitalize">{path.difficulty}</span>
                    </div>
                    <p className="text-sm text-base-content/60 line-clamp-2 mb-2">{path.description}</p>
                    <div className="text-xs text-base-content/60">
                      By <span className="font-medium text-base-content">{path.creator_name}</span> • Submitted {new Date(path.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => handleReject(path.id)}
                      className="px-5 py-2.5 border border-error text-error rounded-xl font-medium hover:bg-error/10 transition-colors flex items-center gap-2"
                    >
                      <XCircle size={16} /> Reject
                    </button>
                    <button
                      onClick={() => handleApprove(path.id)}
                      className="px-5 py-2.5 bg-success text-success-content rounded-xl font-bold hover:bg-success/90 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} /> Approve
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Users Section */}
      {activeSection === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/60" size={16} />
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-base-200 border border-base-300 rounded-xl outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
            </div>
            <div className="relative">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-base-200 border border-base-300 rounded-xl outline-none focus:border-primary text-sm font-medium cursor-pointer"
              >
                <option value="">All Roles</option>
                <option value="learner">Learners</option>
                <option value="contributor">Contributors</option>
                <option value="admin">Admins</option>
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/60 pointer-events-none" />
            </div>
          </div>

          <div className="bg-base-200 rounded-2xl border border-base-300 overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-4 bg-base-300/30 text-xs font-bold text-base-content/60 uppercase tracking-wider">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">XP</div>
              <div className="col-span-2">Joined</div>
              <div className="col-span-2">Actions</div>
            </div>

            <div className="divide-y divide-base-300">
              {users.map(user => (
                <div key={user.id} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-base-300/10 transition-colors">
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm overflow-hidden">
                      {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.username} className="w-full h-full object-cover" />
                      ) : (
                        user.username?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-base-content">{user.username}</div>
                      <div className="text-xs text-base-content/60">{user.email}</div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className={clsx(
                        "text-xs font-bold px-2 py-1 rounded-lg border-none outline-none cursor-pointer",
                        user.role === 'admin' ? "bg-purple-500/10 text-purple-600" :
                        user.role === 'contributor' ? "bg-green-500/10 text-green-600" :
                        "bg-blue-500/10 text-blue-600"
                      )}
                    >
                      <option value="learner">Learner</option>
                      <option value="contributor">Contributor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="col-span-2 font-mono text-sm font-bold text-base-content">
                    {(user.xp || 0).toLocaleString()}
                  </div>
                  <div className="col-span-2 text-sm text-base-content/60">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={() => {
                        if (confirm(`Delete user ${user.username}?`)) {
                          adminService.deleteUser(user.id).then(() => {
                            setUsers(prev => prev.filter(u => u.id !== user.id));
                            toast.success(`User ${user.username} deleted`);
                          }).catch(() => toast.error('Failed to delete user'));
                        }
                      }}
                      className="text-xs text-error hover:bg-error/10 px-3 py-1.5 rounded-lg transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {users.length === 0 && (
                <div className="p-8 text-center text-base-content/60">No users found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
