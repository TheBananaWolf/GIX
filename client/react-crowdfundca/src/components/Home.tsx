import * as React from 'react';
import ProductCategories from './views/ProductCategories';
import ProductCategoriesForHots from './views/ProductCategoriesForHots';
import ProductSmokingHero from './views/ProductSmokingHero';
import AppFooter from './views/AppFooter';
import ProductHero from './views/ProductHero';
import NewProductHero from './views/NewProductHero';
import ProductValues from './views/ProductValues';
import ProductTopics from './views/ProductTopics';
import ProjectInfo from './views/ProjectInfo';
import ProductHowItWorks from './views/ProductHowItWorks';
import ProductCTA from './views/ProductCTA';
import AppAppBar from './views/AppAppBar';
import withRoot from './withRoot';
import SiteMap from './views/SiteMap';

function Index() {
  return (
    <React.Fragment>
      <AppAppBar />
      {/* <ProjectInfo /> */}
      <ProductHero />
      {/* <NewProductHero /> */}
      {/* <ProductValues /> */}
      <ProductCategories />
      <ProductTopics />
      {/* <ProductSmokingHero /> */}
      <ProductCategoriesForHots />
      <ProductHowItWorks />
      {/* <ProductCTA /> */}
      {/* <ProductSmokingHero /> */}
      <SiteMap />
      <AppFooter />
    </React.Fragment>
  );
}


export default withRoot(Index);