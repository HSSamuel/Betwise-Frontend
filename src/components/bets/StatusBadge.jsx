import React from 'react';
import { capitalize } from '../../utils/helpers';

const StatusBadge = ({ status }) => {
  const badgeStyles = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    won: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    lost: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
  };

  return (
    <span
      className={`px-3 py-1 text-xs font-semibold rounded-full ${
        badgeStyles[status] || badgeStyles.cancelled
      }`}
    >
      {capitalize(status)}
    </span>
  );
};

export default StatusBadge;