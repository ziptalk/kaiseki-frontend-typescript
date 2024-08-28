import { useState } from "react";
interface DropdownProps {
  items: string[];
  placeholder: string;
  width: number;
}

export const Dropdown = ({ items, placeholder, width }: DropdownProps) => {
  const [isDropdownView, setDropdownView] = useState(false);
  const [selectedItem, setSelectedItem] = useState(items[0]);

  const handleClickContainer = () => {
    setDropdownView(!isDropdownView);
  };

  return (
    <div className="h-[50px]" style={{ width }}>
      <button
        onClick={handleClickContainer}
        className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#363636] text-[16px] text-[#AEAEAE]"
      >
        {placeholder}
        {selectedItem}
        {isDropdownView ? (
          <img
            src="/icons/dwnArrow.svg"
            alt="uparr"
            className="ml-[10px] h-[14px] w-[16px] rotate-180"
          />
        ) : (
          <img
            src="/icons/dwnArrow.svg"
            alt="downarr"
            className="ml-[10px] h-[14px] w-[16px]"
          />
        )}
      </button>
      <div
        className={`absolute mt-1 flex flex-col items-center justify-center rounded-[10px] bg-[#363636]`}
        style={{ width }}
      >
        {isDropdownView &&
          items.map((li, i) => (
            <div
              onClick={() => {
                setSelectedItem(li);
                setDropdownView(false);
                console.log("selectedItem", selectedItem);
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
