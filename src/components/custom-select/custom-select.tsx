/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-nested-ternary */
import React from 'react';
import Select, { GroupBase, OptionsOrGroups, PropsValue } from 'react-select';
import { ActionMeta } from 'react-select/dist/declarations/src/types';

export default function CustomSelect({ options, onChange, value }: {
    options: OptionsOrGroups<string, GroupBase<string>> | undefined,
    onChange?: ((newValue: any, actionMeta: ActionMeta<string>) => void) | undefined,
    value?: PropsValue<string> | undefined,
  }) {
  const customSelectStyle = {
    control: (baseStyles: any, state: { isFocused: boolean; }) => ({
      ...baseStyles,
      minWidth: 175,
      width: '100%',
      minHeight: 28,
      maxHeight: 30,
      borderColor: state.isFocused ? 'grey' : '#ccc',
      backgroundColor: '#f0f1f3',
      color: '#000',
    }),
    valueContainer: (baseStyles: any) => ({
      ...baseStyles,
      padding: '1px 8px',
    }),
    dropdownIndicator: (base: any) => ({
      ...base,
      padding: 3,
      minHeight: 28,
      maxHeight: 30,
    }),
    option: (styles: { [x: string]: any; }, {
      data, isDisabled, isFocused, isSelected,
    }: any) => ({
      ...styles,
      cursor: isDisabled ? 'not-allowed' : 'default',
      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? '#ccc'
          : isFocused
            ? '#f6f6f6'
            : undefined,
      color: '#000',
      ':active': {
        ...styles[':active'],
        backgroundColor: '#f6f6f6',
      },
    }),
  };
  return (
    <Select
      styles={customSelectStyle}
      options={options}
      onChange={onChange}
      value={value}
    />
  );
}
