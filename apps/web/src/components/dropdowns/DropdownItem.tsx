import Link from "next/link";

interface DropdownItemProps {
  children: React.ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
}
const DropdownItem: React.FC<DropdownItemProps> = ({
  href,
  children,
  className,
  onClick,
}) => {
  return (
    <li className={`w-full`}>
      <Link
        href={href || "#"}
        className={`${className} px-3 py-2 active:bg-white-600 hover:bg-gray-200 flex`}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
};

export default DropdownItem;
