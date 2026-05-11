import { useEffect, useState } from "react";

import {
  getComments,
  createComment,
} from "../api/comments";


export default function Comments({ postId }) {

  const [comments, setComments] = useState([]);

  const [content, setContent] = useState("");


  useEffect(() => {
    loadComments();
  }, []);


  const loadComments = async () => {

    try {

      const data = await getComments(postId);

      setComments(data);

    } catch (err) {

      console.error(err);
    }
  };


  const handleComment = async () => {

    if (!content.trim()) return;

    try {

      const newComment = await createComment(
        postId,
        content
      );

      setComments((prev) => [
        newComment,
        ...prev,
      ]);

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