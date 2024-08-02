import clsx from 'clsx';
import { AiOutlineLoading } from 'react-icons/ai';

const Button = ({
  children,
  isLoading,
  className = 'btn-dark pl-10 pr-5 flex items-center gap-2',
}) => {
  return (
    <button className={className} disabled={isLoading}>
      {children}
      <div className="w-5">
        {isLoading && <AiOutlineLoading className="animate-spin " size={20} />}
      </div>
    </button>
  );
};
export default Button;
