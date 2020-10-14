/*
 *
 * HomePage
 *
 */

import React, { memo } from "react";
// import PropTypes from 'prop-types';
import pluginId from "../../pluginId";
// import i18n react component
import { FormattedMessage } from "react-intl";
const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
      <FormattedMessage id="location-input.notification.error.message" />
    </div>
  );
};

export default memo(HomePage);
