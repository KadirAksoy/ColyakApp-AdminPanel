import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  DatePicker,
  List,
  Select,
  Typography,
  Modal,
  Descriptions,
  Row,
  Col,
} from "antd";
import moment from "moment";
import { useTokenReset } from "../../services/loginHandleToToken";
import { API } from "../../services/apiUrls";
import { BolusReport, Report, foodResponseList } from "../../utils/types";

const { RangePicker } = DatePicker;
const { Title } = Typography;

const UsersReports = () => {
  const api = useTokenReset();
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined
  );
  const [selectedDate, setSelectedDate] = useState<string | undefined>(
    undefined
  );
  const [userReports, setUserReports] = useState<BolusReport[]>([]);
  const [receiptReports, setReceiptReports] = useState<Report>({});
  const [readyFoodReports, setReadyFoodReports] = useState<Report>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedReport, setSelectedReport] = useState<BolusReport | null>(
    null
  );

  const fetchAllUsers = async () => {
    try {
      const response = await api.get(API.USERS.GET_ALL);
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const receiptCounting = async () => {
    try {
      const response = await api.get(API.REPORT.GET_RECEIPT);
      console.log(response.data);
      setReceiptReports(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const readyFoodCounting = async () => {
    try {
      const response = await api.get(API.REPORT.GET_READYFOOD);
      console.log(response.data);
      setReadyFoodReports(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWithEmailAndDate = async () => {
    try {
      const response = await api.get(
        API.REPORT.GET_EMAIL_DATE + selectedUser + "/" + selectedDate
      );
      console.log(response.data);
      setUserReports(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    receiptCounting();
    readyFoodCounting();
    fetchAllUsers();
  }, []);

  const handleUserReport = () => {
    fetchWithEmailAndDate();
  };

  const handleSelectChange = (value: string) => {
    setSelectedUser(value);
    console.log(selectedUser);
  };

  const handleDateChange = (_dates: any, dateStrings: [string, string]) => {
    setSelectedDate(dateStrings[0] + "/" + dateStrings[1]);
    console.log(selectedDate);
  };

  const handleDetailsClick = (report: BolusReport) => {
    setSelectedReport(report);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedReport(null);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={3}>Kullanıcı Raporları</Title>
      <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
        <Col>
          <Select
            style={{ width: 200 }}
            placeholder="Kullanıcı Seçiniz"
            onChange={handleSelectChange}
          >
            {users.map((user, index) => (
              <Select.Option key={index} value={user?.email}>
                {user?.email}
              </Select.Option>
            ))}
          </Select>
        </Col>
        <Col>
          <RangePicker onChange={handleDateChange} />
        </Col>
        <Col>
          <Button type="primary" onClick={handleUserReport}>
            Raporu Getir
          </Button>
        </Col>
      </Row>

      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={userReports}
        renderItem={(report) => (
          <List.Item>
            <Card title={"Bolust Raporları"}>
              <Descriptions bordered column={1} size="small">
                <Descriptions.Item label="Kan Şekeri">
                  {report.bolus.bloodSugar}
                </Descriptions.Item>
                <Descriptions.Item label="Hedef Kan Şekeri">
                  {report.bolus.targetBloodSugar}
                </Descriptions.Item>
                <Descriptions.Item label="İnsülin Tolerans Faktörü">
                  {report.bolus.insulinTolerateFactor}
                </Descriptions.Item>
                <Descriptions.Item label="Toplam Karbonhidrat">
                  {report.bolus.totalCarbonhydrate}
                </Descriptions.Item>
                <Descriptions.Item label="İnsülin Karbonhidrat Oranı">
                  {report.bolus.insulinCarbonhydrateRatio}
                </Descriptions.Item>
                <Descriptions.Item label="Bolus Değeri">
                  {report.bolus.bolusValue}
                </Descriptions.Item>
                <Descriptions.Item label="Yeme Zamanı">
                  {moment(report.bolus.eatingTime).format("DD-MM-YYYY HH:mm")}
                </Descriptions.Item>
              </Descriptions>
              <Button type="primary" onClick={() => handleDetailsClick(report)}>
                Detaylar
              </Button>
            </Card>
          </List.Item>
        )}
      />

      <Modal
        title="Food Response List"
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Kapat
          </Button>,
        ]}
      >
        {selectedReport && (
          <List
            dataSource={selectedReport.foodResponseList}
            renderItem={(item: foodResponseList) => (
              <List.Item>
                <Card title={item.foodName} size="small">
                  <Descriptions bordered column={1} size="small">
                    <Descriptions.Item label="Yemek Türü">
                      {item.foodType}
                    </Descriptions.Item>
                    <Descriptions.Item label="Karbonhidrat">
                      {item.carbonhydrate}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </List.Item>
            )}
          />
        )}
      </Modal>
    </div>
  );
};

export default UsersReports;
