import * as React from 'react';
import AppFooter from './views/AppFooter';
import AppAppBar from './views/AppAppBar';
import withRoot from './withRoot';
import ProjectInfo from './views/ProjectInfo';
import ProjectDescription from './views/ProjectDescription';

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      <ProjectInfo />
      <ProjectDescription />
      <AppFooter />
    </React.Fragment>
  );
}

export default withRoot(Index);
