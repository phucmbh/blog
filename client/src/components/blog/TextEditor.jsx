import { Editor } from '@tinymce/tinymce-react';
import {
  IMAGES_UPLOAD_URL,
  handleImagesUpload,
  tinyCodesample,
  tinyContentStyle,
  tinyPlugins,
  tinyToolbar,
} from '../../utils';
import {  useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { apiAutoSaveContent } from '../../apis';
import useInterval from '../../utils/hook/useInterval';

const TextEditor = ({ blog, setEditorContent }) => {
  const { blog_id } = useParams();
  const [newContent, setNewContent] = useState(blog?.content);
  const [currentContent, setCurrentContent] = useState(blog?.content);
  const TWO_MINUTES = 2 * 60 * 1000;

  if (blog_id) {
    useInterval(() => {
      if (currentContent !== newContent) return fectAutosave();
    }, TWO_MINUTES);
  }
  console.log(newContent);

  const fectAutosave = async () => {
    const response = await apiAutoSaveContent({
      id: blog_id,
      content: newContent,
    });
    if (response.success) {
      return setCurrentContent(response.content);
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
          license_key: 'gpl',
          plugins: tinyPlugins,
          codesample_languages: tinyCodesample,
          toolbar: tinyToolbar,
          content_style: tinyContentStyle,
          branding: false,
          promotion: false,
          link_default_target: '_blank',
          images_upload_url: IMAGES_UPLOAD_URL,
          file_picker_types: 'image media',
          automatic_uploads: true,
          images_upload_handler: handleImagesUpload,
          sandbox_iframes: true,
          media_live_embeds: true,

          
          
          setup: function (editor) {
            editor.on('PreInit', function () {
              editor.parser.addNodeFilter('iframe', function (nodes) {
                nodes.forEach(function (node) {
                  node.attr('sandbox', 'allow-scripts allow-same-origin');
                });
              });
            });
          },
        }}
        onEditorChange={(content, editor) => {
          editor.on('PreInit', function () {
            editor.parser.addNodeFilter('iframe', function (nodes) {
              nodes.forEach(function (node) {
                node.attr('sandbox', 'allow-scripts allow-same-origin');
              });
            });
          });
          editor.iframeElement.setAttribute(
            'sandbox',
            'allow-scripts allow-same-origin allow-popups allow-forms'
          );
          // console.log(editor.iframeElement.getAttribute('sandbox'));

          setNewContent(content);
          setEditorContent(content);
        }}
      />
    </div>
  );
};

export default TextEditor;
