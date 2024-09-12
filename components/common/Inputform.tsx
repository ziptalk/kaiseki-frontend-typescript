import React from "react";
import { comicNeue } from "@/fonts/font";
import { UseFormRegister } from "react-hook-form";
interface InputformProps {
  viewName?: string;
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
  viewName,
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
    "mt-2 h-13 w-full rounded-md border border-[#8F8F8F] bg-[#303030] p-2.5 text-white outline-none";
  return (
    <div className="w-full md:w-[484px]">
      <div className="text-sm font-bold text-white md:text-[16px]">
        {viewName || name}
      </div>
      {type === "textarea" ? (
        <textarea
          className={`${sharedStyle} h-40 resize-none`}
          {...register(name, { maxLength })}
        />
      ) : type === "file" ? (
        <div className={sharedStyle + " p-0"}>
          <label htmlFor={"upload"} className="cursor-pointer">
            <div>{file && file.length ? file[0].name : "Choose a file"}</div>
          </label>
          <input
            type={type ? type : `text`}
            id={"upload"}
            className={"hidden"}
            placeholder={optional ? "(optional)" : ""}
            {...register(name, { maxLength, onChange })}
          />
        </div>
      ) : type === "number" ? (
        <div
          className={`h-13 mt-2 flex w-full items-center justify-between rounded-md border border-[#8F8F8F] bg-[#303030] p-2.5 text-white outline-none ${value !== "" && Number(value) < 0.01 ? "border-[#FF2626]" : "border-[#8F8F8F]"}`}
        >
          <input
            type={type ? type : `text`}
            step={0.01}
            placeholder={
              type === "number" ? "The minimum value allowed is 0.01 ETH" : ""
            }
            className={`"h-full w-full bg-transparent  outline-none ${value !== "" && Number(value) < 0.01 ? "text-[#FF2626]" : "text-white"}`}
            {...register(name, { maxLength, onChange })}
          />
          <div className="text-sm font-bold">ETH</div>
        </div>
      ) : (
        <input
          type={type ? type : `text`}
          autoComplete="off"
          className={sharedStyle}
          placeholder={optional ? "(optional)" : ""}
          {...register(name, { maxLength, onChange })}
        />
      )}
      {type === "file" || optional || !maxLength || (
        <div
          className={`text-right text-sm font-light ${value && value.length > maxLength ? "text-[#FF2626]" : "text-[#AEAEAE]"} md:text-base ${comicNeue.variable} font-comicNeue`}
        >
          {value?.length}
          <div className="inline text-[#AEAEAE]">/{maxLength}</div>
        </div>
      )}
    </div>
  );
};
