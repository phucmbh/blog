import { Editor } from '@tinymce/tinymce-react';
import {
  IMAGES_UPLOAD_URL,
  handleImagesUpload,
  tinyCodesample,
  tinyContentStyle,
  tinyPlugins,
  tinyToolbar,
} from '../utils';

const TextEditor = ({ blog, setEditorContent }) => {
  return (
    <>
      <Editor
        apiKey="bl3d2e9j390ydevofzx409cjzgprr5hdsntkl8sqrb3cjoeq"
        initialValue={blog.content}
        init={{
          height: 800,
          menubar: true,
          toolbar_sticky: true,
          toolbar_sticky_offset: 80,
          plugins: tinyPlugins,
          codesample_languages: tinyCodesample,
          toolbar: tinyToolbar,
          content_style: tinyContentStyle,
          branding: false,
          images_upload_url: IMAGES_UPLOAD_URL,
          file_picker_types: 'image',
          images_upload_handler: handleImagesUpload,
        }}
        onChange={(e) => {
          setEditorContent(e.target.getContent());
        }}
      />
    </>
  );
};

export default TextEditor;
