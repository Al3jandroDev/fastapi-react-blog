import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { deletePost, updatePost } from "../api/posts";
import { likePost, unlikePost } from "../api/likes";

import Comments from "../pages/Comments";
import FollowButton from "../pages/FollowButton";

import { usePostStore } from "../store/usePostStore";

export default function Posts({ posts, user }) {
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const updatePostStore = usePostStore((s) => s.updatePost);
  const removePost = usePostStore((s) => s.removePost);
  const toggleLike = usePostStore((s) => s.toggleLike);

  // DELETE
  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;

    await deletePost(id);
    removePost(id);
  };

  // UPDATE
  const handleUpdate = async (id) => {
    const updated = await updatePost(id, {
      title: editTitle,
      content: editContent,
    });

    updatePostStore(updated);
    setEditingId(null);
  };

  // LIKE
  const handleLike = async (post) => {
    const wasLiked = post.liked_by_me;

    toggleLike(post.id);

    try {
      if (wasLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (err) {
      console.error(err);
      toggleLike(post.id);
    }
  };

  if (!user) return <p>Loading user...</p>;
  if (!posts.length) return <p>No posts yet</p>;

  return (
    <div className="posts">
      <h2>Posts</h2>

      {posts.map((post) => (
        <div key={post.id} className="post">
          {editingId === post.id ? (
            <>
              <input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />

              <button onClick={() => handleUpdate(post.id)}>
                Save
              </button>

              <button onClick={() => setEditingId(null)}>
                Cancel
              </button>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>

              {post.image_url ? (
                <img src={post.image_url} alt="" />
              ) : (
                <div>Sin imagen</div>
              )}

              <p>{post.content}</p>

              <small
                onClick={() =>
                  navigate(`/users/${post.author_id}`)
                }
              >
                @{post.author_username}
              </small>

              <button onClick={() => handleLike(post)}>
                {post.liked_by_me ? "❤️" : "🤍"} {post.likes_count}
              </button>

              <Comments postId={post.id} />

              {Number(user.id) === Number(post.author_id) && (
                <>
                  <button onClick={() => setEditingId(post.id)}>
                    Edit
                  </button>

                  <button onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                </>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}