import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/BlogEditor';
import PublishForm from '../components/PublishForm';
import Loader from '../components/Loader';
import axios from 'axios';
import { apiGetBlog } from '../apis';

const blogStructure = {
  title: '',
  banner: {
    public_id: '',
    url: '',
  },
  content: [],
  tags: [],
  des: '',
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const Editor = () => {
  let { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState('editor');
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  let {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    const fetchGetBlog = async () => {
      const blog = await apiGetBlog({
        blog_id,
        draft: true,
        mode: 'edit',
      });
      if (!blog) {
        setBlog(null);
        setLoading(false);
      }
      setBlog(blog);
      setLoading(false);
    };
    fetchGetBlog();
  }, []);

  return (
    <EditorContext.Provider
      value={{
        blog,
        setBlog,
        editorState,
        setEditorState,
        textEditor,
        setTextEditor,
      }}
    >
      {access_token === null ? (
        <Navigate to="/signin" />
      ) : loading ? (
        <Loader />
      ) : editorState == 'editor' ? (
        <BlogEditor />
      ) : (
        <PublishForm />
      )}
    </EditorContext.Provider>
  );
};

export default Editor;
