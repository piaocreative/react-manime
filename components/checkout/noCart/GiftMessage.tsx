
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import StandardButton from '../../styled/StandardButton';
import { StandardLabel, StandardInputField as StandardInput, StandardTextAreaField as StandardTextArea } from '../../styled/StyledComponents';
import Box from '../../styled/Box';
import log from '../../../utils/logging';
import { validateEmail } from '../../../utils/validation';

const ActionButton = styled(StandardButton)`
  min-width: 120px;
  background: ${props => props.disabled ? '#eee': '#2c4349'};
  height: 40px;
  &:hover {
    background: ${props => props.disabled ? '#eee': '#2c4349'};
  }
  margin-bottom: 12px;
  width: 100%;

`;

export type GiftMessageForm = {
    fromName: string,
    fromEmail: string,
    toName: string,
    message: string,
}
export const InitialGiftMessage: GiftMessageForm = {
    fromEmail: "",
    fromName: "",
    toName: "",
    message: ""
}
type ComponentState = {
    // isMobile: boolean,
    errorFromName?: string,
    errorFromEmail?: string,
    errorToName?: string,
    errorMessage?: string
};

type GiftMessageCallback = {
    (giftMessage: GiftMessageForm)
}

type FormErrors = {
    fromName?: boolean,
    fromEmail?: boolean,
    toName?: boolean,
    message?: boolean,
}
function GiftMessage({ callback , messageForm = InitialGiftMessage }) {


    const [fromName, setFromName] = useState(messageForm.fromName);
    const [fromEmail, setFromEmail] = useState(messageForm.fromEmail)
    const [toName, setToName] = useState(messageForm.toName)
    const [message, setMessage] = useState(messageForm.message);
    const [isMobile, setIsMobile] = useState(false)
    const [errors, setErrors] = useState<FormErrors>({});
    const [errorResponse, setErrorResponse] = useState<ComponentState>({});



    function validateForm() : boolean{
        const nameError = "Name must be more than 3 letters.";
        const errorFromName = fromName?.length < 3 || fromName?.trim()?.split(' ').length < 2;
        const errorFromEmail = !validateEmail(fromEmail || '');
        const errorToName = toName?.length < 3 || toName?.trim()?.split(' ').length < 2;
        const errorMessage = (message && message.length > 250);

        const hasError = errorFromName || errorFromEmail || errorToName || errorMessage;

        log.verbose("validation errors ", {fromName: errorFromName, fromEmail: errorFromEmail, toName: errorToName, message: errorMessage})

        if(hasError) {
            setErrors({
                fromName: errorFromName,
                fromEmail: errorFromEmail,
                toName: errorToName,
                message: errorMessage,
            });
            setErrorResponse({
                errorFromName: fromName?.length < 3 ? nameError: errorFromName ? 'Full name is required': '',
                errorFromEmail: errorFromEmail? 'Invalid Email': '',
                errorToName: toName?.length < 3 ? nameError: errorToName ? 'Full name is required': '',
                errorMessage: errorMessage ? 'Input less than 250 letters': ''
            });

        } else {
            setErrors({});
            setErrorResponse({});
        }

        return !hasError;
    }

    useEffect(() => {

        if (window.innerWidth >= 768) {
            setIsMobile(false);
        }

    }, [])

    function nextStep() {
        //validate form and callback
        if(!validateForm())
            return;

        const updateForm: GiftMessageForm ={
            fromName: fromName,
            fromEmail: fromEmail,
            toName: toName,
            message: message
        }
        callback(updateForm)
    }

    function emailInputHandler(ev) : void {
        setFromEmail(ev.target.value.toLowerCase());
    }

    const giftMessagePlaceholder = `Write a gift message. Need help getting started? Maybe something like: 
Hey, I know how much you love getting your nails done so I thought you'd enjoy this high-tech manicure!`;

        return (
                <Box display='grid' pt={0} maxWidth='480px' width={1}>
                    <Box display='flex' justifyContent='space-between' alignItems='center' width={1}>
                        <Box flex={1}>
                            {/* <Box fontSize={['12px', '14px']} my={3} textAlign='center' letterSpacing={'2px'} color='primary'>GIFT BOX</Box> */}

                            <StandardLabel>From</StandardLabel>
                            <StandardInput
                                placeholder={(errors.fromName && !isMobile) ? 'Please enter your full name' : 'Your name (sender’s name)*'}
                                value={fromName}
                                onChange={ev => setFromName(ev.target.value)}
                                error={errors.fromName}
                                errorText={errorResponse.errorFromName}

                            />
                            <StandardInput
                                placeholder={(errors.fromEmail && !isMobile) ? 'mani@me.co' : 'Your email*'}
                                value={fromEmail}
                                onChange={emailInputHandler}
                                error={errors.fromEmail}
                                errorText={errorResponse.errorFromEmail}
                            />

                            <StandardLabel>To</StandardLabel>
                            <StandardInput
                                placeholder={(errors.toName && !isMobile) ? 'Please enter recipient\'s full name' : 'Recipient\'s name*'}
                                value={toName}
                                onChange={ev => setToName( ev.target.value)}
                                error={errors.toName}
                                errorText={errorResponse.errorToName}
                            />

                            <StandardLabel>Gift Message - we will print it on the postcard</StandardLabel>
                            <StandardTextArea
                                height={130}
                                placeholder={(errors.message && !isMobile) ? 'An optional note for your gift' : errors.message ? 'Your note' : giftMessagePlaceholder}
                                value={message}
                                error={errors.message}
                                errorText={errorResponse.errorMessage}
                                onChange={ev => setMessage(ev.target.value)}
                            />
                        </Box>
                    </Box>

                    <ActionButton
                        onClick={nextStep}>
                        NEXT
                    </ActionButton>
                </Box>
           

        );


}

export default GiftMessage;
