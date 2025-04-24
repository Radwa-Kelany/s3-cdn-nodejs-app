import React, { useEffect, useState } from 'react';
import axios from 'axios';

import SinglePost from './SinglePost';

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function getPosts() {
      const result = await axios.get('http://localhost:8080/api/posts');
      setPosts(result.data);
    }
    getPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => {
        return (
          <div className="container">
            <SinglePost post={post}></SinglePost>
          </div>
        );
      })}
    </div>
  );
}

export default Home;
