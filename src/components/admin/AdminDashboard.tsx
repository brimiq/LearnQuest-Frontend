import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Users,
    BookOpen,
    Activity,
    AlertCircle,
    Shield,
    Search,
    ChevronDown,
    Check,
    X,
    Eye,
    UserCog,
    Ban,
    Trash2,
    AlertTriangle,
    MessageSquare,
    Flag,
} from "lucide-react";
import clsx from "clsx";
import adminService from "../../services/adminService";

interface AdminStats {
    total_users: number;
    total_paths: number;
    total_resources: number;
    pending_approvals: number;
    active_users: number;
    reports_count: number;
    user_growth_percent?: number;
    total_learning_paths?: number;
    active_learners_today?: number;
}

interface PendingPath {
    id: number;
    title: string;
    description: string;
    creator: { username: string } & Record<string, any>;
    created_at: string;
    modules_count: number;
    difficulty?: string;
    category?: string;
}

interface AdminUser {
    id: number;
    username: string;
    email: string;
    role: string;
    xp: number;
    created_at: string;
    is_active: boolean;
    status?: string;
}

interface Report {
    id: number;
    type: string;
    reason: string;
    reporter: { username: string } & Record<string, any>;
    target: string;
    created_at: string;
    status: string;
    content_type?: string;
    content_preview?: { author: string; content: string };
}

// ============================================================================
// Types
// ============================================================================

type TabId = "approvals" | "users" | "moderation";

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    confirmVariant?: "danger" | "primary";
    onConfirm: () => void;
    onCancel: () => void;
}

// ============================================================================
// Confirmation Dialog
// ============================================================================

function ConfirmDialog({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    confirmVariant = "primary",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onCancel}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card rounded-2xl border border-border shadow-xl max-w-md w-full p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
                <p className="text-muted-foreground mb-6">{message}</p>
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        className={clsx(
                            "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                            confirmVariant === "danger"
                                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                        )}
                    >
                        {confirmText}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
}

// ============================================================================
// Stats Card Component
// ============================================================================

interface StatsCardProps {
    label: string;
    value: string | number;
    icon: React.ElementType;
    color: string;
    bg: string;
    growth?: number;
    badge?: number;
}

