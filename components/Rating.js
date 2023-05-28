import { StarIcon as EmptyStarIcon } from '@heroicons/react/outline';
import {  StarIcon } from '@heroicons/react/solid';
import React from 'react';

export default function Rating({ rating }) {
  return (
    <div className="flex items-center  text-amber-300">
      {rating >= 0.5 ? (
        <StarIcon className="h-5 w-5" />
      ) : (
        <EmptyStarIcon className="h-5 w-5" />
      )}
      {rating >= 1.5 ? (
        <StarIcon className="h-5 w-5" />
      ) : (
        <EmptyStarIcon className="h-5 w-5" />
      )}
      {rating >= 2.5 ? (
        <StarIcon className="h-5 w-5" />
      ) : (
        <EmptyStarIcon className="h-5 w-5" />
      )}
      {rating >= 3.5 ? (
        <StarIcon className="h-5 w-5" />
      ) : (
        <EmptyStarIcon className="h-5 w-5" />
      )}
      {rating >= 4.5 ? (
        <StarIcon className="h-5 w-5" />
      ) : (
        <EmptyStarIcon className="h-5 w-5" />
      )}{' '}
     
    </div>
  );
}