"use client"

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Form, Input, Select, Space, Flex, InputNumber, Alert } from 'antd';
import { SubmitHandler, useForm } from "react-hook-form";
import styles from './page.module.scss';
import { LanguageContext } from '../context/languageContext';
import { RuleObject } from 'antd/es/form';
import axios from 'axios';


const { Search } = Input;

type Payer = { iban: string, id: string, balance: number }

const IBAN_VALIDATION = 'https://matavi.eu/validate?iban=';

interface IFormInput {
    amount: number;
    payeeAccount: string;
    purpose: string;
    payerAccount: string;
    payee: string;
}

const payerAccounts: Payer[] = [
    {
        iban: 'LT307300010172619160',
        id: '1',
        balance: 1000.12
    },
    {
        iban: 'LT307300010172619161',
        id: '2',
        balance: 2.43
    },
    {
        iban: 'LT307300010172619162',
        id: '3',
        balance: -5.87
    }
];

const onChange = (value: string | number | null) => {
    console.log('changed', value);
};

const Transfer: React.FC = () => {
    const language = useContext(LanguageContext);
    console.log(language);
    const { handleSubmit, control, formState: { errors }, reset } = useForm<IFormInput>({
        defaultValues: {
            amount: 0.01,
            payee: '',
            payeeAccount: '',
            purpose: '',
            payerAccount: '',
        }
    });

    const onSubmit: SubmitHandler<IFormInput> = (data) => console.log(data)

    const [activeAccount, setActiveAccount] = useState<Payer | null>(null)

    const payers = useMemo(() => payerAccounts.map((p) => ({
        value: p.id,
        label: p.iban,
    })), []);

    const setPayer = useCallback((value: string) => {
        const payer = payerAccounts.find((p) => p.id === value)
        if (payer) {
            setActiveAccount(payer);
            reset();
        }
    }, []);

    const validatePayeeAccount = async (rule: RuleObject, value: string, callback: (error?: string | undefined) => void) => {
        const ibanRegex = /\b[A-Z]{2}[0-9]{2}(?:[ ]?[0-9]{4}){4}(?!(?:[ ]?[0-9]){3})(?:[ ]?[0-9]{1,2})?\b/;

        if (value.length < 20 && !ibanRegex.test(value)) return 'Invalid IBAN';
        try {
            const response = await fetch(`https://matavi.eu/validate?iban=${value}`);
            const data = await response.json();
            if (!data.valid) {
                return 'Invalid IBAN';
            }
        } catch (error) {
            console.error('Error validating IBAN:', error);
        }
        return undefined; // Return undefined if validation passes
    };

    const invalidAccount = useMemo(() => !activeAccount || activeAccount?.balance < 0.1, [activeAccount]);

    return (
        <Flex gap="middle" vertical>
            <Space wrap>
                <Select
                    style={{ width: 200 }}
                    onChange={setPayer}
                    options={payers}
                />
                {invalidAccount ? <Alert message="There is no active account or Your balance is low" type="error" /> : null}
            </Space>

            <Form className={styles.form} layout="vertical" onFinish={handleSubmit(onSubmit)} disabled={invalidAccount}>
                <Form.Item hasFeedback label="Amount" name="amount" rules={[{ required: true, type: 'number', min: 0.01, max: activeAccount?.balance }]}>
                    <InputNumber type="number" />
                </Form.Item>
                <Form.Item hasFeedback label="Purpose" name="purpose" rules={[{ required: true, min: 3, max: 135 }]}>
                    <Input />
                </Form.Item>
                <Form.Item hasFeedback label="Payee Account" name="payeeAccount" rules={[{
                    required: true, validator: validatePayeeAccount,
                }]}>
                    <Input />
                </Form.Item>
                <Form.Item hasFeedback label="Payee" name="payee" rules={[{ required: true, min: 3, max: 70 }]}>
                    <Input />
                </Form.Item>
                <Form.Item hasFeedback label="Payer Account">
                    <Input placeholder="Payer" disabled value={activeAccount?.iban} addonAfter={activeAccount?.balance} />
                </Form.Item>
                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
        </Flex>
    );
}

export default Transfer;