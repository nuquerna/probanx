'use client'
import React, { useCallback, useEffect, useState } from 'react';

import { Inter } from "next/font/google";
import "./globals.css";

import Link from 'next/link'
import {
  DesktopOutlined,
  GlobalOutlined,
  InteractionOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Button, Flex, Layout, Menu } from 'antd';
import styles from './page.module.css'
import { LanguageContext } from './context/languageContext';

const { Header, Content, Footer, Sider } = Layout;

const inter = Inter({ subsets: ["latin"] });

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(<Link href="/">Home</Link>, '1', <DesktopOutlined />),
  getItem(<Link href="/transfer" >Transfer</Link>, '2', <InteractionOutlined />),
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [format, setFormat] = useState('lt');

  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout style={{ minHeight: '100vh' }}>
          <Sider>
            <div className="demo-logo-vertical" />
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
          </Sider>
          <Layout>
            <Header style={{ padding: 0, background: '#fff' }}>
              <Flex style={{ padding: 20 }} gap={15} align='center' justify='start'>
                <Button type={format === 'lt' ? 'primary' : undefined} onClick={() => setFormat('lt')}>LT</Button>
                <Button type={format === 'en' ? 'primary' : undefined} onClick={() => setFormat('en')}>EN</Button>
              </Flex>
            </Header>
            <Content style={{ margin: '0 16px' }}>
              <LanguageContext.Provider value={format}>
                <div className={styles.context}>
                  {children}
                </div>
              </LanguageContext.Provider>
            </Content>
            <Footer style={{ textAlign: 'center' }}>
              ©{new Date().getFullYear()} Created by PPK
            </Footer>
          </Layout>
        </Layout></body>
    </html>
  );
}
