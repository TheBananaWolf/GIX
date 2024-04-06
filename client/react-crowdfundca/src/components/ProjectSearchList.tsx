import * as React from 'react';
import AppFooter from './views/AppFooter';
import AppAppBar from './views/AppAppBar';
import withRoot from './withRoot';
import ProjectSearchFeatures from './views/ProjectSearchFeatures';

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <ProjectSearchFeatures />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
