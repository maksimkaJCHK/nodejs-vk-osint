import React from 'react';
import UserItemRow from './UserItemRow.jsx';

const UserItemEducation = ({ user }) => {
  return (
    <div className = 'user-item-education'>
      <div className="user-item-head">
        Образование
      </div>

      { user.university_name && <UserItemRow>
        { user.university_name }
        { user.graduation && user.graduation !== 0 ? ` (${user.graduation})` : null }
      </UserItemRow> }
      { user.education_form && <UserItemRow> { user.education_form } </UserItemRow> }
      { user.education_status && <UserItemRow> { user.education_status } </UserItemRow> }
    </div>
  )
}

export default UserItemEducation;