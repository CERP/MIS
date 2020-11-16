
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
            fontSize: "1rem",
            fontWeight: 700,
            backgroundColor: "rgb(250, 250, 250)",
            textTransform: "capitalize"
        },
    },
    cells: {
        style: {
            fontSize: "0.8rem",
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