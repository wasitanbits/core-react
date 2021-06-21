import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import {Route, Switch, Redirect} from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Workspace, Header, Sidebar } from '../../components/index';
import DashboardStyles from '../../styles/dashboard';
import routes from '../../routes/routes';
import {useSelector} from "react-redux";
import {getters} from "../../redux/selectors/selectors";

function resizeDispatch () {
  if (typeof(Event) === 'function') {
    window.dispatchEvent(new Event('resize'));
  } else {
    const evt = window.document.createEvent('UIEvents');
    evt.initUIEvent('resize', true, false, window, 0);
    window.dispatchEvent(evt);
  }
}

const Dashboard =  (props) => {
  const { classes } = props;
  const {isAuthenticated} = useSelector(getters.getIsAuthenticated);
  const [opened, setOpened] = useState(true);

  console.log("------------start------------");
  console.log(isAuthenticated);
  console.log("----------end----------------");

  if(!isAuthenticated) {
      return <Redirect to={"/"} />
  }


  const handleDrawerToggle = () => {
    console.log("--------------Drawer Toggeled!!!")
    setOpened(!opened)
    resizeDispatch()
  };

    const getRoutes = (
        <Switch>
          { routes.items.map((item, index) => (
              item.type === 'external' ? <Route exact path={item.path} component={item.component} name={item.name} key={index} />:
                  item.type === 'submenu' ? item.children.map(subItem => <Route exact path={`${item.path}${subItem.path}`} component={subItem.component} name={subItem.name} />):
                      <Route exact path={item.path} component={item.component} name={item.name} key={index} />
          ))}
          <Redirect to="/404" />
        </Switch>
    )

    return (
        <Fragment>
          <Header
              logoAltText="Learning Squad"
              logo={`/static/images/LS.png`}
              toggleDrawer={handleDrawerToggle}
          />
          <div className={classNames(classes.panel, 'theme-dark')}>
            <Sidebar
                routes={routes.items}
                opened={opened}
                toggleDrawer={handleDrawerToggle}
            />
            <Workspace opened={opened}>
              {getRoutes}
            </Workspace>
          </div>
        </Fragment>
    )
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(DashboardStyles)(Dashboard);