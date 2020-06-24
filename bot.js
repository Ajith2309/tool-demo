jQuery(function($){
    var root ="data.json";
    var ATM;
    $.ajax(root,{
        dataType:"json",
        method: 'GET',
        success: function(response){
            //alert(response.Installation[0].Question);
            ATM= response;
        },
        error : function(request,errorType,errorMsg){
            alert("Issue with the ajax call:"+errorMsg);
        }
    });
    var count = 0;
    var convForm = $('#chat').convform({eventList:{onInputSubmit: function(convState, ready) {
        console.log('input is being submitted...');
        //here you send the response to your API, get the results and build the next question
        //when ready, call 'ready' callback (passed as the second parameter)
        if(convState.current.answer.value==='GOT')
        {
            convState.current.next = convState.newState({
                type: 'input',
                noAnswer: false,
                name: 'Got-it'+count,
                questions: ['Thank you'],
            });
            setTimeout(ready, Math.random()*500+100);
        }
        // else if(convState.current.answer.value==='end') {
        //     convState.current.next = false;
        //     //emulating random response time (100-600ms)
        //     setTimeout(ready, Math.random()*500+100);
        // }
        /*else if(convState.current.answer.value==='Installation')
        {
            convState.current.next = convState.newState({
                type: 'select',
                name: 'Installation',
                questions: ['Choose a question to get the answer'],
                answers: [
                    {text: ATM.Installation[0].Question, value: 0},
                    {text: ATM.Installation[1].Question, value: 1},
                ]
            });
            setTimeout(ready, Math.random()*500+100);
        }
        else if(convState.current.answer.value==='KTC')
        {
            convState.current.next = convState.newState({
                type: 'select',
                name: 'KTC',
                questions: ['Choose a question to get the answer'],
                answers: [
                    {text: ATM.KTC[0].Question, value: 0},
                    {text: ATM.KTC[1].Question, value: 1},
                    {text: 'How to check if installation is successfull ?', value: 0},
					{text: 'How to change a port in KTC ?', value: 0},
					{text: 'How to check the HDD status ?', value: 0},
					{text: 'How to reboot ATM through KTC ?', value: 0},
					{text: 'How to check the CDM status ?', value: 0},
					{text: 'How to encrypt/decrypt HDD ?', value: 0},
					{text: 'How to view the installed hotfixes ?', value: 0},
					{text: 'How to view the software Info ?', value: 0},
                ],
            });
            setTimeout(ready, Math.random()*500+100);
        }*/
        else if(convState.current.input.name==='ATM-questions' || convState.current.input.name==='ATM-answers')
        {
            var displayQuestions=[];
            if(convState.current.answer.value==='Installation'){
                inputName = 'Installation';
                for(i=0;i<ATM.Installation.length;i++){
                    displayQuestions.push({text : ATM.Installation[i].Question, value : i});
                }
            }
            if(convState.current.answer.value==='KTC'){
                inputName = 'KTC';
                for(i=0;i<ATM.KTC.length;i++){
                    displayQuestions.push({text : ATM.KTC[i].Question, value : i});
                }
            }
            if(convState.current.answer.value==='Application'){
                inputName = 'Application';
                for(i=0;i<ATM.Application.length;i++){
                    displayQuestions.push({text : ATM.Application[i].Question, value : i});
                }
            }
                convState.current.next = convState.newState({
                    type: 'select',
                    name: inputName,
                    questions: ['Choose a question to get the answer'],
                    answers: displayQuestions,
                });                
            setTimeout(ready, Math.random()*500+100);
        }
        else if(typeof convState.current.answer.value=='number')
        {
            var ans;
            var rollback;
            if(convState.current.input.name==='Installation'){
                ans= ATM.Installation[convState.current.answer.value].Answer;
                rollback= 'Installation';
            }
            else if(convState.current.input.name==='KTC'){
                ans= ATM.KTC[convState.current.answer.value].Answer;
                rollback= 'KTC'
            }
            else{
                ans= ATM.Application[convState.current.answer.value].Answer;
                rollback= 'Application' 
            }
            convState.current.next = convState.newState({
                type: 'select',
                name: 'ATM-answers',
                questions: [ans],
                answers: [
                    {text: 'Got it', value: 'GOT'},
                    {text: 'Rollback', value: rollback},
                ],
            });
            setTimeout(ready, Math.random()*500+100);
        }
        else {
            if(Array.isArray(convState.current.answer)) var answer = convState.current.answer.join(', ');
            else var answer = convState.current.answer.text;
            convState.current.next = convState.newState({
                type: 'select',
                noAnswer: true,
                name: 'dynamic-question-'+count,
                questions: ['Hi '+answer+', Welcome!'],
            });
            convState.current.next.next = convState.newState({
                type: 'select',
                name: 'ATM-questions',
                questions: ['Choose a topic below'],
                answers: [
                    {text: 'Installation', value: 'Installation'},
                    {text: 'KTC', value: 'KTC'},
                    {text: 'Application', value: 'Application'},
                ]
            });
            //emulating random response time (100-600ms)
            setTimeout(ready, Math.random()*500+100);
        }
        count++;
    }}});
});