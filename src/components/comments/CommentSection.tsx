import React, { useEffect, useState } from 'react';
import { Comment, commentService } from '@/services/commentService';
import { CommentCard } from './CommentCard';
import { CommentForm } from './CommentForm';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface CommentSectionProps {
    learningPathId?: number | string;
    resourceId?: number | string;
    isLoggedIn: boolean;
    currentUserId?: number;
    onLoginClick?: () => void;
}

export function CommentSection({
    learningPathId,
    resourceId,
    isLoggedIn,
    currentUserId,
    onLoginClick
}: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [totalComments, setTotalComments] = useState(0);

    const fetchComments = async (pageNum: number, append = false) => {
        try {
            if (pageNum === 1) setLoading(true);
            else setLoadingMore(true);

            const response = await commentService.getComments({
                learning_path_id: learningPathId,
                resource_id: resourceId,
                page: pageNum
            });

            setComments(prev => append ? [...prev, ...response.comments] : response.comments);
            setTotalComments(response.total);
            setHasMore(pageNum < response.pages);
        } catch (error) {
            console.error(error);
            toast.error('Failed to load comments');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (learningPathId || resourceId) {
            setPage(1);
            fetchComments(1);
        }
    }, [learningPathId, resourceId]);

    const handleLoadMore = () => {
        if (!loadingMore && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchComments(nextPage, true);
        }
    };

    const handlePostComment = async (content: string) => {
        try {
            const newComment = await commentService.createComment({
                content,
                learning_path_id: learningPathId,
                resource_id: resourceId
            });
            setComments([newComment, ...comments]);
            setTotalComments(prev => prev + 1);
            toast.success('Comment posted! (+5 XP)');
        } catch (error) {
            throw error; // CommentForm handles the error toast
        }
    };

    const handleCommentUpdated = (updated: Comment) => {
        setComments(comments.map(c => c.id === updated.id ? updated : c));
    };

    const handleCommentDeleted = (id: number) => {
        // With soft delete, we might just update the content or reload
        // But API returns masked content if we just refresh.
        // Or we can filter it out if we want to hide it completely (but replies might exist).
        // API "soft delete" implementation maintained the record.
        // Frontend requirements said "Delete confirmation dialog" which we did in Card.
        // Backend masks content. So we should probably re-fetch or just update local state to match "deleted" shape.
        // Let's reload the specific comment or just mark is_deleted locally.
        setComments(comments.map(c => {
            if (c.id === id) {
                return { ...c, is_deleted: true, content: '[This comment has been deleted]' };
            }
            return c;
        }));
    };

    if (!learningPathId && !resourceId) return null;

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">Comments ({totalComments})</h3>
            </div>

            <div className="bg-card p-6 rounded-lg border shadow-sm">
                {isLoggedIn ? (
                    <CommentForm
                        onSubmit={handlePostComment}
                        placeholder="Share your thoughts..."
                        submitLabel="Post Comment"
                    />
                ) : (
                    <div className="text-center py-6 bg-secondary/20 rounded-lg">
                        <p className="text-muted-foreground mb-4">Please log in to join the discussion.</p>
                        <Button onClick={onLoginClick}>
                            Log In
                        </Button>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : comments.length > 0 ? (
                    <>
                        {comments.map(comment => (
                            <CommentCard
                                key={comment.id}
                                comment={comment}
                                currentUserId={currentUserId}
                                onCommentUpdated={handleCommentUpdated}
                                onCommentDeleted={handleCommentDeleted}
                                onReplyAdded={() => { /* Reply added to child, maybe refresh? No, card handles display. */ }}
                            />
                        ))}

                        {hasMore ? (
                            <div className="flex justify-center pt-4">
                                <Button
                                    variant="outline"
                                    onClick={handleLoadMore}
                                    disabled={loadingMore}
                                >
                                    {loadingMore ? 'Loading...' : 'Load older comments'}
                                </Button>
                            </div>
                        ) : (
                            totalComments > 0 && (
                                <div className="text-center text-sm text-muted-foreground pt-4">
                                    No more comments.
                                </div>
                            )
                        )}
                    </>
                ) : (
                    <div className="text-center py-12 text-muted-foreground">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
}
