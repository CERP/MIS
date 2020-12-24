import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import HomePage from './index' 
import FormativeTest from './FormativeTest/';
import DiagnosticTestResult from './DiagnosticResult';
import TrainingVideos from './TrainingVideos'
import LessonPlans from './LessonPlans';
import InsertGrades from './InsertGrades';
import PDF from './PDF'

const Routing = props => {
 
  const path = (props.location.pathname).substring(0,21)

  const redirect = event => {
    props.history.push(`${path}/${event.currentTarget.dataset.value}`);
  };
  console.log("path", path)
  return (
        <Switch>
            <Route exact path={path}>
            <HomePage onClick={redirect}/>
            </Route>
            <Route exact path={`${path}/formative-test/pdf`}>
            <PDF />
            </Route>
            <Route exact path={`${path}/formative-test/insert-grades`}>
            <InsertGrades />
            </Route>
            <Route exact path={`${path}/formative-test`}>
            <FormativeTest />
            </Route>
            <Route exact path={`${path}/diagnostic-result`}>
            <DiagnosticTestResult />
            </Route>
            <Route exact path={`${path}/lesson-plans`}>
            <LessonPlans />
            </Route>
            <Route exact path={`${path}/training-videos`}>
            <TrainingVideos />
            </Route>
        </Switch>
        )
};

export default withRouter(Routing);
