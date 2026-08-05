import React from 'react';
import { Form } from './Form';

const Contact = () => {
    return (
        <div className='h-[800px] flex justify-center items-center' id='contacto'>
            <div className='flex flex-col w-[85vw] lg:w-[950px] 2xl:w-[1300px] mx-auto'>
                <h4 className='font-bold text-4xl'>CONTACTANOS</h4>
                <p className='pb-12'>No pierdas más tu tiempo. <strong>Transformá tus espacios de forma eficiente</strong></p>
                <Form
                    fields={[
                        {
                            name: 'name',
                            type: 'text',
                            label: '',
                            placeholder: 'Nombre*',
                            required: true,
                        },
                        {
                            name: 'phoneNumber',
                            type: 'tel',
                            label: '',
                            placeholder: 'Teléfono*',
                            required: true,
                        },
                        {
                            name: 'message',
                            type: 'textArea',
                            label: '',
                            placeholder: 'Mensaje*',
                            required: true,
                        },
                    ]}
                    onSuccessMessage={'Tu mensaje fue enviado con éxito. Nos contactaremos a la brevedad!'}
                    onErrorMessage={'Por favor, intenta de nuevo más tarde.'}
                    submitButtonLabel={'ENVIAR!'}
                    emailServiceURL={'https://thehippoapi.netlify.app/.netlify/functions/api/ivos-email'}
                />
            </div>
        </div>
    );
};

export default Contact;