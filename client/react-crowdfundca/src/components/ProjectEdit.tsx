import * as React from 'react';
import AppFooter from './views/AppFooter';
import AppAppBar from './views/AppAppBar';
import withRoot from './withRoot';
import EditProjectInfo from './views/EditProjectInfo';

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <EditProjectInfo />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
