import { useState } from "react";
import { createPost } from "../api/posts";

export default function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      const newPost = await createPost(title, content);

      // Notificar al componente padre
      onPostCreated?.(newPost);

      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Error creando post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <h2>Crear Post</h2>

      <div className="form-group">
        <input
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      <button className="btn-primary" disabled={loading}>
        {loading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}