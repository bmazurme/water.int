import React from 'react';

import style from './input-field.module.css';

type TypeInputFieldProps = {
  type: 'text' | 'password';
  name: string;
  value?: string;
  errors: Record<string, string>;
  onChange?: () => void;
};

export default function InputField({
  type, name, errors, onChange, value,
}: TypeInputFieldProps) {
  return (
    <div className={style.field}>
      <input
        type={type}
        className={style.input}
        name={name}
        value={value}
        placeholder={name}
        onChange={onChange}
      />
      {errors[name]
        && (
        <span className={style.error}>
          {`${errors[name]}`}
        </span>
        )}
    </div>
  );
}
