
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import type { Comment as CommentType } from '@/lib/comments';
import { formatDistanceToNow } from 'date-fns';

interface CommentProps {
    comment: CommentType
}

export function Comment({ comment }: CommentProps) {
    const timeAgo = formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true });

    return (
        <div className="flex gap-4">
            <Avatar>
                <AvatarImage src={comment.authorAvatar || ''} alt={comment.authorName} />
                <AvatarFallback>{comment.authorName.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    <p className="font-semibold">{comment.authorName}</p>
                    <p className="text-xs text-muted-foreground">{timeAgo}</p>
                </div>
                <p className="text-muted-foreground mt-1">{comment.content}</p>
            </div>
        </div>
    )
}
