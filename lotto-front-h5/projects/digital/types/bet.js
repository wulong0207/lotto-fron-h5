import PropTypes from 'prop-types';

const CONTENT_TYPES = [1, 2, 3, 6];

export const Bet = PropTypes.shape({
  balls: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(
      PropTypes.shape({
        ball: PropTypes.string,
        color: PropTypes.string
      })
    )
  ]),
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  betNum: PropTypes.number,
  lotteryChildCode: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  contentType: PropTypes.oneOf(
    CONTENT_TYPES.concat(CONTENT_TYPES.map(c => c.toString()))
  ),
  page: PropTypes.string,
  manual: PropTypes.bool
});
