import { useState } from "react";
import { createPost } from "../api/posts";


/**
 * Component for creating a new post
 */
export default function CreatePost() {

  // Local state for form inputs
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  /**
   * Handle form submission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Call API to create post
      const newPost = await createPost(title, content);
      console.log("CREATED:", newPost);

      // User feedback
      alert("Post creado");

      // Reset form fields
      setTitle("");
      setContent("");

    } catch (err) {
      console.error(err);
      // Error feedback (likely auth issue)
      alert("Error creando post (¿logueado?)");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Crear Post</h2>

      {/* Title input */}
      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* Content textarea */}
      <textarea
        placeholder="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* Submit button */}
      <button type="submit">Crear</button>
    </form>
  );
}