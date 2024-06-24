import React, { useEffect, useState } from "react";
import { API } from "../services/apiUrls";
import { useTokenReset } from "../services/loginHandleToToken";
import { Quiz, QuestionList, ChoicesList } from "../utils/types";
import { Modal, Button, Select, message, Row } from "antd";
import "../css/QuizPage.css";
import AddQuizModal from "../components/quiz/AddQuizModal";
import UpdateQuizModal from "../components/quiz/UpdateQuizModal"; // Import the UpdateQuizModal

const { Option } = Select;

const QuizPage: React.FC = () => {
  const api = useTokenReset();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false); // State for Update modal
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const getAllQuiz = async () => {
    try {
      const response = await api.get(API.QUIZ.GET_ALL);
      setQuizzes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllQuiz();
  }, []);

  const handleQuizChange = (value: string) => {
    const quizId = parseInt(value);
    const quiz = quizzes.find((quiz) => quiz.id === quizId) || null;
    setSelectedQuiz(quiz);
  };

  const handleAddQuiz = async (newQuiz: Quiz) => {
    try {
      console.log("yeni quiz", newQuiz);
      const response = await api.post(API.QUIZ.POST, newQuiz);
      console.log(response);
      console.log(response.data);
      setQuizzes([...quizzes, response.data]);
      setIsModalVisible(false);
      console.log("Quiz başarıyla eklendi:", response.data);
    } catch (error) {
      console.error("Quiz eklerken hata oluştu:", error);
    }
  };

  const handleUpdateQuiz = async (updatedQuiz: Quiz) => {
    try {
      console.log("güncellenen quiz", updatedQuiz);
      const response = await api.put(
        `${API.QUIZ.PUT}${updatedQuiz.id}`,
        updatedQuiz
      );
      console.log(response);
      console.log(response.data);
      const updatedQuizzes = quizzes.map((quiz) =>
        quiz.id === updatedQuiz.id ? response.data : quiz
      );
      setQuizzes(updatedQuizzes);
      setSelectedQuiz(response.data);
      setIsUpdateModalVisible(false);
      console.log("Quiz başarıyla güncellendi:", response.data);
    } catch (error) {
      console.error("Quiz güncellenirken hata oluştu:", error);
    }
  };

  const handleDeleteQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      await api.delete(`${API.QUIZ.DELETE}${selectedQuiz.id}`);
      setQuizzes(quizzes.filter((quiz) => quiz.id !== selectedQuiz.id));
      setSelectedQuiz(null);
      setIsDeleteModalVisible(false);
      message.success("Quiz başarıyla silindi");
    } catch (error) {
      console.error("Quiz silinirken hata oluştu:", error);
      message.error("Quiz silinirken hata oluştu");
    }
  };

  return (
    <div className="quiz-page">
      <h1 className="quiz-page__title">Quiz Sayfası</h1>
      <Row style={{ marginBottom: "10px" }}>
        <Button
          type="primary"
          className="quiz-page__update-button"
          onClick={() => setIsModalVisible(true)}
          style={{
            width: "120px",
          }}
        >
          Quiz Ekle
        </Button>
        <Button
          type="primary"
          className="quiz-page__update-button"
          onClick={() => setIsUpdateModalVisible(true)}
          style={{
            width: "120px",
            marginLeft: "10px",
          }}
          disabled={!selectedQuiz}
        >
          Quiz Güncelle
        </Button>
      </Row>

      <div className="quiz-page__selector">
        <label htmlFor="quizSelect">Quiz seçin: </label>
        <Select
          id="quizSelect"
          onChange={handleQuizChange}
          style={{ width: 200 }}
        >
          <Option value="">-- Quiz seçin --</Option>
          {quizzes.map((quiz) => (
            <Option key={quiz.id} value={quiz.id.toString()}>
              {quiz.topicName}
            </Option>
          ))}
        </Select>
      </div>
      {selectedQuiz && (
        <div className="quiz-page__details">
          <h2 className="quiz-page__quiz-title">{selectedQuiz.topicName}</h2>
          <Button
            className="quiz-page__delete-button"
            onClick={() => setIsDeleteModalVisible(true)}
          >
            Quiz Sil
          </Button>
          <div style={{ height: "10px" }}></div>
          {selectedQuiz.questionList.map((question) => (
            <div key={question.id} className="quiz-page__question">
              <h3 className="quiz-page__question-title">{question.question}</h3>
              <ul className="quiz-page__choices">
                {question.choicesList.map((choice) => (
                  <li key={choice.id} className="quiz-page__choice">
                    {choice.choice}
                    {choice.imageId && (
                      <img
                        src={`${API.BASE_URL}${API.IMAGES.GET}${choice.imageId}`}
                        alt={`Choice ${choice.id}`}
                        className="quiz-page__choice-image"
                      />
                    )}
                  </li>
                ))}
              </ul>
              <p className="quiz-page__correct-answer">
                Doğru cevap: {question.correctAnswer}
              </p>
            </div>
          ))}
        </div>
      )}
      <AddQuizModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        onSubmit={handleAddQuiz}
      />
      <UpdateQuizModal
        visible={isUpdateModalVisible}
        onClose={() => setIsUpdateModalVisible(false)}
        quiz={selectedQuiz} // Pass the selected quiz to the update modal
        onSubmit={handleUpdateQuiz}
      />
      <Modal
        title="Quizi Sil"
        visible={isDeleteModalVisible}
        onCancel={() => setIsDeleteModalVisible(false)}
        footer={[
          <Row style={{ justifyContent: "space-between" }}>
            <Button key="cancel" onClick={() => setIsDeleteModalVisible(false)}>
              Hayır
            </Button>
            ,
            <Button
              key="confirm"
              type="primary"
              danger
              onClick={handleDeleteQuiz}
              style={{ width: "70px" }}
            >
              Evet
            </Button>
          </Row>,
        ]}
      >
        <p>Bu quizi silmek istediğinize emin misiniz?</p>
      </Modal>
    </div>
  );
};

export default QuizPage;
