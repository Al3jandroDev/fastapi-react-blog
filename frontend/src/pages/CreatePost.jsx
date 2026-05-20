import { useState } from "react";
import { createPost } from "../api/posts";

export default function CreatePost({ onPostCreated }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) return;

    setLoading(true);

    try {
      let image_url = null;

      // 1. subir imagen SOLO si existe
      if (image) {
        setUploading(true);

        const formData = new FormData();
        formData.append("file", image);

        const res = await fetch("http://localhost:8000/upload/image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) throw new Error("Error uploading image");

        const data = await res.json();
        image_url = data.url;

        setUploading(false);
      }

      // 2. crear post con o sin imagen
      const newPost = await createPost({
        title,
        content,
        image_url, // 👈 IMPORTANTE
      });

      onPostCreated?.(newPost);

      setTitle("");
      setContent("");
      setImage(null);

    } catch (err) {
      console.error(err);
      alert("Error creando post");
    } finally {
      setLoading(false);
      setUploading(false);
    }
  };

  return (
    <form className="create-post" onSubmit={handleSubmit}>
      <h2>Crear Post</h2>

      <input
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* INPUT IMAGEN */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
      />

      {/* PREVIEW */}
      {image && (
        <img
          src={URL.createObjectURL(image)}
          alt="preview"
          style={{ width: "100%", borderRadius: "10px", marginTop: "10px" }}
        />
      )}

      <button disabled={loading || uploading}>
        {uploading ? "Subiendo imagen..." : loading ? "Creando..." : "Crear"}
      </button>
    </form>
  );
}