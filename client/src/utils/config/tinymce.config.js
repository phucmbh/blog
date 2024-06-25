export const tinyPlugins = [
  'advlist',
  'autolink',
  'accordion',
  'advcode',
  'advtable',
  'anchor',
  'autoresize',
  'lists',
  'link',
  'image',
  'editimage',
  'insertdatetime',
  'charmap',
  'searchreplace',
  'preview',
  'visualblocks',
  'code',
  'fullscreen',
  'media',
  'emoticons',
  'table',
  'code',
  'codesample',
  'powerpaste',
  'pageembed',
];

export const tinyToolbar =
  'undo redo | insert | styles | link image codesample insertfile | alignleft aligncenter alignright alignjustify | bullist numlist advlist outdent indent accordion';

export const tinyCodesample = [
  { text: 'JavaScript', value: 'javascript' },
  { text: 'Java', value: 'java' },
  { text: 'HTML', value: 'html' },
  { text: 'CSS', value: 'css' },
  { text: 'SQL', value: 'sql' },
];

export const tinyContentStyle =
  'body { font-family:Inter,Arial,sans-serif; font-size:18px }';

const CLOUD_NAME = 'nonenone25251325zz';
const UNSIGNED_UPLOAD_PRESET = 'adz8s31b';

export const IMAGES_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

export const handleImagesUpload = (blobInfo, progress, failure) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', IMAGES_UPLOAD_URL, true);

    let formData = new FormData();
    formData.append('file', blobInfo.blob(), blobInfo.filename());
    formData.append('upload_preset', UNSIGNED_UPLOAD_PRESET);
    formData.append('tags', 'browser_upload');
    //console.log(blobInfo.filename())

    xhr.upload.onprogress = (e) => {
      progress((e.loaded / e.total) * 100);
      if (progress && typeof progress === 'function') {
        const percent = 0;
        progress(percent);
      }
    };

    xhr.onload = () => {
      if (xhr.status === 403) {
        reject({ message: 'HTTP Error: ' + xhr.status, remove: true });
        return;
      }

      if (xhr.status < 200 || xhr.status >= 300) {
        reject('HTTP Error: ' + xhr.status);
        return;
      }

      const json = JSON.parse(xhr.responseText);

      if (!json || typeof json.secure_url != 'string') {
        reject('Invalid JSON: ' + xhr.responseText);
        return;
      }
      console.log(json);

      resolve(json.secure_url);
    };

    xhr.onerror = () => {
      reject({ message: 'Image upload failed', remove: true });
      if (failure && typeof failure === 'function') {
        failure('Image upload failed');
      }
    };

    xhr.send(formData);
  });
};
