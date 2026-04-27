import { useEffect, useState } from "react";
import { getPosts } from "../api/posts";

/**
 * Component to display a list of posts
 */
export default function Posts() {

  // States
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Fetch posts when component mounts
   */
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await getPosts();
        setPosts(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Loading state
  if (loading) {
    return <p>Loading posts...</p>;
  }

  // Error state
  if (error) {
    return <p>{error}</p>;
  }

  // Empty state
  if (!posts.length) {
    return <p>No posts yet</p>;
  }

  return (
    <div>
      <h2>Posts</h2>

      {/* Render list of posts */}
      {posts.map((post) => (
        <div key={post.id} className="post">
          <h3>{post.title}</h3>
          <p>{post.content}</p>

          {/* Extra info */}
          <small>Author ID: {post.author_id}</small>
        </div>
      ))}
    </div>
  );
}