import React from 'react';
import SbEditable from 'storyblok-react';
// import Components from './components.js';

const Post = props => {
  const { blok } = props;
  const { Title, block } = blok;
  return (
    <div>
      <h1>{Title}</h1>
      {block.map(b => {
        if (b.component === 'Title') {
          return (
            <SbEditable content={b}>
              <h2>{b.Title}</h2>
            </SbEditable>
          );
        } else if (b.component === 'Paragraph') {
          return (
            <SbEditable content={b}>
              <p>{b.Paragraph}</p>
            </SbEditable>
          );
        } else if (b.component === 'Code') {
          return (
            <SbEditable content={b}>
              <p>{b.Code}</p>
            </SbEditable>
          );
        }
      })}
    </div>
  );
};

export default Post;
