
import { isMobile } from 'utils/helpers'

export const customStyles = {
    rows: {
        style: {
            minHeight: "48px"
        },
    },
    headCells: {
        style: {
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: 700,
            backgroundColor: "rgb(250, 250, 250)",
            textTransform: "capitalize"
        },
    },
    cells: {
        style: {
            paddingLeft: "20px",
            paddingRight: "20px",
            fontSize: isMobile ? "12px" : "14px",
            backgroundColor: "rgb(250, 250, 250)",
            '&:hover': {
                color: "rgb(116, 216, 159)",
                cursor: "pointer"
            }
        },
    },
    pagination: {
        style: {
            backgroundColor: "rgb(250, 250, 250)",
            color: "black",
        },
    },
};

export const singleStdColumns = [
    {
        name: 'SLO',
        selector: 'slo',
        sortable: true,

    },
    {
        name: 'Correct',
        selector: 'correct',
        sortable: true,

    },
    {
        name: 'Possible',
        selector: 'possible',
        sortable: true,

    },
    {
        name: 'Percentage',
        selector: 'percentage',
        sortable: true,

    }
]