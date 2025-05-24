import React from "react";
import { useGetCommentsQuery, useAddCommentMutation } from "../state/tweets/tweetsApi";
import { toast } from "sonner";

interface CommentProps {
    isOpen: boolean;
    onClose: () => void;
    refId: number;
    userId: number;
    refetchTweets: () => void; // Function to refresh tweets
}

const Comment: React.FC<CommentProps> = ({ isOpen, onClose, refId, userId, refetchTweets }) => {
    const [comment, setComment] = React.useState("");
    const { data: comments = [], isLoading, refetch } = useGetCommentsQuery(userId, {
        skip: !isOpen, // Skip fetching if the modal is not open
    });
    const [addComment] = useAddCommentMutation();

    const handleAddComment = async () => {
        if (comment.trim() !== "") {
            try {
                await addComment({ tweetId: refId, content: comment }).unwrap();
            } catch (error) {
                console.error("Error adding comment:", error);
            }finally {
                toast.success("Comment added successfully!");
                refetchTweets();
                setComment("");
                refetch(); // Refresh comments after adding a new one
            }
        } else {
            toast.warning("Please enter a comment");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-[#1A1D21] rounded-lg shadow-lg p-8 max-w-lg w-full relative">
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                    onClick={onClose}
                >
                    Close
                </button>

                <div className="pt-2 max-h-96 overflow-y-auto">
                    {isLoading ? (
                        <p className="text-slate-400">Loading comments...</p>
                    ) : (
                        <div className="space-y-4">
                            {comments.map((comment, index) => (
                                <div
                                    key={index}
                                    className="bg-[#2A2D31] p-4 rounded-md shadow-md text-white"
                                >
                                    <p className="text-sm text-gray-400">{comment.createdAt}</p>
                                    <p className="mt-2">{comment.content}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="tweetcontainer mt-4 bg-[#D9D9D9] bg-opacity-10 rounded-md p-2 px-4">
                    <div className="top flex gap-4 pb-6">
                        <input
                            type="text"
                            placeholder="Add a comment..."
                            className="bg-transparent outline-none text-white w-full"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                    <div className="bottom flex justify-end">
                        <button
                            className="bg-blue-700 px-6 py-1 text-white rounded-3xl"
                            onClick={handleAddComment}
                        >
                            Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comment;
