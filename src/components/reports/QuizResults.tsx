import React, { useEffect, useState } from "react";
import { API } from "../../services/apiUrls";
import { useTokenReset } from "../../services/loginHandleToToken";
import { QuizResult, Quiz, User } from "../../utils/types";
import "../../css/QuizResults.css"; // CSS dosyasını içe aktarın
const QuizResults: React.FC = () => {
  const api = useTokenReset();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);

  const getAllQuiz = async () => {
    try {
      const response = await api.get(API.QUIZ.GET_ALL);
      setQuizzes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get(API.USERS.GET_ALL);
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getQuizAnswers = async (quizId: number) => {
    try {
      const response = await api.get(
        API.REPORT.GET_QUIZ_ANSWERS + quizId.toString()
      );
      setQuizResults(response.data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAllQuiz();
    fetchUsers();
  }, []);

  useEffect(() => {
    if (selectedQuiz) {
      getQuizAnswers(selectedQuiz.id);
    }
  }, [selectedQuiz]);

  const handleQuizChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const quizId = parseInt(event.target.value);
    const quiz = quizzes.find((quiz) => quiz.id === quizId) || null;
    setSelectedQuiz(quiz);
  };

  const handleUserChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const userId = parseInt(event.target.value);
    const user =
      users.find((user) => user.userId === userId.toString()) || null;
    setSelectedUser(user);
  };

  return (
    <div className="quiz-results-container">
      <div className="select-box-container">
        <label htmlFor="quizSelect">Quiz seçin: </label>
        <select id="quizSelect" onChange={handleQuizChange}>
          <option value="">-- Quiz seçin --</option>
          {quizzes.map((quiz) => (
            <option key={quiz.id} value={quiz.id}>
              {quiz.topicName}
            </option>
          ))}
        </select>
      </div>
      <div className="select-box-container">
        <label htmlFor="userSelect">Kullanıcı seçin: </label>
        <select id="userSelect" onChange={handleUserChange}>
          <option value="">-- Kullanıcı seçin --</option>
          {users.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.userName}
            </option>
          ))}
        </select>
      </div>
      <div className="quiz-results">
        {quizResults.map((result) => (
          <div key={result.questionId} className="quiz-result">
            <h3 className="quiz-result__question">{result.questionText}</h3>
            <p className="quiz-result__user">Kullanıcı: {result.userName}</p>
            <p className="quiz-result__chosen-answer">
              Seçilen Yanıt: {result.chosenAnswer}
            </p>
            <p className="quiz-result__correct-answer">
              Doğru Yanıt: {result.correctAnswer}
            </p>
            <p
              className={`quiz-result__correct ${
                result.correct ? "correct" : "incorrect"
              }`}
            >
              {result.correct ? "Doğru" : "Yanlış"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuizResults;
