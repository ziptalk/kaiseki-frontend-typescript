import { useState } from "react";
import DownArrow from "@/public/icons/dwnArrow.svg";
import Selected from "@/public/icons/selected.svg";
interface DropdownProps {
  items: { item: string; value: string }[];
  placeholder: string;
  setItem: (item: any) => void;
}

export const Dropdown = ({ items, placeholder, setItem }: DropdownProps) => {
  const [isDropdownView, setDropdownView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(items[0].item);

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
        className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#363636] text-sm text-[#AEAEAE] hover:bg-[#454545] md:text-base"
      >
        {placeholder}
        {selectedItem}
        <DownArrow
          className={`ml-[10px] h-[14px] w-[16px] ${isDropdownView && "rotate-180"} fill-[#AEAEAE]`}
        />
      </button>
      <div
        className={`absolute  z-20  mt-1 flex w-full flex-col items-center justify-center rounded-[10px] bg-[#363636]`}
      >
        {isDropdownView &&
          items.map((li, i) => (
            <div
              onClick={() => {
                setSelectedItem(li.item);
                setItem(li.value);
                setDropdownView(false);
              }}
              key={i}
              className="relative w-full cursor-pointer rounded-[10px] px-[15px] py-[10px] text-center text-[#AEAEAE]  hover:bg-[#454545]"
            >
              {selectedItem === li.item && (
                <Selected className="absolute left-8 top-3" />
              )}
              <div className="ml-4">{li.item}</div>
            </div>
          ))}
      </div>
    </div>
  );
};
