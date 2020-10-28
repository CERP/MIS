
import { isMobile } from 'utils/helpers'

export const conditionalRowStyles = [
    {
        //@ts-ignore
        when: row => row.slo === '',
        style: {
            color: 'blue',
            '&:hover': {
                cursor: 'pointer',
            },
        },
    },
];

export const customStyles = {
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
            fontSize: isMobile ? "12px" : "14px",
            '&:hover': {
                cursor: "pointer"
            }
        },
    }
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
        name: 'Percentage (%)',
        selector: 'percentage',
        sortable: true,

    }
]