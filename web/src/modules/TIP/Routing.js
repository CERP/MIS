import React from 'react';
import { Route, withRouter, Switch } from 'react-router-dom';
import RemedialGroup from './DiagnosticTest/RemedialGroup';
import InsertGrades from './FormativeTest/InsertGrades';
import DiagnosticTest from './DiagnosticTest';
import DiagnosticTestResult from './DiagnosticTest/Result/index';
import Grading from './FormativeTest/Grading';
import TrainingVideos from './TrainingVideos'
import FormativeTest from './FormativeTest';
import Result from './DiagnosticTest/Result';
import LessonPlans from './LessonPlans';
import HomePage from './index' 
import PDF from './PDF'
import List from './LessonPlans/List'

const Routing = props => {

  const path = (props.location.pathname).substring(0,21)

  return (
    <Switch>
        <Route exact path={path}><HomePage /></Route>
        <Route exact path={`${path}/diagnostic-test/:section_id/:class_name/:subject/insert-grades/:std_id/grading/test-result/result`}><Result /></Route>
        <Route exact path={`${path}/diagnostic-test/:section_id/:class_name/:subject/:test_id/insert-grades/:std_id/grading`}><Grading /></Route>
        <Route exact path={`${path}/diagnostic-test/:section_id/:class_name/:subject/:test_id/insert-grades/test-result`}><Result /></Route>
        <Route exact path={`${path}/diagnostic-test/:section_id/:class_name/:subject/:test_id/insert-grades`}><InsertGrades /></Route>
        <Route exact path={`${path}/diagnostic-test/:section_id/:class_name/:subject/pdf`}><PDF /></Route>
        <Route exact path={`${path}/diagnostic-test`}><DiagnosticTest /></Route>
        <Route exact path={`${path}/formative-test/:section_id/:class_name/:subject/insert-grades/:std_id/grading/test-result/result`}><Result /></Route>
        <Route exact path={`${path}/formative-test/:section_id/:class_name/:subject/:test_id/insert-grades/:std_id/grading`}><Grading /></Route>
        <Route exact path={`${path}/formative-test/:section_id/:class_name/:subject/:test_id/insert-grades/test-result`}><Result /></Route>
        <Route exact path={`${path}/formative-test/:class_name/:subject/:test_id/insert-grades`}><InsertGrades /></Route>
        <Route exact path={`${path}/formative-test/:class_name/:subject/pdf`}><PDF /></Route>
        <Route exact path={`${path}/formative-test`}><FormativeTest /></Route>
        <Route exact path={`${path}/diagnostic-result/:section_id/:class_name/:subject/result`}><Result /></Route>
        <Route exact path={`${path}/diagnostic-result`}><DiagnosticTestResult /></Route>
        <Route exact path={`${path}/lesson-plans/:class_name/:subject/:lesson_number/list/pdf`}><PDF /></Route>
        <Route exact path={`${path}/lesson-plans/:class_name/:subject/list`}><List /></Route>
        <Route exact path={`${path}/lesson-plans`}><LessonPlans /></Route>
        <Route exact path={`${path}/training-videos`}><TrainingVideos /></Route>
    </Switch>
    )
};

export default withRouter(Routing);
