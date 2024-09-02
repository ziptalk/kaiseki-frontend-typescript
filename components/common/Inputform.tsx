import React from "react";
import { comicNeue } from "@/fonts/font";

interface InputformProps {
  setValueProp: (value: string) => void;
  max: number;
}

export const Inputform = ({ setValueProp, max }: InputformProps) => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    setValueProp(e.target.value);
  };
  return (
    <div className="w-[484px]">
      <div className="text-[16px] font-bold text-white">Name</div>
      <input
        type="text"
        className="mt-2 h-12 w-full rounded-md border border-[#8F8F8F] bg-[#303030] p-2.5 text-lg text-white"
        onChange={handleChange}
      />
      <div
        className={`text-right text-base font-light text-[#fff] ${comicNeue.variable} font-comicNeue`}
      >
        {value.length}/{max}
      </div>
    </div>
  );
};
