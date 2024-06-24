import React, { useEffect, useState } from "react";
import { Button, Upload, Row, Select, Typography, message, Modal } from "antd";
import {
  PlusOutlined,
  UploadOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";
import { API } from "../services/apiUrls";
import { useTokenReset } from "../services/loginHandleToToken";
import "../css/PdfPage.css"; // Import your CSS file

const PdfPage = () => {
  const [selectedPdfId, setSelectedPdfId] = useState<number | null>(null);
  const [pdfList, setPdfList] = useState<any[]>([]);
  const [uploadData, setUploadData] = useState<any | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  useEffect(() => {
    getPdfById();
    if (uploadSuccess) {
      // Yükleme başarılı olduysa son yüklenen PDF'i göstermek için
      getPdfById(); // Pdf listesini yeniden getir
      // Yeni eklenen PDF'i seçmek için
      const lastIndex = pdfList.length - 1;
      setSelectedPdfId(pdfList[lastIndex].id); // Son eklenen PDF'i seç
    }
  }, [uploadSuccess]);

  const getPdfById = async () => {
    try {
      const response = await axios.get(
        `${API.BASE_URL}${API.IMAGES.GET_ALL_PDF}`
      );
      console.log(response.data);
      setPdfList(response.data);
      if (selectedPdfId === null && response.data.length > 0) {
        const defaultPdfId = response.data[0].id;
        setSelectedPdfId(defaultPdfId);
        return defaultPdfId; // Yeni eklenen PDF'in id'sini döndür
      }
    } catch (error) {
      console.error(error);
    }
  };

  const PDFViewer = () => {
    if (selectedPdfId === null) return <div />;
    return (
      <div>
        <iframe
          src={`${API.BASE_URL}${API.IMAGES.GET}${selectedPdfId}`}
          width="100%"
          height="500px"
        />
      </div>
    );
  };

  const uploadPdf = (file: any) => {
    axios
      .post(`${API.BASE_URL}${API.IMAGES.POST}`, file)
      .then((response) => {
        console.log(response.data);
        getPdfById().then((newPdfId) => {
          setUploadSuccess(true); // Set upload success state to true
          message.success("PDF başarıyla yüklendi");
          setTimeout(() => {
            setUploadSuccess(false); // Reset upload success state after delay
          }, 1000); // Reset after 3 seconds (adjust as needed)
          setSelectedPdfId(newPdfId); // Yeni eklenen PDF'i seç
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBeforeUpload = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    setUploadData(formData);
    return false;
  };

  const handleDeletePdf = async () => {
    if (selectedPdfId !== null) {
      try {
        await axios.delete(`${API.BASE_URL}/image/delete/${selectedPdfId}`);
        message.success("PDF başarıyla silindi");
        setSelectedPdfId(null); // Seçili PDF'yi kaldır
        getPdfById().then(() => {
          if (pdfList.length > 0) {
            setSelectedPdfId(pdfList[0].id); // İlk PDF'i seç
          }
        });
      } catch (error) {
        console.error(error);
        message.error("PDF silinirken bir hata oluştu");
      }
    }
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "PDF Sil",
      content: "Bu PDF dosyasını silmek istediğinize emin misiniz?",
      okText: "Evet",
      okType: "danger",
      cancelText: "Hayır",
      onOk: handleDeletePdf,
    });
  };

  return (
    <div className="pdf-container">
      <Typography.Title style={{ textAlign: "center" }}>
        Pdf İşlemleri
      </Typography.Title>

      <Row className="pdf-row" style={{ marginBottom: "25px" }}>
        <div className="pdf-upload">
          <Upload
            style={{ marginBottom: "25px" }}
            accept={".pdf"}
            maxCount={1}
            name="file"
            beforeUpload={handleBeforeUpload}
            showUploadList={true} // Set to true to show the upload list
          >
            <Button
              style={{ marginRight: 10, marginBottom: "5px" }}
              icon={<UploadOutlined />}
            >
              Pdf Yüklemek için tıklayın
            </Button>
          </Upload>
          <Button
            style={{ marginRight: 10, marginTop: 20 }}
            icon={<PlusOutlined />}
            onClick={() => uploadPdf(uploadData)}
          >
            Yükle
          </Button>
          <Button
            style={{ marginRight: 10 }}
            icon={<DeleteOutlined />}
            danger
            onClick={confirmDelete}
            disabled={selectedPdfId === null}
          >
            Sil
          </Button>
        </div>
        <Select
          value={selectedPdfId}
          className="pdf-select"
          onChange={(value) => setSelectedPdfId(value)}
          options={pdfList.map((pdf) => {
            return { label: pdf.name, value: pdf.id };
          })}
        />
      </Row>
      {selectedPdfId && (
        <div className="pdf-preview">
          <PDFViewer />
        </div>
      )}
    </div>
  );
};

export default PdfPage;
