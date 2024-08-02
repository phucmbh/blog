import { createContext, useContext, useEffect, useState } from 'react';
import { UserContext } from '../App';
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/blog/BlogEditor';
import PublishForm from '../components/blog/PublishForm';
import Loader from '../components/Loader';
import { apiGetBlog } from '../apis';
import axios from 'axios';

const blogStructure = {
  title: '',
  banner: '',
  content: '',
  tags: [],
  des: '',
  author: { personal_info: {} },
};

export const EditorContext = createContext({});

const EditorPage = () => {
  const { blog_id } = useParams();

  const [blog, setBlog] = useState(blogStructure);
  const [editorState, setEditorState] = useState('editor');
  const [textEditor, setTextEditor] = useState({ isReady: false });
  const [loading, setLoading] = useState(true);

  const {
    userAuth: { access_token },
  } = useContext(UserContext);

  useEffect(() => {
    if (!blog_id) {
      return setLoading(false);
    }

    const fetchBlog = async () => {
      const response = await apiGetBlog({
        blog_id,
        draft: true,
        mode: 'edit',
      });

      if (!response.success) {
        setBlog(null);
        return setLoading(false);
      }

      setBlog(response.blog);
      setLoading(false);
    };

    fetchBlog();
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

export default EditorPage;
