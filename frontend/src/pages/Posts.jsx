import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { deletePost, updatePost } from "../api/posts";
import { likePost, unlikePost } from "../api/likes";

import Comments from "../pages/Comments";
import FollowButton from "../pages/FollowButton";

export default function Posts({
  posts,
  setPosts,
  user
}) {

  // ✅ DEBUG
  console.log("LOGGED USER ID:", user?.id);
  console.log("POSTS:", posts);
  console.log("POST IMAGE URL:", posts[0]?.image_url);
  console.log("TODOS LOS POSTS:", posts);
  console.log("POST RAW:", posts[0]);
  console.log("IMAGE TYPE:", typeof posts[0]?.image_url);


  const navigate = useNavigate();

  const [editingId, setEditingId] = useState(null);

  const [editTitle, setEditTitle] = useState("");

  const [editContent, setEditContent] = useState("");


  // =========================
  // DELETE POST
  // =========================
  const handleDelete = async (id) => {

    if (!confirm("Delete this post?")) return;

    await deletePost(id);

    setPosts((prev) =>
      prev.filter((p) => p.id !== id)
    );
  };


  // =========================
  // START EDIT
  // =========================
  const startEdit = (post) => {

    setEditingId(post.id);

    setEditTitle(post.title);

    setEditContent(post.content);
  };


  // =========================
  // CANCEL EDIT
  // =========================
  const cancelEdit = () => {

    setEditingId(null);

    setEditTitle("");

    setEditContent("");
  };


  // =========================
  // UPDATE POST
  // =========================
  const handleUpdate = async (id) => {

    const updated = await updatePost(id, {
      title: editTitle,
      content: editContent,
    });

    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? updated : p
      )
    );

    cancelEdit();
  };


  // =========================
  // LIKE / UNLIKE
  // =========================
  const handleLike = async (post) => {

    // ⚡ optimistic UI
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
            ...p,
            liked_by_me: !p.liked_by_me,
            likes_count: p.liked_by_me
              ? p.likes_count - 1
              : p.likes_count + 1,
          }
          : p
      )
    );

    try {

      if (post.liked_by_me) {

        await unlikePost(post.id);

      } else {

        await likePost(post.id);
      }

    } catch (err) {

      console.error(err);

      // rollback backend error
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
              ...p,
              liked_by_me: post.liked_by_me,
              likes_count: post.likes_count,
            }
            : p
        )
      );
    }
  };


  // =========================
  // EMPTY STATE
  // =========================

  if (!user) {
    return <p>Loading user...</p>;
  }

  if (!posts.length) {

    return <p>No posts yet</p>;
  }


  // =========================
  // RENDER
  // =========================
  return (

    <div className="posts">

      <h2>Posts</h2>


      {posts.map((post) => {
        return (

          <div
            key={post.id}
            className="post"
          >

            {editingId === post.id ? (

              <>
                <input
                  value={editTitle}
                  onChange={(e) =>
                    setEditTitle(e.target.value)
                  }
                />

                <textarea
                  value={editContent}
                  onChange={(e) =>
                    setEditContent(e.target.value)
                  }
                />

                <div className="post-actions">

                  <button
                    onClick={() =>
                      handleUpdate(post.id)
                    }
                  >
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

                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt="post"
                    style={{
                      width: "100%",
                      maxHeight: "400px",
                      borderRadius: "10px",
                      marginTop: "10px",
                      objectFit: "cover"
                    }}
                  />
                )}

                <p>{post.content}</p>


                {/* USER + FOLLOW */}
                <div className="post-user">

                  <small
                    style={{
                      cursor: "pointer",
                      color: "#3b82f6"
                    }}
                    onClick={() =>
                      navigate(
                        `/users/${post.author_id}`
                      )
                    }
                  >
                    👤 @{post.author_username}
                  </small>


                  {/* FOLLOW BUTTON */}
                  {user?.id && post.author_id && Number(user.id) !== Number(post.author_id) && (
                    <FollowButton
                      userId={post.author_id}
                    />
                  )}

                </div>


                {/* LIKE + COMMENTS */}
                <div className="post-like">

                  <button
                    className={`like-btn ${post.liked_by_me
                      ? "liked"
                      : ""
                      }`}
                    onClick={() =>
                      handleLike(post)
                    }
                  >
                    {post.liked_by_me
                      ? "❤️"
                      : "🤍"}

                    {post.likes_count}
                  </button>

                  <Comments postId={post.id} />

                </div>


                {/* OWNER ACTIONS */}
                {user?.id && post.author_id && Number(user.id) === Number(post.author_id) && (

                  <div className="post-actions">

                    <button
                      onClick={() =>
                        startEdit(post)
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(post.id)
                      }
                    >
                      Delete
                    </button>

                  </div>
                )}

              </>
            )}

          </div>
        );
      })}
    </div>
  );
}