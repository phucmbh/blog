import { IoClose } from 'react-icons/io5';
import { motion } from 'framer-motion';

const dropIn = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.25,
    },
  },
};

const DialogModal = ({ children, title, open, onClose, onConfirm }) => {
  if (!open) return <></>;
  return (
    <motion.div
      variants={dropIn}
      initial="hidden"
      animate="visible"
      className="fixed  inset-0 z-50 overflow-auto  bg-gray-700/20 flex"
    >
      <div className="relative p-8 bg-white w-full max-w-md m-auto flex flex-col rounded border ">
        <span className="absolute top-0 right-0 p-4">
          <IoClose onClick={onClose} className="hover:cursor-pointer" />
        </span>
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="py-5">{children}</div>
        <div className="flex justify-end gap-2">
          <button
            className="px-3 py-1 bg-rose-600 text-white rounded-md text-[14px] hover:bg-rose-600/90"
            onClick={() => {
              onClose();
              onConfirm();
            }}
          >
            Yes
          </button>
          <button
            className="px-3 py-1 bg-black text-white rounded-md text-[14px] hover:bg-black/90"
            onClick={onClose}
          >
            No
          </button>
        </div>
      </div>
    </motion.div>
  );
};
export default DialogModal;
