import React from "react"

interface AugmentedMISStudent {
    name: string
    dob: string
    rollNo: string
    avatar?: string
}

type PropsTypes = {
    students: MISStudent[]
    class: string
    schoolName: string
    schoolLogo: string
}

const StudentIDCardList = (props: PropsTypes) => {
  return(<></>);
}