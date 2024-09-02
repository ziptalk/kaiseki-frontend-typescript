import React from "react";
import { comicNeue } from "@/fonts/font";
import { UseFormRegister } from "react-hook-form";
interface InputformProps {
  name: string;
  maxLength?: number;
  register: UseFormRegister<any>;
  value?: string;
  file?: FileList;
  type?: string;
  optional?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Inputform = ({
  name,
  maxLength,
  register,
  type,
  value,
  file,
  optional = false,
  onChange,
}: InputformProps) => {
  const sharedStyle =
    "mt-2 h-13 w-full rounded-md border border-[#8F8F8F] bg-[#303030] p-2.5 text-white";
  return (
    <div className="w-[484px]">
      <div className="text-[16px] font-bold text-white">{name}</div>
      {type === "textarea" ? (
        <textarea
          className={`${sharedStyle} h-40 resize-none`}
          {...register(name, { maxLength })}
        />
      ) : type === "file" ? (
        <div className={sharedStyle + " p-0"}>
          <label htmlFor={"upload"} className="cursor-pointer">
            <div className="p-2.5">
              {file && file.length ? file[0].name : "Choose a file"}
            </div>
          </label>
          <input
            type={type ? type : `text`}
            id={"upload"}
            className={"hidden"}
            placeholder={optional ? "(optional)" : ""}
            {...register(name, { maxLength, onChange })}
          />
        </div>
      ) : (
        <input
          type={type ? type : `text`}
          className={sharedStyle}
          placeholder={optional ? "(optional)" : ""}
          {...register(name, { maxLength, onChange })}
        />
      )}
      {type === "file" || optional || (
        <div
          className={`text-right text-base font-light text-[#fff] ${comicNeue.variable} font-comicNeue`}
        >
          {value?.length}/{maxLength}
        </div>
      )}
    </div>
  );
};
