import React, { useState } from "react";
import "../css/ReportsPage.css";
import ReceipeReports from "../components/reports/ReceipeReports";
import BarcodeReports from "../components/reports/BarcodeReports";
import UsersReports from "../components/reports/UsersReports";
import TopFiveReceipe from "../components/reports/TopFiveReceipe";
import QuizResults from "../components/reports/QuizResults";

const ReportsPage: React.FC = () => {
  const [activeMenu, setActiveMenu] = useState<string>("");

  const handleMenuClick = (menuName: string) => {
    setActiveMenu(menuName);
  };

  return (
    <div className="container" style={{ minHeight: "100vh" }}>
      <h1>Raporlar Sayfası</h1>
      <div className="menu-buttons">
        <button onClick={() => handleMenuClick("Kullanıcı Raporları")}>
          Kullanıcı Raporları
        </button>
        <button onClick={() => handleMenuClick("Tarif Raporları")}>
          Tarif Raporları
        </button>
        <button onClick={() => handleMenuClick("Hazır Yemek Raporları")}>
          Hazır Yemek Raporları
        </button>

        <button onClick={() => handleMenuClick("En çok kullanılan tarifler")}>
          En çok kullanılan tarifler
        </button>
      </div>
      {activeMenu === "Kullanıcı Raporları" && (
        <div>
          <UsersReports />
        </div>
      )}
      <div className="report-content">
        {activeMenu === "Tarif Raporları" && (
          <div>
            <ReceipeReports />
          </div>
        )}
        {activeMenu === "Hazır Yemek Raporları" && (
          <div>
            <BarcodeReports />
          </div>
        )}

        {activeMenu === "En çok kullanılan tarifler" && (
          <div className="top-five-receipe">
            <TopFiveReceipe />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
