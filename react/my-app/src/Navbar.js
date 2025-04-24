import React from 'react';
import { useNavigate } from 'react-router-dom';
function Navbar() {
  const Navigate = useNavigate();
  function createPost() {
    Navigate('/newPost');
  }
  return (
    <div className="navbar">
      <nav className='nav-flex'>
        <h1>Insta App</h1>
        <button className="btn-create" onClick={createPost}>
          Create Post
        </button>
      </nav>
    </div>
  );
}

export default Navbar;
