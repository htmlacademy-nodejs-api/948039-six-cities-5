import { Types } from 'mongoose';

export const findByUserId = (userId: Types.ObjectId) => ({
  $match: {
    $expr: {
      $eq: [userId, '$userId']
    }
  }
});

export const lookupOffer = {
  $lookup: {
    from: 'offers',
    let: { offerId: '$offerId'},
    pipeline: [
      { $match:
        { $expr:
          { $eq: [ '$_id', '$$offerId' ] },
        }
      },
    ],
    as: 'offer'
  },
};

export const unwindOffer = { $unwind: '$offer' };

export const lookupComments = {
  $lookup: {
    from: 'comments',
    let: { offerId: '$offerId'},
    pipeline: [
      { $match:
        { $expr:
          { $eq: [ '$offerId', '$$offerId' ] }
        }
      }
    ],
    as: 'comments'
  }
};

export const addIsFavorite = {
  $addFields:
  {
    ['offer.isFavorite']: true,
  }
};

export const addRate = {
  $addFields:
  {
    ['offer.rate']: {$cond: [
      {
        $ne: [{
          $size: '$comments'
        },
        0]
      },
      { $divide: [
        { $reduce: {
          input: '$comments',
          initialValue: 0,
          in: {$add: ['$$value', '$$this.rate'],}
        } },
        { $size: '$comments' }
      ] },
      0
    ]},
  }
};
