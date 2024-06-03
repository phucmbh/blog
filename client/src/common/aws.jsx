import axios from 'axios';

export const uploadImage = async (img) => {
  let imgUrl = null;

  await axios
    .get(import.meta.env.VITE_SERVER_DOMAIN + '/get-upload-url')
    .then(async ({ data: { uploadURL } }) => {
      await axios({
        method: 'PUT',
        url: uploadURL,
        headers: { 'Content-Type': 'multipart/form-data' },
        data: img,
      }).then(() => {
        imgUrl = uploadURL.split('?')[0];
      });
    });

  return imgUrl;
};

export const uploadImage2 = async (img) => {
  const formData = new FormData();
  formData.append('image', img)

  const {imgUrl} = await axios({
    method: 'POST',
    url: import.meta.env.VITE_SERVER_DOMAIN + '/get-upload-url',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: formData,
  });

    return imgUrl;
};
