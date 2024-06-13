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
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <div className="flex items-center relative  w-[100%] mb-4 ">
      <span className="absolute left-[15px]">{Icon(name)}</span>

      <input
        name={name}
        type={
          type == 'password' ? (passwordVisible ? 'text' : 'password') : type
        }
        placeholder={placeholder}
        defaultValue={value}
        id={id}
        disabled={disable}
        className="w-[100%] rounded-md p-4 bg-grey pl-12 border border-grey focus:bg-transparent placeholder:text-black"
      />

      {type == 'password' &&
        (!passwordVisible ? (
          <FaRegEyeSlash
            size={20}
            className="cursor-pointer absolute right-[5%]"
            onClick={() => setPasswordVisible((currentVal) => !currentVal)}
          />
        ) : (
          <FaRegEye
            size={20}
            className="cursor-pointer absolute right-[5%]"
            onClick={() => setPasswordVisible((currentVal) => !currentVal)}
          />
        ))}
    </div>
  );
};

export default InputBox;
