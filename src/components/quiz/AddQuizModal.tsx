import React, { useState } from "react";
import { Modal, Button, Form, Input, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { Quiz, QuestionList } from "../../utils/types";
import { useTokenReset } from "../../services/loginHandleToToken";
import { API } from "../../services/apiUrls";
import { isAbsolute } from "path";

interface AddQuizModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (quiz: Quiz) => void;
}

const AddQuizModal: React.FC<AddQuizModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [questions, setQuestions] = useState<QuestionList[]>([]);
  const api = useTokenReset();

  const addQuestion = () => {
    const newQuestion: QuestionList = {
      id: 0,
      question: "",
      choicesList: Array.from({ length: 4 }, (_, i) => ({
        id: 0,
        choice: "",
        imageId: null,
      })),
      correctAnswer: "",
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (
    questionIndex: number,
    choiceIndex: number,
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].choicesList[choiceIndex].choice = value;
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    const newQuiz: Quiz = {
      id: 0,
      topicName: form.getFieldValue("topicName"),
      questionList: questions,
    };
    onSubmit(newQuiz);
    form.resetFields();
    setQuestions([]);
  };

  const handleCorrectAnswerChange = (questionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const handleImageUpload = async (
    questionIndex: number,
    choiceIndex: number,
    file: File
  ) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await api.post(`${API.IMAGES.POST}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);

      const imageId = response.data;
      console.log(imageId);
      const newQuestions = [...questions];
      newQuestions[questionIndex].choicesList[choiceIndex].imageId = imageId;
      setQuestions(newQuestions);

      message.success("Resim başarıyla yüklendi!");
    } catch (error) {
      message.error("Resim yüklenirken hata oluştu!");
    }
  };

  const getImageUrl = (imageId: number) => {
    return `${API.BASE_URL}${API.IMAGES.GET}${imageId}`;
  };

  return (
    <Modal
      visible={visible}
      title="Yeni Quiz Ekle"
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Vazgeç
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Kaydet
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="topicName"
          label="Quiz Başlığı"
          rules={[{ required: true, message: "Lütfen quiz başlığını girin" }]}
        >
          <Input />
        </Form.Item>
        {questions.map((question, questionIndex) => (
          <div key={questionIndex}>
            <Form.Item
              label={`Soru ${questionIndex + 1}`}
              rules={[{ required: true, message: "Lütfen soruyu girin" }]}
            >
              <Input
                value={question.question}
                onChange={(e) =>
                  setQuestions(
                    questions.map((q, i) =>
                      i === questionIndex
                        ? { ...q, question: e.target.value }
                        : q
                    )
                  )
                }
              />
            </Form.Item>
            {question.choicesList.map((choice, choiceIndex) => (
              <div key={choiceIndex}>
                <Form.Item
                  label={`Şık ${String.fromCharCode(65 + choiceIndex)}`}
                  rules={[{ required: true, message: "Lütfen şıkkı girin" }]}
                >
                  <Input
                    value={choice.choice}
                    onChange={(e) =>
                      handleChoiceChange(
                        questionIndex,
                        choiceIndex,
                        e.target.value
                      )
                    }
                  />
                </Form.Item>
                <Upload
                  beforeUpload={(file) => {
                    handleImageUpload(questionIndex, choiceIndex, file);
                    return false;
                  }}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Resim Yükle</Button>
                </Upload>
                {choice.imageId && (
                  <img
                    src={getImageUrl(choice.imageId)}
                    alt="Şık Resmi"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </div>
            ))}
            <Form.Item
              label="Doğru Cevap"
              rules={[{ required: true, message: "Lütfen doğru cevabı girin" }]}
            >
              <Input
                value={question.correctAnswer}
                onChange={(e) =>
                  handleCorrectAnswerChange(questionIndex, e.target.value)
                }
              />
            </Form.Item>
            <Button
              onClick={() => removeQuestion(questionIndex)}
              style={{ marginBottom: "20px" }}
            >
              Soruyu Kaldır
            </Button>
          </div>
        ))}
        <Button type="dashed" onClick={addQuestion} style={{ width: "100%" }}>
          Soru Ekle
        </Button>
      </Form>
    </Modal>
  );
};

export default AddQuizModal;
