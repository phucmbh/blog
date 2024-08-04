import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash, FaUser } from 'react-icons/fa';
import { Icon } from '../utils';

const InputBox = ({
  name,
  type,
  id,
  value,
  placeholder,
  icon,
  disable = false,
}) => {
  const [openEye, setOpenEye] = useState(false);

  return (
    <div className="flex items-center relative  w-[100%] mb-4 ">
      <span className="absolute left-[15px]">{Icon(name)}</span>

      <input
        name={name}
        type={type == 'password' && !openEye ? 'password' : 'text'}
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disable}
        className="w-[100%] rounded-md p-4 bg-grey pl-12 border border-grey focus:bg-transparent placeholder:text-black"
      />

      {type == 'password' &&
        (!openEye ? (
          <FaRegEyeSlash
            size={20}
            className="cursor-pointer absolute right-[5%]"
            onClick={() => setOpenEye((currentVal) => !currentVal)}
          />
        ) : (
          <FaRegEye
            size={20}
            className="cursor-pointer absolute right-[5%]"
            onClick={() => setOpenEye((currentVal) => !currentVal)}
          />
        ))}
    </div>
  );
};

export default InputBox;
