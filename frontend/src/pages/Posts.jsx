import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { deletePost, updatePost } from "../api/posts";
import { likePost, unlikePost } from "../api/likes";

export default function Posts({ posts, setPosts, user }) {
  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;

    await deletePost(id);
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const startEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditContent(post.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditContent("");
  };

  const handleUpdate = async (id) => {
    const updated = await updatePost(id, {
      title: editTitle,
      content: editContent,
    });

    setPosts((prev) =>
      prev.map((p) => (p.id === id ? updated : p))
    );

    cancelEdit();
  };

  const handleLike = async (post) => {
    if (post.liked_by_me) {
      await unlikePost(post.id);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
              ...p,
              liked_by_me: false,
              likes_count: p.likes_count - 1,
            }
            : p
        )
      );
    } else {
      await likePost(post.id);

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
              ...p,
              liked_by_me: true,
              likes_count: p.likes_count + 1,
            }
            : p
        )
      );
    }
  };

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

              <div className="post-actions">
                <button onClick={() => handleUpdate(post.id)}>
                  Save
                </button>
                <button onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3>{post.title}</h3>
              <p>{post.content}</p>

              {/* 👇 CLICKABLE USERNAME */}
              <small
                style={{ cursor: "pointer", color: "#3b82f6" }}
                onClick={() => navigate(`/users/${post.author_id}`)}
              >
                👤 @{post.author_username}
              </small>

              <div className="post-like">
                <button onClick={() => handleLike(post)}>
                  {post.liked_by_me ? "❤️" : "🤍"}{" "}
                  {post.likes_count}
                </button>
              </div>

              {user?.id === post.author_id && (
                <div className="post-actions">
                  <button onClick={() => startEdit(post)}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(post.id)}>
                    Delete
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}