import { useState } from "react";
import DownArrow from "@/public/icons/dwnArrow.svg";
interface DropdownProps {
  items: any[];
  placeholder: string;
  setItem: (item: any) => void;
}

export const Dropdown = ({ items, placeholder, setItem }: DropdownProps) => {
  const [isDropdownView, setDropdownView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleClickContainer = () => {
    setDropdownView(!isDropdownView);
  };

  return (
    <div
      className="relative h-10 flex-1 md:h-[50px]"
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        onClick={handleClickContainer}
        className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#363636] text-sm text-[#AEAEAE] md:text-base"
      >
        {placeholder}
        {selectedItem}
        <DownArrow
          className={`ml-[10px] h-[14px] w-[16px] ${isDropdownView && "rotate-180"} fill-[#AEAEAE]`}
        />
      </button>
      <div
        className={`absolute mt-1 flex w-full flex-col items-center justify-center rounded-[10px] bg-[#363636]`}
      >
        {isDropdownView &&
          items.map((li, i) => (
            <div
              onClick={() => {
                setSelectedItem(li);
                setItem(li);
                setDropdownView(false);
              }}
              key={i}
              className="w-full cursor-pointer rounded-[10px] px-[15px] py-[10px] text-center text-[#AEAEAE] hover:bg-[#2a2a2a]"
            >
              {li}
            </div>
          ))}
      </div>
    </div>
  );
};
