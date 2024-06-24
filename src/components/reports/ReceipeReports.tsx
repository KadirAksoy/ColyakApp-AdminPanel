import React, { useEffect, useState } from "react";
import { useTokenReset } from "../../services/loginHandleToToken";
import { API } from "../../services/apiUrls";
import { Table } from "antd";
import { BarcodeItem } from "../../utils/types";

function ReceipeReports() {
  const api = useTokenReset();
  const [receipeData, setReceipeData] = useState<BarcodeItem[]>([]);

  const getBarcodeList = async () => {
    try {
      const response = await api.get(API.REPORT.GET_RECEIPT);
      const data = Object.entries(response.data).map(
        ([foodItem, quantity]) => ({ foodItem, quantity })
      ) as BarcodeItem[];
      setReceipeData(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBarcodeList();
  }, []);

  const columns = [
    {
      title: "Yemek Adı",
      dataIndex: "foodItem",
      key: "foodItem",
    },
    {
      title: "Kullanılma Miktarı",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <div>
      <h1>Tariflerin Raporu</h1>
      <Table columns={columns} dataSource={receipeData} />
    </div>
  );
}

export default ReceipeReports;
