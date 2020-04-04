import React from 'react';

import PointingItem from './pointingItem';

const PointingList = ({
  authUser,
  messages,
  onEditMessage,
  onRemoveMessage,
}) => {
  console.log('----> msg in message list ', messages)
  return  (
    <ul>
      {messages.map(message => (
        <PointingItem
          authUser={authUser}
          key={message.uid}
          message={message}
          onEditMessage={onEditMessage}
          onRemoveMessage={onRemoveMessage}
        />
      ))}
    </ul>
  );
}


export default PointingList;
