import { useEffect, useState } from "react";

import {
  getComments,
  createComment,
} from "../api/comments";


export default function Comments({ postId }) {

  const [comments, setComments] = useState([]);

  const [content, setContent] = useState("");


  // =========================
  // LOAD COMMENTS
  // =========================
  useEffect(() => {

    const fetchComments = async () => {

      try {

        const data = await getComments(postId);

        setComments(data);

      } catch (err) {

        console.error(err);
      }
    };

    fetchComments();

  }, [postId]);


  // =========================
  // CREATE COMMENT
  // =========================
  const handleComment = async () => {

    if (!content.trim()) return;

    try {

      // crear comentario
      await createComment(postId, content);

      // pedir comentarios actualizados
      const updatedComments =
        await getComments(postId);

      // actualizar estado
      setComments(updatedComments);

      // limpiar input
      setContent("");

    } catch (err) {

      console.error(err);
    }
  };


  return (

    <div className="comments">

      <small>
        💬 {comments.length} comments
      </small>


      {/* FORM */}
      <div className="comment-form">

        <input
          type="text"
          placeholder="Add comment..."
          value={content}
          onChange={(e) =>
            setContent(e.target.value)
          }
        />

        <button onClick={handleComment}>
          Post
        </button>

      </div>


      {/* COMMENTS LIST */}
      <div className="comments-list">

        {comments.map((comment) => (

          <div
            key={comment.id}
            className="comment"
          >

            <small>
              👤 @{comment.username}
            </small>

            <p>
              {comment.content}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}