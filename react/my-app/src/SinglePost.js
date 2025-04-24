import React from 'react';
import axios from 'axios';
import { ChatIcon, UserIcon, TrashIcon } from '@heroicons/react/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/outline';
import { useNavigate } from 'react-router-dom';

function SinglePost({ post }) {
  const navigate = useNavigate();
  const deletePost = async (id) => {
    console.log(id);
    await axios.delete(`http://localhost:8080/api/posts/${id}`);
    navigate('/');
    window.location.reload();
  };
  return (
    <div>
      <div className="flex-row user">
        <UserIcon className="icon"></UserIcon>
        <p>username</p>
      </div>
      <div className="flex-row" key={post.id}>
        <div>
          <h2>{post.caption}</h2>
          <img className="img" src={post.imageUrl} alt="jpg" />
        </div>
        <div className="actions flex-column">
          <HeartOutline className="icon"></HeartOutline>
          <ChatIcon className="icon"></ChatIcon>
          <button onClick={() => deletePost(post.id)} className="btn-del">
            <TrashIcon className="icon"></TrashIcon>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SinglePost;
