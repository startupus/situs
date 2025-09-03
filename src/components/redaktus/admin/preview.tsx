import Head from 'next/head';
import React from 'react';
import { Preview } from 'redaktus/frontend';

const PagePreview: React.FC = () => {
  return (
    <>
      <Head>
        <title>Preview</title>
      </Head>
      <Preview />
    </>
  );
};

export default PagePreview;
