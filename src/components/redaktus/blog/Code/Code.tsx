import * as Prism from 'prismjs';
import * as React from 'react';
import { useVisualEdit } from 'redaktus/core';
import * as types from 'redaktus/types';
import Editor from './SimpleCodeEditor';
import blockNames from '../blockNames';
import Container from '../layout/Container';
import Section from '../layout/Section';
import PrismCode from './PrismCode';
import Styles from './Styles';

// Prism components for syntax highlighting
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-jsx';
import 'prismjs/components/prism-tsx';
import 'prismjs/plugins/line-numbers/prism-line-numbers.js';
import 'prismjs/plugins/show-language/prism-show-language.js';
import 'prismjs/plugins/line-highlight/prism-line-highlight.js';

export interface CodeBrickProps {
  language: string;
  dataline?: string;
  showLineNumbers: boolean;
}

const CodeBrick: types.Brick<CodeBrickProps> = ({
  language = 'javascript',
  dataline = '',
  showLineNumbers = false,
}) => {
  const [hasMount, setHasMount] = React.useState(false);
  React.useEffect(() => {
    setHasMount(true);
  }, []);

  const [value, onChange, isReadOnly] = useVisualEdit(`import React from 'react'
console.log('hello')
const a = 2
let b = 3`);
  const plugins = [];
  if (showLineNumbers) {
    plugins.push('line-numbers');
  }
  if (dataline !== '') {
    plugins.push('line-highlight');
  }

  if (!hasMount) {
    return null;
  }
  if (isReadOnly) {
    return (
      <Section>
        <Styles />
        <Container>
          <style>{`
        .dark pre {
          background-color: #1f2937;
        }
        .line-highlight {
          background: rgba(255,255,255,0.2);
        }
        .line-highlight:before {
          content: '';
        }
      `}</style>
          <PrismCode code={value} language={language} plugins={plugins} dataLine={dataline} />
        </Container>
      </Section>
    );
  }

  // return null
  return (
    <Section>
      <Styles />
      <style>{`
        .dark pre {
          background-color: #1f2937;
        }

        .editor-line-number {
          counter-reset: line;
        }

        .editor-line-number #codeArea {
          outline: none;
          padding-left: 40px !important;
        }

        .editor-line-number pre {
          padding-left: 40px !important;
        }

        .editor-line-number .row-line-number {
          position: absolute;
          left: 0px;
          color: #999;
          text-align: right;
          width: 20px;
          font-weight: 100;
        }
      `}</style>
      <Container>
        <pre className={`rounded-lg language-${language}`}>
          <code className={`language-${language}`}>
            <Editor
              value={value}
              onValueChange={onChange}
              highlight={(code: any) => {
                return Prism.highlight(code || '', Prism.languages[language], `${language}`)
                  .split('\n')
                  .map((line: string, i: number) =>
                    showLineNumbers ? `<span class='row-line-number'>${i + 1}</span>${line}` : line,
                  )
                  .join('\n');
              }}
              padding={10}
              textareaId="codeArea"
              className={showLineNumbers ? 'editor-line-number' : ''}
            />
          </code>
        </pre>
      </Container>
    </Section>
  );
};

CodeBrick.schema = {
  name: blockNames.CodeBlock,
  label: 'Code',
  category: 'rb-ui blog',
  playgroundLinkLabel: 'View source code on Github',
  playgroundLinkUrl: 'https://github.com/Redaktus/redaktus-ui/blob/master/src/blog/Code/Code.tsx',
  getDefaultProps: () => ({
    code: "import React from 'react'\nconsole.log('hello')\nconst a = 2\nlet b = 3",
    language: 'typescript',
    dataline: '',
    showLineNumbers: false,
  }),
  sideEditProps: [
    {
      name: 'language',
      label: 'Language',
      type: types.SideEditPropType.Select,
      selectOptions: {
        display: types.OptionsDisplay.Select,
        options: [
          { value: 'javascript', label: 'JavaScript' },
          { value: 'css', label: 'CSS' },
          { value: 'typescript', label: 'TypeScript' },
          { value: 'bash', label: 'Bash' },
          { value: 'jsx', label: 'JSX' },
          { value: 'tsx', label: 'TSX' },
        ],
      },
    },
    {
      name: 'dataline',
      label: 'Highlight line (ex: 1,2,3): ',
      type: types.SideEditPropType.Text,
    },
    {
      name: 'showLineNumbers',
      label: 'Show Line Numbers?',
      type: types.SideEditPropType.Boolean,
    },
    {
      name: 'helper',
      label: 'Warning',
      type: types.SideEditPropType.Custom,
      component: () => (
        <div className="text-sm">The highlighted lines are visible only in preview mode and in the frontend site.</div>
      ),
    },

    // With Line Numbers
    // Show Code
  ],
};

export default CodeBrick;
