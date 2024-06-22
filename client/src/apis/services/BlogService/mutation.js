import { useMutation } from '@tanstack/react-query';
import BlogService from './service';

// export const useUpdateProductById = () => {
//   return useMutation({
//     mutationFn: (data) => {
//       const { id, ...rest } = data;
//       return ProductService.updateProductById(id, rest);
//     },
//   });
// };

export const useUploadImageBanner = () => {
  return useMutation({
    mutationFn: (file) => {
      return BlogService.uploadImageBanner(file);
    },
  });
};

export const useDeleteBlogById = () => {
  return useMutation({
    mutationFn: (data) => {
      console.log(data);
      return BlogService.deleteBlog(data);
    },
  });
};

export const useCreateBlog = () => {
  return useMutation({
    mutationFn: (data) => {
      return BlogService.createBlog(data);
    },
  });
};

export const useAutoSaveContent = () => {
  return useMutation({
    mutationFn: (data) => {
      return BlogService.autoSaveContent(data);
    },
  });
};

export const useLikeBlog = () => {
  return useMutation({
    mutationFn: (data) => {
      return BlogService.likeBlog(data);
    },
  });
};

export const useSearchBlogs = () => {
  return useMutation({
    mutationFn: (data) => {
      return BlogService.searchBlogs(data);
    },
  });
};

export const useUserWrittenBlogs = () => {
  return useMutation({
    mutationFn: (data) => {
      return BlogService.userWrittenBlogs(data);
    },
  });
};
