import React from "react";

interface UserInfoProps {
    username: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ username }) => {
    return (
        <div className="user-info">
            <p>Tài khoản: <b>{username}</b></p>
        </div>
    );
};

export default UserInfo;
