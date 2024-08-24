import { useEffect, useState } from "react";

export const TableActiveHook = ({ objData }: any) => {
  const [datas, setDatas] = useState<any>([]);
  const [action, setActions] = useState(false);

  const updateRowState = (id: number) => {
    setDatas((prevProperties: any[]) => {
      return prevProperties.map((property) => {
        if (property.id === id) {
          let active = property.active ? false : true;
          setActions(active);
          return { ...property, active: active };
        } else {
          return { ...property, active: false };
        }
      });
    });
  };

  useEffect(() => {
    setDatas(objData);
  }, [objData]);

  return {
    datas,
    action,
    updateRowState,
  };
};
