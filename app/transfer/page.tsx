"use client"

import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Button, Form, Input, Select, Space, Flex, InputNumber, Alert } from 'antd';
import { SubmitHandler, useForm, Controller } from "react-hook-form";
import styles from './page.module.scss';
import { LanguageContext } from '../context/languageContext';
import { validateIban } from '../actions'

type Payer = { iban: string, id: string, balance: number }

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

const defaultValues = {
    amount: 0.01,
    payeeAccount: '',
    purpose: '',
    payee: '',
    payerAccount: ''
};

const Transfer: React.FC = () => {
    const language = useContext(LanguageContext);

    const [completedData, setCompletedData] = useState<IFormInput | null>(null);
    const { handleSubmit, control, reset, setValue } = useForm<IFormInput>({ defaultValues });
    const [form] = Form.useForm();

    const onSubmit: SubmitHandler<IFormInput> = (data: IFormInput) => {
        setCompletedData(data);
        reset(defaultValues);
        form.resetFields();
        setTimeout(() => setCompletedData(null), 5000);
    }

    const [activeAccount, setActiveAccount] = useState<Payer | null>(null)

    const payers = useMemo(() => payerAccounts.map((p) => ({
        value: p.id,
        label: p.iban,
    })), []);

    const setPayer = useCallback((value: string) => {
        const payer = payerAccounts.find((p) => p.id === value)
        if (payer) {
            setActiveAccount(payer);
            setValue('payerAccount', payer.iban, { shouldValidate: false })
        }
    }, [reset, setActiveAccount]);

    const balance = useMemo(() => {
        if (activeAccount) {
            if (language === 'lt') return new Intl.NumberFormat('lt-LT').format(activeAccount.balance);
            if (language === 'en') return new Intl.NumberFormat('en-US').format(activeAccount.balance);
        }
        return activeAccount?.balance;
    }, [activeAccount, language]);

    const invalidAccount = useMemo(() => !activeAccount || activeAccount?.balance < 0.1, [activeAccount]);

    return (
        <Flex gap="middle" vertical>
            <Space wrap>
                <Select
                    title='Choose Account'
                    style={{ width: 200 }}
                    onChange={setPayer}
                    options={payers}
                />
                {invalidAccount ? <Alert message="There is no active account or Your balance is low" type="error" /> : null}
            </Space>

            <Form className={styles.form} layout="vertical" form={form} onFinish={handleSubmit(onSubmit)} disabled={invalidAccount} initialValues={defaultValues}>
                <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => <Form.Item hasFeedback label="Amount" name="amount" rules={[{ required: true, type: 'number', min: 0.01, max: activeAccount?.balance }]}>
                        <InputNumber
                            {...field}
                            style={{ width: 200 }}
                            parser={(value) => {
                                if (!value) return 0.01;
                                return language === 'lt' ? parseFloat(value.replace(',', '.')) : parseFloat(value.replace('.', ','));
                            }}
                            formatter={(value) => {
                                if (value && language === 'lt') return new Intl.NumberFormat('lt-LT').format(value);
                                if (value && language === 'en') return new Intl.NumberFormat('en-US').format(value);
                                return '';
                            }}
                        />
                    </Form.Item>}
                />

                <Controller
                    name="purpose"
                    control={control}
                    render={({ field }) => <Form.Item
                        hasFeedback
                        label="Purpose"
                        name="purpose"
                        rules={[{ required: true, min: 3, max: 135 }]}
                    >
                        <Input {...field} />
                    </Form.Item>}
                />

                <Controller
                    name="payeeAccount"
                    control={control}
                    render={({ field }) => <Form.Item hasFeedback label="Payee Account" name="payeeAccount" rules={[{
                        required: true, validator: (_rule, value, cb) => {
                            if (!value) cb("IBAN is a mandatory field");
                            if (value.length < 15) cb("IBAN should not be less than 15 symbols");
                            validateIban(value).then((data) => data ? cb(data) : cb());
                        },
                    }]}>
                        <Input {...field} />
                    </Form.Item>}
                />

                <Controller
                    name="payee"
                    control={control}
                    render={({ field }) => <Form.Item hasFeedback label="Payee" name="payee" rules={[{ required: true, min: 3, max: 70 }]}>
                        <Input {...field} />
                    </Form.Item>}
                />

                <Controller
                    name="payerAccount"
                    control={control}
                    render={({ field }) =>
                        <Form.Item hasFeedback label="Payer Account">
                            <Input {...field} size='large' placeholder="Payer" disabled addonAfter={balance} />
                        </Form.Item>
                    }
                />

                <Button type="primary" htmlType="submit">
                    Submit
                </Button>
            </Form>
            {completedData ? <Alert
                message="Success Transfer"
                description={JSON.stringify(completedData)}
                type="success"
                showIcon
            /> : null}
        </Flex >
    );
}

export default Transfer;