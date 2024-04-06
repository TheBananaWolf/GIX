import * as React from 'react';
import AppFooter from './views/AppFooter';
import AppAppBar from './views/AppAppBar';
import withRoot from './withRoot';
import ProjectFeatures from './views/ProjectFeatures';

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <ProjectFeatures />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
