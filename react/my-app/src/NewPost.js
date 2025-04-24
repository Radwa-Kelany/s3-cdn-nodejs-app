import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function NewPost() {
  const [file, setFile] = useState();
  const [caption, setCaption] = useState('');
  const Navigate = useNavigate();
  const submit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    await axios.post('http://localhost:8080/api/posts', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    Navigate('/');
  };

  const fileSelected = (event) => {
    const file = event.target.files[0];
    setFile(file);
  };
  return (
    <div className='App'>
      <h1>Create a Post</h1>
      <form  className="" onSubmit={submit}>
        <input className='input-img' onChange={fileSelected} type="file" accept="image/*" />
        <input className='input-caption'
          onChange={(e) => setCaption(e.target.value)}
          value={caption}
          type="text"
          placeholder="Caption"
        />
        <button className='btn-submit' type="submit">Submit</button>
      </form>
    </div>
  );
}

export default NewPost;
