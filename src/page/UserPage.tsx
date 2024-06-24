import React, { useEffect, useState } from "react";
import UserCard from "../components/user/UserCard";
import "../css/UserPage.css"; // CSS dosyasını içe aktar
import { User } from "../utils/types";

// API'den kullanıcıları çekme fonksiyonu
const fetchUsers = async (): Promise<User[]> => {
  const BASE_URL = "https://api.colyakdiyabet.com.tr/api";
  const response = await fetch(`${BASE_URL}/users/verify/ListAll`);
  const data: User[] = await response.json();
  return data;
};

// Kullanıcıyı silme fonksiyonu
const deleteUser = async (email: string): Promise<void> => {
  const BASE_URL = "https://api.colyakdiyabet.com.tr/api";
  await fetch(`${BASE_URL}/users/verify/deleteUser/${email}`, {
    method: "DELETE",
  });
};

// Kullanıcı rolünü değiştirme fonksiyonu
const changeUserRole = async (
  email: string,
  currentRole: string
): Promise<void> => {
  const BASE_URL = "https://api.colyakdiyabet.com.tr/api";
  const endpoint =
    currentRole === "User"
      ? `${BASE_URL}/users/verify/adminRole/${email}`
      : `${BASE_URL}/users/verify/removeAdmin/${email}`;
  await fetch(endpoint, {
    method: "POST",
  });
};

// Kullanıcıları listeleyen ana bileşen
const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [deleteEmail, setDeleteEmail] = useState<string | null>(null);
  const [roleChangeEmail, setRoleChangeEmail] = useState<string | null>(null);
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  useEffect(() => {
    const getUsers = async () => {
      const usersFromAPI = await fetchUsers();
      setUsers(usersFromAPI);
    };
    getUsers();
  }, []);

  const handleDeleteClick = (email: string) => {
    setDeleteEmail(email);
  };

  const handleConfirmDelete = async () => {
    if (deleteEmail) {
      await deleteUser(deleteEmail);
      setUsers(users.filter((user) => user.email !== deleteEmail));
      setDeleteEmail(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteEmail(null);
  };

  const handleRoleChangeClick = (email: string, currentRole: string) => {
    setRoleChangeEmail(email);
    setCurrentRole(currentRole);
  };

  const handleConfirmRoleChange = async () => {
    if (roleChangeEmail && currentRole) {
      await changeUserRole(roleChangeEmail, currentRole);
      const updatedUsers = users.map((user) =>
        user.email === roleChangeEmail
          ? { ...user, role: [currentRole === "User" ? "Admin" : "User"] }
          : user
      );
      setUsers(updatedUsers);
      setRoleChangeEmail(null);
      setCurrentRole(null);
    }
  };

  const handleCancelRoleChange = () => {
    setRoleChangeEmail(null);
    setCurrentRole(null);
  };

  return (
    <div className="user-list-container">
      <div className="user-list">
        {users.map((user) => (
          <UserCard
            key={user.userId}
            user={user}
            onDeleteClick={handleDeleteClick}
            onRoleChangeClick={handleRoleChangeClick}
          />
        ))}
      </div>
      {deleteEmail && (
        <div className="modal">
          <div className="modal-content" style={{ height: "150px" }}>
            <p>Kullanıcıyı silmek istediğinize emin misiniz ?</p>
            <button onClick={handleConfirmDelete}>Evet</button>
            <button onClick={handleCancelDelete}>Hayır</button>
          </div>
        </div>
      )}
      {roleChangeEmail && (
        <div className="modal">
          <div className="modal-content" style={{ height: "150px" }}>
            <p>
              {currentRole === "User"
                ? "Kullanıcıyı admin yapmak istediğinize emin misiniz ?"
                : "Admin kullanıcısını User yapmak istediğinize emin misiniz"}
              ?
            </p>
            <button onClick={handleConfirmRoleChange}>Evet</button>
            <button onClick={handleCancelRoleChange}>Hayır</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPage;
