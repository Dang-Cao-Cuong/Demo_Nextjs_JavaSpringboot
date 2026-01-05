import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface UserInfoProps {
    username: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ username }) => {
    return (
        <div className="user-info">
            <p><FontAwesomeIcon icon={faUser} /> <b>{username}</b></p>
        </div>
    );
};

export default UserInfo;
