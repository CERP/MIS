import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import HomePage from './index' 
import FormativeTest from './FormativeTest/';
import DiagnosticTestResult from './DiagnosticResult';
import TrainingVideos from './TrainingVideos'
import LessonPlans from './LessonPlans';
import InsertGrades from './FormativeTest/InsertGrades';
import PDF from './PDF'
import Grading from './FormativeTest/Grading';
import TestResult from './FormativeTest/TestResult';
import Result from './FormativeTest/Result';
import RemedialGroup from './DiagnosticResult/RemedialGroup';
import ListView from './DiagnosticResult/ListView'

const Routing = props => {
  const path = (props.location.pathname).substring(0,21)

  return (
        <Switch>
            <Route exact path={path}>
            <HomePage />
            </Route>
            <Route exact path={`${path}/formative-test/:class_name/:subject/pdf`}>
            <PDF />
            </Route>
            <Route exact path={`${path}/formative-test/:class_name/:subject/insert-grades/grading/test-result/result`}>
            <Result />
            </Route>
            <Route exact path={`${path}/formative-test/:class_name/:subject/insert-grades/grading/test-result`}>
            <TestResult />
            </Route>
            <Route exact path={`${path}/formative-test/:class_name/:subject/insert-grades/grading`}>
            <Grading />
            </Route>
            <Route exact path={`${path}/formative-test/:class_name/:subject/insert-grades`}>
            <InsertGrades />
            </Route>
            <Route exact path={`${path}/formative-test`}>
            <FormativeTest />
            </Route>
            <Route exact path={`${path}/diagnostic-result/remedial-group/list-view`}>
            <ListView />
            </Route>
            <Route exact path={`${path}/diagnostic-result/remedial-group`}>
            <RemedialGroup />
            </Route>
            <Route exact path={`${path}/diagnostic-result`}>
            <DiagnosticTestResult />
            </Route>
            <Route exact path={`${path}/lesson-plans/pdf`}>
            <PDF />
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
