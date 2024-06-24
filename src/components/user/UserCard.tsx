import React, { useState } from "react";
import { User } from "../../utils/types";

interface UserCardProps {
  user: User;
  onDeleteClick: (email: string) => void;
  onRoleChangeClick: (email: string, currentRole: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  onDeleteClick,
  onRoleChangeClick,
}) => {
  return (
    <div className="user-card">
      <div className="user-card-left">
        <h3>{user.userName}</h3>
        <p>{user.email}</p>
      </div>
      <p className="user-card-role">Role: {user.role.join(", ")}</p>
      <div className="user-card-buttons">
        <button onClick={() => onDeleteClick(user.email)}>Sil</button>
        <button onClick={() => onRoleChangeClick(user.email, user.role[0])}>
          Rol
        </button>
      </div>
    </div>
  );
};

export default UserCard;
