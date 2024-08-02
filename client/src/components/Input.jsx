import { useState } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';

const Input = ({ name, type, icon, errorMessage, register, ...rest }) => {
  const [openEye, setOpenEye] = useState(false);
  const registerResult = register ? register(name) : null;

  const handleOnclick = () => {
    setOpenEye(!openEye);
  };

  return (
    <div className="w-[100%] mb-4">
      <div className="flex items-center relative">
        <span className="absolute left-[15px]">{icon}</span>

        <input
          {...registerResult}
          {...rest}
          type={type == 'password' && !openEye ? 'password' : 'text'}
          className="w-[100%] rounded-md p-4 bg-grey pl-12 border border-grey focus:bg-transparent placeholder:text-black"
        />

        {type == 'password' &&
          (!openEye ? (
            <FaRegEyeSlash
              size={20}
              className="cursor-pointer absolute right-[5%]"
              onClick={handleOnclick}
            />
          ) : (
            <FaRegEye
              size={20}
              className="cursor-pointer absolute right-[5%]"
              onClick={handleOnclick}
            />
          ))}
      </div>
      <div className="text-rose-700 text-xs">{errorMessage}</div>
    </div>
  );
};

export default Input;
