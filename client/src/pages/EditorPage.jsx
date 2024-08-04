import { createContext, useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import BlogEditor from '../components/blog/BlogEditor';
import PublishForm from '../components/blog/PublishForm';
import Loader from '../components/Loader';
import { UserContext } from 'context/user.context';
import {  useQuery } from '@tanstack/react-query';
import { ApiBlog } from 'apis/blog.api';

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

  const { isAuthenticated } = useContext(UserContext);

  const {
    data: blogData,
    isLoading,
  } = useQuery({
    queryKey: ['blog', blog_id],
    queryFn: () =>
      ApiBlog.getBlog({
        blog_id,
        draft: true,
        mode: 'edit',
      }),
  });

  useEffect(() => {
    if (blogData) {
      setBlog(blogData.data.blog);
    }
  }, [blogData]);

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
      {!isAuthenticated ? (
        <Navigate to="/signin" />
      ) : isLoading ? (
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
