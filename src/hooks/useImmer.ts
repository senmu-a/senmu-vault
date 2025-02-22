import { useCallback, useState } from 'react';
import { freeze, produce, Draft } from 'immer';

// const [person, updatePerson] = useImmer({
//     name: "Michel",
//     age: 33
//   });

//   function updateName(name) {
//     updatePerson(draft => {
//       draft.name = name;
//     });

//      {
//          name:12;
//         }

//     updatePerson({
//       name:12;
//     });
//   }

export type DraftFunction<T> = (draft: T) => void;
export type Updater<T> = (arg: T | DraftFunction<T>) => void;

export type ImmerHook<T> = [T, Updater<T>];

// 函数的签名
export function useImmer<T>(initialValue: Draft<T>): ImmerHook<T>;
export function useImmer<S>(initialValue: S) {
  const [val, updateValue] = useState(() => {
    return freeze(typeof initialValue === 'function' ? initialValue() : initialValue);
  });
  return [
    val,
    useCallback((updater: S | DraftFunction<S>) => {
      if (typeof updater === 'function') {
        updateValue(produce(updater as DraftFunction<S>));
      } else {
        updateValue(freeze(updater));
      }
    }, []),
  ];
}
