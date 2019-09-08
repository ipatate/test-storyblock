import React, { useEffect, useState } from 'react';
import SbEditable from 'storyblok-react';
// import Components from './components.js';
import config from '../../gatsby-config';

const loadStoryblokBridge = function(cb) {
  let sbConfigs = config.plugins.filter(item => {
    return item.resolve === 'gatsby-source-storyblok';
  });
  let sbConfig = sbConfigs.length > 0 ? sbConfigs[0] : {};
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `//app.storyblok.com/f/storyblok-latest.js?t=${sbConfig.options.accessToken}`;
  script.onload = cb;
  document.getElementsByTagName('head')[0].appendChild(script);
};

const getParam = function(val) {
  var result = '';
  var tmp = [];
  window.location.search
    .substr(1)
    .split('&')
    .forEach(function(item) {
      tmp = item.split('=');
      if (tmp[0] === val) {
        result = decodeURIComponent(tmp[1]);
      }
    });

  return result;
};

const Post = props => {
  const { story } = props;

  const [_story, setStory] = useState(story);
  // init storyblok
  useEffect(() => {
    const _storyblok = getParam('_storyblok');
    if (_storyblok !== undefined && _storyblok !== '') {
      loadStoryblokBridge(() => {
        initStoryblokEvents();
      });
    }
  }, []);

  const loadStory = payload => {
    window.storyblok.get(
      {
        slug: getParam('_storyblok'),
        version: 'draft'
      },
      data => {
        setStory({ ...data.story, ...{ id: payload.storyId } });
      }
    );
  };

  const initStoryblokEvents = () => {
    let sb = window.storyblok;

    loadStory({ storyId: getParam('_storyblok') });

    sb.on(['change', 'published'], payload => {
      loadStory(payload);
    });

    sb.on('input', payload => {
      console.log(payload.story.id, _story.id);

      if (_story) {
        payload.story.content = sb.addComments(payload.story.content, payload.story.id);
        setStory(payload.story);
      }
    });

    sb.pingEditor(() => {
      if (sb.inEditor) {
        sb.enterEditmode();
      }
    });
  };
  const { Title, block } = _story.content;
  return (
    <div>
      <SbEditable content={_story.content}>
        <h1>{Title}</h1>
      </SbEditable>
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
        } else if (b.component === 'Media') {
          return (
            <SbEditable content={b}>
              <img src={b.Media} alt="" />
            </SbEditable>
          );
        }
        return null;
      })}
    </div>
  );
};

export default Post;
