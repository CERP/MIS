import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import HomePage from './index' 
import FormativeTest from './FormativeTest/';
import DiagnosticTestResult from './DiagnosticResult';
import TrainingVideos from './TraningVideos'
import LessonPlans from './LessonPlans';

const Routing = props => {
 
  const path = (props.location.pathname).substring(0,21)
    const redirect = event => {
    props.history.push(`${path}/${event.currentTarget.dataset.value}`);
  };
  
  return (
        <Switch>
            <Route exact path={path}>
            <HomePage onClick={redirect}/>
            </Route>
            <Route path={`${path}/formative-test`}>
            <FormativeTest />
            </Route>
            <Route path={`${path}/diagnostic-result`}>
            <DiagnosticTestResult />
            </Route>
            <Route path={`${path}/lesson-plans`}>
            <LessonPlans />
            </Route>
            <Route path={`${path}/training-videos`}>
            <TrainingVideos />
            </Route>
        </Switch>
        )
};

export default withRouter(Routing);
