import React, { useState } from 'react';
import UserItemRow from './UserItemRow.jsx';

const UserItemEducation = ({ user }) => {
  const [ isEducation, cEducation ] = useState(false);
  const changeEducation = () => cEducation((e) => !e);

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

      { isEducation && user.universities && user.universities.length && user.universities.map((item) => {
        return (
          <>
            { item.name && <div>{ item.name }</div> }
            { item.chair_name && <div>{ item.chair_name }</div> }
            { item.education_form && <div>{ item.education_form }</div> }
            { item.faculty_name && <div>{ item.faculty_name }</div> }
            { item.education_status && <div>{ item.education_status }</div> }
            { item.graduation && <div>{ item.graduation }</div> }
          </>
        )
      }) }

      <span onClick = { changeEducation }>
        { isEducation ? 'Скрыть' : 'Показать' }
      </span>
    </div>
  )
}

export default UserItemEducation;