import { Link, useNavigate, useParams } from 'react-router-dom';
import lightLogo from '../../assets/images/logo-light.png';
import darkLogo from '../../assets/images/logo-dark.png';

import lightBanner from '../../assets/images/blog-banner-light.png';
import darkBanner from '../../assets/images/blog-banner-dark.png';

import AnimationWrapper from '../../utils/common/page-animation';
import { useContext, useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { EditorContext } from '../../pages/EditorPage';

import TextEditor from './TextEditor';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiBlog } from 'apis/blog.api';
import { ThemeContext } from 'context/theme.context';

const BlogEditor = () => {
  const {
    blog,
    blog: { title, banner, content, tags, des },
    setBlog,
    setEditorState,
  } = useContext(EditorContext);

  const { theme } = useContext(ThemeContext);
  const { blog_id } = useParams();

  const navigate = useNavigate();

  const [editorContent, setEditorContent] = useState('');
  const queryClient = useQueryClient();


  const createBlogMutation = useMutation({
    mutationFn: ApiBlog.createBlog,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ['latest-blogs'] }),
        queryClient.invalidateQueries({ queryKey: ['blogs', 1, ''] }),
      ]),
  });

  const uploadBannerMutation = useMutation({
    mutationFn: ApiBlog.uploadImageBanner,
  });

  const handleBannerUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    if (file) {
      const loadingToast = toast.loading('Uploading...');
      const banner = await uploadBannerMutation.mutateAsync(formData);
      if (banner?.url) {
        toast.dismiss(loadingToast);
        toast.success('Uploaded');

        setBlog({ ...blog, banner });
      } else {
        toast.dismiss(loadingToast);
        return toast.error('Upload failed');
      }
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.keyCode == 13) {
      //enter key
      e.preventDefault();
    }
  };

  const handleTitleChange = (e) => {
    let input = e.target;

    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';

    setBlog({ ...blog, title: input.value });
  };

  const handleError = (e) => {
    let img = e.target;
    img.src = theme == 'light' ? lightBanner : darkBanner;
  };

  const handlePublishEvent = () => {
    setBlog({ ...blog, content: editorContent });
    if (!banner?.url?.length) {
      return toast.error('Upload a blog banner to publish it');
    }

    if (!title.length) {
      return toast.error('Write blog title to publish it');
    }

    if (!blog.content.length)
      return toast.error('Write something in your blog to publish it');
    setEditorState('publish');
  };

  const handleSaveDraft = async (e) => {
    setBlog({ ...blog, content: editorContent });

    if (e.target.className.includes('disable')) {
      return;
    }

    if (!title.length) {
      return toast.error('Write blog title before saving it as a Draft');
    }

    e.target.classList.add('disable');

    let blogObj = {
      title,
      banner,
      des,
      content,
      tags,
      draft: true,
    };

    await createBlogMutation.mutateAsync({ ...blogObj, id: blog_id });
    console.log(createBlogMutation);
    const { isSuccess, isError, isPending } = createBlogMutation;
    let loadingToast = toast.loading('Saving Draft...');
    if (isPending) {
      return loadingToast;
    }

    if (isSuccess) {
      toast.dismiss(loadingToast);
      toast.success('Saved');
      return setTimeout(() => {
        navigate('/dashboard/blogs?tab=draft');
      }, 500);
    }
    if (isError) {
      toast.dismiss(loadingToast);
      return toast.error(createBlogMutation.error);
    }
  };

  return (
    <>
      <nav className="navbar">
        <Link to="/" className="flex-none h-8">
          <img
            src={theme == 'light' ? darkLogo : lightLogo}
            className="w-full h-full mt-1"
          />
        </Link>
        <p className="max-md:hidden text-black blog-title line-clamp-1 w-full">
          {title?.length ? title : 'New Blog'}
        </p>

        <div className="flex gap-4 ml-auto">
          <button className="btn-dark py-2" onClick={handlePublishEvent}>
            Publish
          </button>
          <button className="btn-light py-2" onClick={handleSaveDraft}>
            Save Draft
          </button>
        </div>
      </nav>
      <Toaster />
      <AnimationWrapper>
        <section>
          <div className="mx-auto max-w-[900px] w-full">
            <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
              <label htmlFor="uploadBanner">
                <img
                  src={banner?.url}
                  className="z-20 h-full w-full"
                  onError={handleError}
                />
                <input
                  id="uploadBanner"
                  type="file"
                  accept=".png, .jpg, .jpeg"
                  hidden
                  onChange={handleBannerUpload}
                />
              </label>
            </div>

            <textarea
              defaultValue={title}
              placeholder="Blog Title"
              className="text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40 bg-white"
              onKeyDown={handleTitleKeyDown}
              onChange={handleTitleChange}
            ></textarea>

            <hr className="w-full opacity-10 my-5" />
            <TextEditor
              blog={blog}
              editorContent={editorContent}
              setEditorContent={setEditorContent}
            />
          </div>
        </section>
      </AnimationWrapper>
    </>
  );
};

export default BlogEditor;
