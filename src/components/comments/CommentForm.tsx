import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

interface CommentFormProps {
    onSubmit: (content: string) => Promise<void>;
    initialContent?: string;
    onCancel?: () => void;
    submitLabel?: string;
    placeholder?: string;
}

export function CommentForm({
    onSubmit,
    initialContent = '',
    onCancel,
    submitLabel = 'Post Comment',
    placeholder = 'Write a comment...'
}: CommentFormProps) {
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const maxLength = 1000;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setIsSubmitting(true);
            await onSubmit(content);
            setContent('');
            if (!onCancel) { // Don't show toast if it's an edit form within a card, maybe? Or duplicate toasts.
                // Actually prompt says "Show toast on success/error".
                toast.success('Comment posted successfully');
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to post comment');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
                <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    className="min-h-[100px] pr-10 resize-y"
                    maxLength={maxLength}
                    disabled={isSubmitting}
                />
                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                    {content.length}/{maxLength}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                {onCancel && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    disabled={!content.trim() || isSubmitting}
                >
                    {isSubmitting ? 'Posting...' : submitLabel}
                </Button>
            </div>
        </form>
    );
}