function StatsCard({
    label,
    value,
    icon: Icon,
    color,
    bg,
    growth,
    badge,
}: StatsCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">{label}</p>
                    <div className="flex items-baseline gap-2 mt-1">
                        <h3 className="text-2xl font-bold text-foreground">{value}</h3>
                        {growth !== undefined && (
                            <span
                                className={clsx(
                                    "text-xs font-medium px-1.5 py-0.5 rounded",
                                    growth >= 0
                                        ? "bg-green-100 text-green-700"
                                        : "bg-red-100 text-red-700"
                                )}
                            >
                                {growth >= 0 ? "+" : ""}
                                {growth}%
                            </span>
                        )}
                    </div>
                </div>
                <div className={clsx("p-3 rounded-xl relative", bg)}>
                    <Icon size={20} className={color} />
                    {badge !== undefined && badge > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive text-white text-xs font-bold rounded-full flex items-center justify-center">
                            {badge > 9 ? "9+" : badge}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

// ============================================================================
// Path Preview Modal
// ============================================================================

interface PathPreviewModalProps {
    path: PendingPath | null;
    onClose: () => void;
    onApprove: (id: number) => void;
    onReject: (id: number, reason: string) => void;
}

function PathPreviewModal({
    path,
    onClose,
    onApprove,
    onReject,
}: PathPreviewModalProps) {
    const [rejectReason, setRejectReason] = useState("");
    const [showRejectForm, setShowRejectForm] = useState(false);

    if (!path) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-card rounded-2xl border border-border shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-6 border-b border-border">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-foreground">{path.title}</h2>
                            <p className="text-sm text-muted-foreground mt-1">
                                by {path.creator.username} • {path.modules_count} modules
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto max-h-[50vh]">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Description
                            </h4>
                            <p className="text-foreground">{path.description}</p>
                        </div>
                        <div className="flex gap-4">
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    Category
                                </h4>
                                <span className="inline-block px-3 py-1 bg-secondary rounded-full text-sm">
                                    {path.category}
                                </span>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                    Difficulty
                                </h4>
                                <span className="inline-block px-3 py-1 bg-secondary rounded-full text-sm capitalize">
                                    {path.difficulty}
                                </span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-1">
                                Submitted
                            </h4>
                            <p className="text-foreground">
                                {new Date(path.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>

                    {showRejectForm && (
                        <div className="mt-6 p-4 bg-destructive/10 rounded-xl border border-destructive/20">
                            <h4 className="text-sm font-medium text-foreground mb-2">
                                Rejection Reason
                            </h4>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="Explain why this path is being rejected..."
                                className="w-full p-3 bg-card border border-border rounded-lg text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-destructive/50"
                            />
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-border flex gap-3 justify-end">
                    {!showRejectForm ? (
                        <>
                            <button
                                onClick={() => setShowRejectForm(true)}
                                className="px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                                Reject
                            </button>
                            <button
                                onClick={() => onApprove(path.id)}
                                className="px-4 py-2 text-sm font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                            >
                                <Check size={16} />
                                Approve
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => setShowRejectForm(false)}
                                className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                            >
                                Back
                            </button>
                            <button
                                onClick={() => {
                                    onReject(path.id, rejectReason);
                                    setShowRejectForm(false);
                                    setRejectReason("");
                                }}
                                className="px-4 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
                            >
                                Confirm Rejection
                            </button>
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

// ============================================================================
// Pending Approvals Section
// ============================================================================

interface PendingApprovalsSectionProps {
    paths: PendingPath[];
    onApprove: (id: number) => void;
    onReject: (id: number, reason: string) => void;
    onRefresh: () => void;
}

function PendingApprovalsSection({
    paths,
    onApprove,
    onReject,
}: PendingApprovalsSectionProps) {
    const [previewPath, setPreviewPath] = useState<PendingPath | null>(null);

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <AlertCircle size={20} className="text-amber-500" />
                    Pending Approvals
                </h2>
            </div>

            {paths.length === 0 ? (
                <div className="p-12 text-center">
                    <Check size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">All caught up! No pending approvals.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/50">
                            <tr>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Title
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Creator
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Submitted
                                </th>
                                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {paths.map((path) => (
                                <tr key={path.id} className="hover:bg-secondary/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-foreground">{path.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {path.modules_count} modules
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-foreground">
                                        {path.creator.username}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-block px-2 py-1 bg-secondary rounded text-sm">
                                            {path.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-muted-foreground">
                                        {new Date(path.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setPreviewPath(path)}
                                                className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors"
                                                title="Review"
                                            >
                                                <Eye size={16} />
                                            </button>
                                            <button
                                                onClick={() => onApprove(path.id)}
                                                className="p-2 text-green-500 hover:bg-green-500/10 rounded-lg transition-colors"
                                                title="Approve"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                onClick={() => setPreviewPath(path)}
                                                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                title="Reject"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <AnimatePresence>
                {previewPath && (
                    <PathPreviewModal
                        path={previewPath}
                        onClose={() => setPreviewPath(null)}
                        onApprove={(id) => {
                            onApprove(id);
                            setPreviewPath(null);
                        }}
                        onReject={(id, reason) => {
                            onReject(id, reason);
                            setPreviewPath(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// User Management Section
// ============================================================================

interface UserManagementSectionProps {
    users: AdminUser[];
    onChangeRole: (userId: number, role: string) => void;
    onSuspend: (userId: number) => void;
    onDelete: (userId: number) => void;
    onSearch: (query: string) => void;
    onFilterRole: (role: string) => void;
    searchQuery: string;
    roleFilter: string;
}

function UserManagementSection({
    users,
    onChangeRole,
    onSuspend,
    onDelete,
    onSearch,
    onFilterRole,
    searchQuery,
    roleFilter,
}: UserManagementSectionProps) {
    const [confirmDialog, setConfirmDialog] = useState<{
        type: "delete" | "suspend";
        userId: number;
        username: string;
    } | null>(null);
    const [roleDropdown, setRoleDropdown] = useState<number | null>(null);

    const roles = ["admin", "contributor", "learner"];

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                        <Users size={20} className="text-blue-500" />
                        User Management
                    </h2>
                    <div className="flex gap-3">
                        <div className="relative">
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />
                            <input
                                type="text"
                                placeholder="Search users..."
                                value={searchQuery}
                                onChange={(e) => onSearch(e.target.value)}
                                className="pl-9 pr-4 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 w-48"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={roleFilter}
                                onChange={(e) => onFilterRole(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="contributor">Contributor</option>
                                <option value="learner">Learner</option>
                            </select>
                            <ChevronDown
                                size={16}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-secondary/50">
                        <tr>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                User
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Role
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                XP
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Status
                            </th>
                            <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Joined
                            </th>
                            <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                            {user.username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div className="font-medium text-foreground">
                                                {user.username}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                {user.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setRoleDropdown(roleDropdown === user.id ? null : user.id)
                                            }
                                            className={clsx(
                                                "inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium",
                                                user.role === "admin"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : user.role === "contributor"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-700"
                                            )}
                                        >
                                            {user.role}
                                            <ChevronDown size={14} />
                                        </button>
                                        {roleDropdown === user.id && (
                                            <div className="absolute top-full left-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden">
                                                {roles.map((role) => (
                                                    <button
                                                        key={role}
                                                        onClick={() => {
                                                            onChangeRole(user.id, role);
                                                            setRoleDropdown(null);
                                                        }}
                                                        className={clsx(
                                                            "w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors capitalize",
                                                            role === user.role && "bg-secondary"
                                                        )}
                                                    >
                                                        {role}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-foreground font-medium">
                                    {user.xp.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={clsx(
                                            "inline-block px-2 py-1 rounded text-xs font-medium capitalize",
                                            user.status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : user.status === "suspended"
                                                    ? "bg-amber-100 text-amber-700"
                                                    : "bg-red-100 text-red-700"
                                        )}
                                    >
                                        {user.status || "active"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-muted-foreground">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-1">
                                        <button
                                            onClick={() =>
                                                setConfirmDialog({
                                                    type: "suspend",
                                                    userId: user.id,
                                                    username: user.username,
                                                })
                                            }
                                            className="p-2 text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors"
                                            title={user.status === "suspended" ? "Reactivate" : "Suspend"}
                                        >
                                            <Ban size={16} />
                                        </button>
                                        <button
                                            onClick={() =>
                                                setConfirmDialog({
                                                    type: "delete",
                                                    userId: user.id,
                                                    username: user.username,
                                                })
                                            }
                                            className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <AnimatePresence>
                {confirmDialog && (
                    <ConfirmDialog
                        isOpen={true}
                        title={
                            confirmDialog.type === "delete"
                                ? "Delete User"
                                : "Suspend User"
                        }
                        message={
                            confirmDialog.type === "delete"
                                ? `Are you sure you want to delete user "${confirmDialog.username}"? This action cannot be undone.`
                                : `Are you sure you want to suspend user "${confirmDialog.username}"?`
                        }
                        confirmText={confirmDialog.type === "delete" ? "Delete" : "Suspend"}
                        confirmVariant="danger"
                        onConfirm={() => {
                            if (confirmDialog.type === "delete") {
                                onDelete(confirmDialog.userId);
                            } else {
                                onSuspend(confirmDialog.userId);
                            }
                            setConfirmDialog(null);
                        }}
                        onCancel={() => setConfirmDialog(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

// ============================================================================
// Content Moderation Section
// ============================================================================

interface ModerationSectionProps {
    reports: Report[];
    onDismiss: (reportId: number) => void;
    onAction: (reportId: number, action: string) => void;
}

function ModerationSection({
    reports,
    onDismiss,
    onAction,
}: ModerationSectionProps) {
    const [actionDropdown, setActionDropdown] = useState<number | null>(null);

    return (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Flag size={20} className="text-red-500" />
                    Content Moderation Queue
                </h2>
            </div>

            {reports.length === 0 ? (
                <div className="p-12 text-center">
                    <Shield size={48} className="mx-auto text-green-500 mb-4" />
                    <p className="text-muted-foreground">No reported content to review.</p>
                </div>
            ) : (
                <div className="divide-y divide-border">
                    {reports.map((report) => (
                        <div key={report.id} className="p-6 hover:bg-secondary/20 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium capitalize">
                                            {report.content_type}
                                        </span>
                                        <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                            {report.reason}
                                        </span>
                                    </div>
                                    {report.content_preview && (
                                        <div className="bg-secondary/50 p-3 rounded-lg mb-3">
                                            <p className="text-sm text-muted-foreground mb-1">
                                                by <span className="font-medium">{report.content_preview.author}</span>
                                            </p>
                                            <p className="text-sm text-foreground">
                                                "{report.content_preview.content}"
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span>Reported by: {report.reporter?.username}</span>
                                        <span>•</span>
                                        <span>{new Date(report.created_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onDismiss(report.id)}
                                        className="px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary rounded-lg transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                    <div className="relative">
                                        <button
                                            onClick={() =>
                                                setActionDropdown(
                                                    actionDropdown === report.id ? null : report.id
                                                )
                                            }
                                            className="px-3 py-2 text-sm font-medium bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-1"
                                        >
                                            Take Action
                                            <ChevronDown size={14} />
                                        </button>
                                        {actionDropdown === report.id && (
                                            <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-10 overflow-hidden min-w-[140px]">
                                                <button
                                                    onClick={() => {
                                                        onAction(report.id, "warn");
                                                        setActionDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                                                >
                                                    <AlertTriangle size={14} className="text-amber-500" />
                                                    Warn User
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onAction(report.id, "remove");
                                                        setActionDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                                                >
                                                    <Trash2 size={14} className="text-red-500" />
                                                    Remove Content
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onAction(report.id, "ban");
                                                        setActionDropdown(null);
                                                    }}
                                                    className="w-full px-4 py-2 text-left text-sm hover:bg-secondary transition-colors flex items-center gap-2"
                                                >
                                                    <Ban size={14} className="text-red-500" />
                                                    Ban User
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

// ============================================================================
// Main Admin Dashboard Component
// ============================================================================

export function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<TabId>("approvals");
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [pendingPaths, setPendingPaths] = useState<PendingPath[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Load data
    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        loadUsers();
    }, [searchQuery, roleFilter]);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statsData, pathsData, reportsData] = await Promise.all([
                adminService.getStats(),
                adminService.getPendingPaths(),
                adminService.getReports(),
            ]);
            setStats(statsData);
            setPendingPaths(pathsData);
            setReports(reportsData);
            await loadUsers();
        } catch (error) {
            console.error("Failed to load admin data:", error);
        } finally {
            setLoading(false);
        }
    };

    const loadUsers = async () => {
        try {
            const { users: userData } = await adminService.getUsers({
                search: searchQuery,
                role: roleFilter,
            });
            setUsers(userData);
        } catch (error) {
            console.error("Failed to load users:", error);
        }
    };

    const handleApprove = async (pathId: number) => {
        try {
            await adminService.approvePath(pathId);
            setPendingPaths((prev) => prev.filter((p) => p.id !== pathId));
            setStats((prev: AdminStats | null) =>
                prev ? { ...prev, pending_approvals: prev.pending_approvals - 1 } : null
            );
        } catch (error) {
            console.error("Failed to approve path:", error);
        }
    };

    const handleReject = async (pathId: number, reason: string) => {
        try {
            await adminService.rejectPath(pathId, reason);
            setPendingPaths((prev) => prev.filter((p) => p.id !== pathId));
            setStats((prev: AdminStats | null) =>
                prev ? { ...prev, pending_approvals: prev.pending_approvals - 1 } : null
            );
        } catch (error) {
            console.error("Failed to reject path:", error);
        }
    };

    const handleChangeRole = async (userId: number, role: string) => {
        try {
            await adminService.changeUserRole(userId, role);
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, role } : u))
            );
        } catch (error) {
            console.error("Failed to change role:", error);
        }
    };

    const handleSuspend = async (userId: number) => {
        try {
            await adminService.suspendUser(userId);
            setUsers((prev) =>
                prev.map((u) => (u.id === userId ? { ...u, status: "suspended" } : u))
            );
        } catch (error) {
            console.error("Failed to suspend user:", error);
        }
    };

    const handleDelete = async (userId: number) => {
        try {
            await adminService.deleteUser(userId);
            setUsers((prev) => prev.filter((u) => u.id !== userId));
        } catch (error) {
            console.error("Failed to delete user:", error);
        }
    };

    const handleDismissReport = async (reportId: number) => {
        try {
            await adminService.dismissReport(reportId);
            setReports((prev) => prev.filter((r) => r.id !== reportId));
        } catch (error) {
            console.error("Failed to dismiss report:", error);
        }
    };

    const handleActionReport = async (reportId: number, action: string) => {
        try {
            await adminService.actionReport(reportId, action);
            setReports((prev) => prev.filter((r) => r.id !== reportId));
        } catch (error) {
            console.error("Failed to action report:", error);
        }
    };

    const tabs = [
        { id: "approvals" as const, label: "Pending Approvals", icon: AlertCircle },
        { id: "users" as const, label: "User Management", icon: UserCog },
        { id: "moderation" as const, label: "Moderation Queue", icon: MessageSquare },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <Shield className="text-primary" />
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Manage users, content approvals, and platform moderation
                </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    label="Total Users"
                    value={stats?.total_users || 0}
                    icon={Users}
                    color="text-blue-500"
                    bg="bg-blue-100"
                    growth={stats?.user_growth_percent}
                />
                <StatsCard
                    label="Learning Paths"
                    value={stats?.total_learning_paths || 0}
                    icon={BookOpen}
                    color="text-purple-500"
                    bg="bg-purple-100"
                />
                <StatsCard
                    label="Active Today"
                    value={stats?.active_learners_today || 0}
                    icon={Activity}
                    color="text-green-500"
                    bg="bg-green-100"
                />
                <StatsCard
                    label="Pending Approvals"
                    value={stats?.pending_approvals || 0}
                    icon={AlertCircle}
                    color="text-amber-500"
                    bg="bg-amber-100"
                    badge={stats?.pending_approvals}
                />
            </div>

            {/* Tab Navigation */}
            <div className="flex items-center gap-1 p-1 bg-secondary/50 rounded-xl w-fit">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                            activeTab === tab.id
                                ? "bg-card text-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {activeTab === "approvals" && (
                        <PendingApprovalsSection
                            paths={pendingPaths}
                            onApprove={handleApprove}
                            onReject={handleReject}
                            onRefresh={loadData}
                        />
                    )}
                    {activeTab === "users" && (
                        <UserManagementSection
                            users={users}
                            onChangeRole={handleChangeRole}
                            onSuspend={handleSuspend}
                            onDelete={handleDelete}
                            onSearch={setSearchQuery}
                            onFilterRole={setRoleFilter}
                            searchQuery={searchQuery}
                            roleFilter={roleFilter}
                        />
                    )}
                    {activeTab === "moderation" && (
                        <ModerationSection
                            reports={reports}
                            onDismiss={handleDismissReport}
                            onAction={handleActionReport}
                        />
                    )}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
