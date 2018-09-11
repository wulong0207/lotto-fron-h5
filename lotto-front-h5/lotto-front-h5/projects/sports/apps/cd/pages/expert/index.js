import React from 'react';
import User from './user';
import page from '@/component/hoc/page';
import PropTypes from 'prop-types';
import Analytics from './analytics';

function Expert(props) {
  const { id } = props.params;
  return (
    <div>
      <User id={ parseInt(id) } attention={false}/>
      <Analytics id={ parseInt(id) } />
    </div>
  );
}

export default page('专家详情')(Expert);

Expert.propTypes = {
  params: PropTypes.shape({
    id: PropTypes.string.isRequired
  }),
  location: PropTypes.shape({
    query: PropTypes.object
  })
};
