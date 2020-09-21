export const data = {
    diagnostic_result : {
        test1: {
            question1: {
                answer: "banana",
                isCorrect: true,
                slo: ["reading", "fruit"]
            },
            question2: {
                answer: "mobile phone",
                isCorrect: false,
                slo: ["reading", "fruit"]
            },
            question3: {
                answer: "a",
                isCorrect: true,
                slo: ["reading", "animals"]
            },
            question4: {
                answer: "g",
                isCorrect: true,
                slo: ["reading", "flag"]
            }
        }
    }
}
export const targeted_instruction = {
    tests: {
        test1 : {
            name: 'test1',
            subject: "English",
            class: "Class 10",
            type: "Diagnostic",
            label: "Class 10 Diagnostic Test! For English",
            pdf_url: "https://arxiv.org/pdf/quant-ph/0410100.pdf"
        },
        test2 : {
            name: 'test2',
            subject: "Urdu",
            class: "Class 10",
            type: "Diagnostic",
            label: "Class 10 Diagnostic Test! For Urdu",
            pdf_url: "https://arxiv.org/pdf/quant-ph/0410100.pdf"
        },
        test3 : {
            name: 'test3',
            subject: "Mathematics",
            class: "Class 9",
            type: "Diagnostic",
            label: "Class 9 Diagnostic Test! For Mathematics",
            pdf_url: "https://arxiv.org/pdf/quant-ph/0410100.pdf"
        }
    }
        
}