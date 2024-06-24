import React, { useEffect, useState } from "react";
import { useTokenReset } from "../../services/loginHandleToToken";
import { API } from "../../services/apiUrls";
import { Table } from "antd";
import { BarcodeItem } from "../../utils/types";

function BarcodeReports() {
  const api = useTokenReset();
  const [barcodeData, setBarcodeData] = useState<BarcodeItem[]>([]);

  const getBarcodeList = async () => {
    try {
      const response = await api.get(API.REPORT.GET_READYFOOD);
      const data = Object.entries(response.data).map(
        ([foodItem, quantity]) => ({ foodItem, quantity })
      ) as BarcodeItem[];
      setBarcodeData(data);
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
      <h1>Barkod Yemekleri Raporu</h1>
      <Table columns={columns} dataSource={barcodeData} />
    </div>
  );
}

export default BarcodeReports;
