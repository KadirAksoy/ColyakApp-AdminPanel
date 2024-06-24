import { Menu, Layout } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import RecipeScreen from "./page/RecipePage";

import "./AppHeader.css";
import React from "react";
import UserPage from "./page/UserPage";
import SuggestionPage from "./page/SuggestionPage";
import PdfPage from "./page/PdfPage";
import BarcodePage from "./page/BarcodePage";
import ReportsPage from "./page/ReportsPage";
import CommentsPage from "./page/CommentsPage";
import QuizPage from "./page/QuizPage";

const AppHeader = () => {
  const { Header, Content } = Layout;

  return (
    <Layout>
      <Header className="app-header">
        <Menu
          mode="horizontal"
          className="app-menu"
          defaultSelectedKeys={["/tarifler"]}
          items={[
            {
              key: "/tarifler",
              label: <Link to={"/tarifler"}>Tarifler</Link>,
            },

            {
              key: "barkod",
              label: <Link to="/barkod">Barkod Ekle</Link>,
            },
            {
              key: "kullanıcılar",
              label: <Link to="/kullanıcılar">Kullanıcılar</Link>,
            },

            {
              key: "/raporlar",
              label: <Link to="/raporlar">Kullanıcı Raporlarını Gör</Link>,
            },
            {
              key: "/pdf",
              label: <Link to="/pdf">Pdf</Link>,
            },

            {
              key: "öneriler",
              label: <Link to="/öneriler">Öneriler</Link>,
            },
            {
              key: "/quizler",
              label: <Link to={"/quizler"}>Quizler</Link>,
            },
            {
              key: "/yorumlar",
              label: <Link to={"/yorumlar"}>Yorumlar</Link>,
            },
          ]}
        />
      </Header>

      <Content className="app-content">
        <Routes>
          <Route path="/tarifler" element={<RecipeScreen />} />
          <Route path="/kullanıcılar" element={<UserPage />} />
          <Route path="/öneriler" element={<SuggestionPage />} />
          <Route path="/pdf" element={<PdfPage />} />
          <Route path="/barkod" element={<BarcodePage />} />
          <Route path="/raporlar" element={<ReportsPage />} />
          <Route path="/yorumlar" element={<CommentsPage />} />
          <Route path="/quizler" element={<QuizPage />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default AppHeader;
