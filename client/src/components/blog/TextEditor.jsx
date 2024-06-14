import { Editor } from '@tinymce/tinymce-react';
import {
  IMAGES_UPLOAD_URL,
  handleImagesUpload,
  tinyCodesample,
  tinyContentStyle,
  tinyPlugins,
  tinyToolbar,
} from '../../utils';
import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiAutoSaveContent } from '../../apis';
import useInterval from '../../utils/hook/useInterval';

const TextEditor = ({ blog, setEditorContent }) => {
  const { blog_id } = useParams();
  const [newContent, setNewContent] = useState(blog?.content);
  const [currentContent, setCurrentContent] = useState(blog?.content);

  if (blog_id) {
    useInterval(() => {
      if (currentContent !== newContent) return fectAutosave();
    }, 30000);
  }

  const fectAutosave = async () => {
    const response = await apiAutoSaveContent({
      id: blog_id,
      content: newContent,
    });
    if (response.success) {
      setCurrentContent(response.content);
      return toast.success('Autosave');
    }
    return toast.error('Autosave failed');
  };

  return (
    <div className="sticky z-50">
      <Editor
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        initialValue={blog.content}
        init={{
          menubar: true,
          min_height: 500,
          toolbar_sticky: true,

          plugins: tinyPlugins,
          codesample_languages: tinyCodesample,
          toolbar: tinyToolbar,
          content_style: tinyContentStyle,
          branding: false,
          promotion: false,
          details_serialized_state: 'collapsed',
          license_key: 'gpl',
          images_upload_url: IMAGES_UPLOAD_URL,
          file_picker_types: 'image',
          images_upload_handler: handleImagesUpload,
        }}
        onEditorChange={(newContent, editor) => {
          setNewContent(newContent);
          setEditorContent(newContent);
        }}
      />
    </div>
  );
};

export default TextEditor;
