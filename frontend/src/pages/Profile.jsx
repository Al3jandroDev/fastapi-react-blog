import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";

import API_URL from "../api/client";
import { useNavigate } from "react-router-dom";


export default function Profile() {

  const { id } = useParams();

  const [profile, setProfile] = useState(null);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {

    fetchProfile();

  }, [id]);


  const fetchProfile = async () => {

    try {

      const res = await fetch(
        `${API_URL}/users/${id}`
      );

      if (!res.ok) {
        throw new Error("Failed to load profile");
      }

      const data = await res.json();

      setProfile(data);

    } catch (err) {

      console.error(err);

    } finally {

      setLoading(false);
    }
  };


  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (!profile) {
    return <p>Profile not found</p>;
  }



  return (

    <div className="profile-container">

      <button
        className="back-btn"
        onClick={() => navigate("/")}
      >
        Back to feed
      </button>

      {/* HEADER */}
      <div className="profile-header">

        <div className="avatar">
          👤
        </div>

        <div>

          <h2>
            @{profile.username}
          </h2>

          <p>
            {profile.bio}
          </p>

        </div>

      </div>


      {/* POSTS */}
      <div className="profile-posts">

        <h3>
          Posts
        </h3>

        {profile.posts.length === 0 ? (

          <p>No posts yet</p>

        ) : (

          profile.posts.map((post) => (

            <div
              key={post.id}
              className="profile-post"
            >

              <small>
                👤 @{profile.username}
              </small>

              <h4>
                {post.title}
              </h4>

              <p>
                {post.content}
              </p>

              <small>
                ❤️ {post.likes_count}
              </small>

            </div>
          ))
        )}

      </div>

    </div>
  );
}