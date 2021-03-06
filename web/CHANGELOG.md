# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [mischool-web@v1.1.1] - 2021-07-16

### Added

-   Added "Add Student Marks"-Modal on TIP → View Class/Groups → Class View → Select Class → Tap on N/A subject

### Fixes

-   Header allingment in Final result

## [mischool-web@v1.1.0] - 2021-07-15

### Added

-   Promote Students (#384)
-   Redesigning MIS activation page (#387)
-   Redesigning student attendance page (#391)
-   Style tweaks
-   Link to student profile
-   Apply max students limit

### Fixes

-   Fix checkPermission() validations
-

### Fixes

-   Change student and family search input placeholder text
-   Don't show inactive staff members on staff login page

## [mischool-web@v1.0.6] - 2021-07-09

### Added

-   Change status column in Final Result to P/S (according to design)
-   Quiz Result: Added Not Graded in both the marks column and the Progress Column
-   Quiz Result: Changed the color of the text for Not Graded to black

### Fixes

-   Added undefined check in TIP → View Class/Groups → Class View → Select Class → Tap on blank subject

## [mischool-web@v1.0.5] - 2021-07-08

## Fixes

-   Fix monthly scholarship amount bug ([#390https://github.com/CERP/MIS/pull/390

## [mischool-web@v1.0.4] - 2021-07-08

## Fixes

-   Fix undefined `FINISHED_SCHOOL` tag
-   Remove filter from sections
-   Change text from `Profile` to `School Profile`
-   Show class name if section name is not available in diary section drop

## [mischool-web@v1.0.3] - 2021-07-08

## Fixes

-   Handle Incorrect rollNumber and classYear
-   Add check for `undefined` class fees (default + additional)
-   Make family fee title visible
-   Handle negative class order and update header text
-   Add check to prevent incorrect balance calculations
-   Get rid of toast alert for mismatch family siblings info
-   Create vertifical spaces for tabs
-   Remove applying `toTitleCase()` for section `namespaced_name`
-   Improve logic for `isValidStudent()` and apply it
-   Remove fee label formatting for `SPECIAL_SCHOLARSHIP`
-   Improve `class_fee` (_MONTHLY_CLASS_FEE_) name and handle incoming props for default class fee
-   Handle saving scholarship non-negative amount
-   Handle duplicates payments or fees Ids on merging payments and fees of siblings
-   Improve auto-generate payments - Remove date check
-   Sort students by `RollNumber` in students attendance

## [mischool-web@v1.0.2] - 2021-07-04

### Fixes

-   Filter out undefined quiz
-   Add `isNaN()` check
-   Unset default obtained marks

## [mischool-web@v1.0.1] - 2021-07-04

### Refactor

-   Move `blankStudent()` to form-defaults
-   User `heroicons` svgs
-   Update text and style tweaks

### Fixes

-   Undefined faculty from user Id
-   Filter out `monthly` student fee from ledger
-   School logo `object-contain` on staff login page
-   School logon from school profile
-   Missing student `section_id` on creating manually for onboarding
-   Change overflow from `scroll` to `auto` to show students for onboarding
-   Remove unnecessary Checks for onboarding
-   Add `SubAdmin` swithc-button for staff-profile onboarding

## [mischool-web@v1.0.0] - 2021-07-01

-   Major Redesign release
