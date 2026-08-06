"use client";
import React, { useState } from 'react';

const initialValues = {
    name: '',
    phoneNumber: 0,
    message: '',
};

type FieldsType = {
    name: 'name' | 'phoneNumber' | 'message';
    type: 'text' | 'textArea' | 'tel' | 'email';
    label: string;
    placeholder: string;
    required?: boolean;
}

type MyCustomFormProps = {
    fields: FieldsType[];
    onSuccessMessage: string;
    onErrorMessage: string;
    emailServiceURL: string;
    submitButtonLabel: string;
};

type FormValues = {
    name: string;
    phoneNumber: number;
    message: string;
};

const MyCustomForm = ({
    fields,
    onSuccessMessage,
    onErrorMessage,
    emailServiceURL,
    submitButtonLabel
}: MyCustomFormProps) => {
    const [messageSent, setMessageSent] = useState<string>('');
    const [isAPILoading, setIsAPILoading] = useState<boolean>(false);
    const [messageDescription, setMessageDescription] = useState<string>('');
    const [values, setValues] = useState<FormValues>({
        name: '',
        phoneNumber: 0,
        message: '',
    });

    const renderSentMessage = () => {
        if (messageSent === 'succeed') {
            return <div className={`message succeed col-span-2 w-full text-center mb-6`}>
                <h2 className={'mb-2 text-4xl font-semibold text-[#F94E19]'}>Gracias!</h2>
                <p className='text-black'>{onSuccessMessage}</p>
            </div>
        }
        if (messageSent === 'error') {
            return <div className={`message error w-full text-center mb-6`}>
                <h2 className={'mb-4 text-red-500'}>Algo salió mal</h2>
                <p>{onErrorMessage}</p>
                <p>{messageDescription}</p>
            </div>
        }
        return null;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { target } = e;
        const { name, value } = target;

        setValues({
            ...values,
            [name]: value
        });
    };

    const handleSubmit = (event: any) => {
        if (event) event.preventDefault();

        setIsAPILoading(true);

        const body = new URLSearchParams({
            name: values.name,
            phoneNumber: String(values.phoneNumber),
            message: values.message,
        });

        fetch(emailServiceURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: body.toString(),
        })
            .then((response) => {
                if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
                setValues(initialValues);
                setMessageSent('succeed');
                setIsAPILoading(false);
            })
            .catch((error: Error) => {
                setMessageDescription(error.toString());
                setMessageSent('error');
                setIsAPILoading(false);
            });
    };

    return (
        <form
            className={`form w-full grid grid-cols-2 gap-4`}
            onSubmit={(event) => handleSubmit(event)}
        >
            {
                fields.map((field) => {
                    const { name, type, label, placeholder } = field;

                    switch (type) {
                        case 'textArea':
                            return (
                                <section className={'mb-4 col-span-2'} key={name}>
                                    <label className={'contact-label'}>{label}</label>
                                    <textarea
                                        name={name}
                                        id={name}
                                        value={values[name]}
                                        rows={2}
                                        cols={40}
                                        className='resize-none py-5 px-6 border-[3px] border-[#30505B] w-full rounded-[42px] focus:outline-none focus:placeholder:text-gray-400 placeholder:text-black'
                                        placeholder={placeholder}
                                        onChange={handleChange}
                                        required={field.required}
                                    />
                                </section>
                            );
                        case 'tel':
                            return (
                                <section className='mb-4 col-span-2 md:col-span-1' key={name}>
                                    <label className={'contact-label'}>{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        id={name}
                                        pattern="[0-9]*"
                                        inputMode="numeric"
                                        className={'py-4 px-6 border-[3px] border-[#30505B] rounded-[42px] w-full focus:outline-none focus:placeholder:text-gray-400 placeholder:text-black'}
                                        onChange={handleChange}
                                        placeholder={placeholder}
                                        required={field.required}
                                    />
                                </section>
                            );
                        default:
                            return (
                                <section className='mb-4 col-span-2 md:col-span-1' key={name}>
                                    <label className={'contact-label'}>{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        id={name}
                                        className={'py-4 px-6 border-[3px] border-[#30505B] rounded-[42px] w-full focus:outline-none focus:placeholder:text-gray-400 placeholder:text-black'}
                                        onChange={handleChange}
                                        value={values[name]}
                                        placeholder={placeholder}
                                        required={field.required}
                                    />
                                </section>
                            )
                    }
                })
            }
            {renderSentMessage()}
            <div className='flex justify-center lg:justify-end col-span-2'>
                <button
                    disabled={isAPILoading}
                    value={submitButtonLabel ? submitButtonLabel : 'Enviar'}
                    type="submit"
                    className={` ${isAPILoading ? 'opacity-50' : ''} cursor-pointer md:w-[180px] font-bold flex items-center justify-center w-1/2 h-[70px] bg-[#F94E19] border-[#F94E19] border-[3px] border duration-500 hover:bg-transparent rounded-tr-[30px] rounded-bl-[30px]`}
                >
                    {submitButtonLabel}
                </button>
            </div>
        </form>
    )
};

export default MyCustomForm
