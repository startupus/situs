import classNames from 'classnames';
import * as React from 'react';
import { Image, Text } from 'redaktus/core';
import * as types from 'redaktus/types';

import { FiUser } from 'react-icons/fi';
import { BackgroundColorsSideEditProps } from 'website/LayoutSideProps';
import blockNames from '../blockNames';
import { bgColors } from '../colors';
import Container from '../layout/Container';
import Section from '../layout/Section';

export interface TestimonialProps {
  authorName: string;
  authorJobTitle: string;
  avatarImage: types.IImageSource;
  logoImage: types.IImageSource;
  small?: boolean;
  bg?: { color: string; className: string };
}

const Testimonial: types.Brick<TestimonialProps> = ({
  authorName,
  authorJobTitle,
  avatarImage,
  logoImage,
  small = false,
  bg = bgColors.white.value,
}) => {
  return (
    <Section bg={bg}>
      <Container
        size="sm"
        className={classNames('pt-12 pb-20 flex flex-col justify-between ', small ? 'items-start' : 'items-center')}
      >
        <Text
          renderBlock={(props: any) => (
            <div
              className={classNames(
                'flex-1 leading-relaxed text-center mb-6 text-gray-700 dark:text-gray-200 max-w-lg',
                small ? 'text-md text-left' : 'text-xl text-center',
              )}
            >
              {props.children}
            </div>
          )}
          placeholder="Quote..."
          renderPlaceholder={(props: any) => {
            return <span>{props.children}</span>;
          }}
          propName="quote"
        />
        <div className="flex items-center justify-center">
          {avatarImage ? (
            <Image
              alt={authorName}
              propName="avatarImage"
              imageClassName={classNames('rounded-full', small ? 'w-8' : 'w-10')}
            />
          ) : (
            <div
              className={classNames(
                'flex justify-center items-center rounded-full bg-gray-100 text-gray-500 text-xl',
                small ? 'w-8' : 'w-10',
              )}
            >
              <FiUser />
            </div>
          )}
          <div className="ml-3 dark:text-gray-200">
            <Text
              renderBlock={(props: any) => <div className="text-sm font-bold">{props.children}</div>}
              placeholder="Author name..."
              propName="authorName"
            />
            <Text
              renderBlock={(props: any) => <div className="text-xs">{props.children}</div>}
              placeholder="Job title..."
              propName="authorJobTitle"
            />
          </div>
          {logoImage && (
            <div className="ml-5 pl-5 border-l border-gray-300">
              <Image alt={authorJobTitle} propName="logoImage" imageClassName="w-12" />
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
};

Testimonial.schema = {
  name: blockNames.Testimonial,
  label: 'Testimonial',
  category: 'rb-ui website',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/website/Testimonial/Testimonial.tsx',

  getDefaultProps: () => ({
    quote:
      'F2.net is a skilled company who helped us define our production management application requirements and implemented it as a beautiful system that our users love. We are very satisfied.',
    authorName: 'Matteo Frana',
    authorJobTitle: 'Founder @ Redaktus',
    avatarImage: {
      src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      alt: 'Matteo',
      seoName: 'matteo',
    },
    logoImage: {
      src: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      placeholderSrc: 'https://via.placeholder.com/400x300/cccccc/666666?text=Demo+Image',
      srcSet: '',
      alt: 'Redaktus',
      seoName: 'redaktus',
    },
  }),
  sideEditProps: [BackgroundColorsSideEditProps],
};

export default Testimonial;
