import React from 'react';

import PointingItem from './pointingItem';

const PointingList = ({
  authUser,
                        trackings,
                        onEditPointing,
  onRemoveMessage,
}) => {
  return  (
    <ul>
      {trackings.map(track => (
        <PointingItem
          authUser={authUser}
          key={track.uid}
          tracking={track}
          onEditPointing={onEditPointing}
          onRemoveMessage={onRemoveMessage}
        />
      ))}
    </ul>
  );
}


export default PointingList;
