import { useEffect, useState } from "react";
import { getPosts, deletePost, updatePost } from "../api/posts";

export default function Posts({ posts, setPosts }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await getPosts();
      setPosts(data);
    } catch {
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this post?")) return;

    try {
      await deletePost(id);
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Error deleting post");
    }
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
    try {
      const updated = await updatePost(id, {
        title: editTitle,
        content: editContent,
      });

      setPosts((prev) =>
        prev.map((p) => (p.id === id ? updated : p))
      );

      cancelEdit();
    } catch {
      alert("Error updating post");
    }
  };

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

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

              <small>👤 @{post.author_username}</small>

              <div className="post-actions">
                <button onClick={() => startEdit(post)}>
                  Edit
                </button>
                <button onClick={() => handleDelete(post.id)}>
                  Delete
                </button>
              </div>
            </>
          )}

        </div>
      ))}
    </div>
  );
}