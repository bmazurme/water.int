import React, { useState } from 'react';
import { useParams } from 'react-router';
import { GroupBase, OptionsOrGroups } from 'react-select';
import { useErrorBoundary } from 'react-error-boundary';

import Button from '../../components/button';
import CustomSelect from '../../components/custom-select';

import useBlocks from '../../hooks/use-blocks';
import useFormWithValidation from '../../hooks/use-form-with-validation';
import { useAppDispatch } from '../../hooks';
import { useChangeItemValuesMutation, useChangeItemValueMutation, useGetItemTypesQuery } from '../../store/api';
import { setItemPopup, setHistory } from '../../store/slices';

import style from './item-form-layout.module.css';

type TypeOptions = OptionsOrGroups<string, GroupBase<string>>;

export default function ItemFormLayout({ currentColumnIndex, id }
  : { currentColumnIndex: number, id: string }) {
  const dispatch = useAppDispatch();
  const blocks: TypeBlock = useBlocks();
  const initType = blocks[currentColumnIndex].items
    .find((x: TypeItem) => x.id === id)!.item as unknown as TypeOptions;
  const [itemType, setItemType] = useState<any>(initType);
  const { bookId } = useParams();
  const { showBoundary } = useErrorBoundary();
  const [changeItemValues] = useChangeItemValuesMutation();
  const [changeItemValue] = useChangeItemValueMutation();
  const { data } = useGetItemTypesQuery();
  const vls = blocks[currentColumnIndex].items.find((x: TypeItem) => x.id === id)!.values;
  // @ts-ignore
  const { values, handleChange } = useFormWithValidation(
    vls.reduce((a: { [x: number]: number; }, x: TypeValue, i: number) => ({ ...a, [`label${i}`]: x.value }), {}),
  );
  const items = data?.map(({ _id, name }) => ({ value: _id, label: name }));

  const changeValue = async () => {
    const newValues: TypeValue[] = blocks[currentColumnIndex]
      .items.find((x: TypeItem) => x.id === id)!
      .values.map((x: TypeValue, i: number) => ({ ...x, value: values[`label${i}`] }));

    try {
      await changeItemValues({
        index: currentColumnIndex, id, values: newValues, bookId,
      });
    } catch (error) {
      showBoundary(error);
    }

    try {
      // @ts-ignore
      if (initType?.value !== itemType?.value) {
        changeItemValue({ itemId: id, itemType: itemType.value, bookId });
      }
    } catch (error) {
      showBoundary(error);
    }

    const arr = blocks[currentColumnIndex].items
      .map((x: TypeItem) => (x.id === id
        ? {
          ...x,
          values: x.values.map((v: TypeValue, i: number) => (v.value !== values[`label${i}`]
            ? { ...v, value: values[`label${i}`] }
            : v)),
        }
        : x));

    if (arr.length) {
      const obj: TypeBlock = {
        ...blocks,
        [currentColumnIndex]: { ...blocks[currentColumnIndex], items: arr },
      };
      dispatch(setHistory({ user: 'user', state: obj }));
    }
    dispatch(setItemPopup({ index: null, id: null, isOpen: false }));
  };
  console.log(itemType, initType);

  return (
    <div>
      <form className={style.form}>
        <div className={style.title}>
          <CustomSelect
            options={items}
            onChange={(pr: OptionsOrGroups<string, GroupBase<string>>) => setItemType(pr)}
            value={itemType!}
          />
        </div>
        <div className={style.inputs}>
          {blocks[currentColumnIndex].items.find((x: TypeItem) => x.id === id)!.values
            .map((x: TypeValue, i: number) => (
              <div className={style.inputfield} key={x.name}>
                <span className={style.label}>{x.name}</span>
                <input
                  type="text"
                  name={`label${i}`}
                  value={values[`label${i}`]}
                  onChange={handleChange}
                  className={style.input}
                />
                <span className={style.error} />
              </div>
            ))}
        </div>
        <Button handler={changeValue} title="Save" />
      </form>
    </div>
  );
}
