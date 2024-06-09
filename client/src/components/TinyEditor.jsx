import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const TinyEditor = ({ blog, setBlog }) => {

  return (
    <>
      <Editor
        apiKey="bl3d2e9j390ydevofzx409cjzgprr5hdsntkl8sqrb3cjoeq"
        initialValue={blog?.content}
        init={{
          height: 800,
          menubar: true,
          toolbar_sticky: true,
          toolbar_sticky_offset: 80,
          plugins: [
            'image',
            'code',
            'table',
            'link',
            'media',
            'codesample',
            'lists',
          ],
          codesample_languages: [
            { text: 'HTML', value: 'html' },
            { text: 'CSS', value: 'css' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'Java', value: 'java' },
            { text: 'JSON', value: 'json' },
          ],
          toolbar:
            'undo redo | formatselect | blocks |' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'codesample',
          content_style:
            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
          branding: false,
        }}
        onChange={(e) => {
          setBlog({ ...blog, content: e.target.getContent() });
        }}
      />
    </>
  );
};

export default TinyEditor;
