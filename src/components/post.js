import React, { useEffect } from 'react';
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
  const { blok } = props;
  const { Title, block } = blok;

  useEffect(
    () =>
      loadStoryblokBridge(() => {
        initStoryblokEvents();
      }),
    []
  );

  const loadStory = payload => {
    window.storyblok.get(
      {
        slug: getParam('path'),
        version: 'draft'
      },
      data => {
        console.log(data);

        // this.setState({ story: data.story });
        // this.loadGlovalNavi(data.story.lang);
      }
    );
  };

  const initStoryblokEvents = () => {
    console.log(getParam('path'));

    loadStory({ storyId: getParam('path') });

    let sb = window.storyblok;

    sb.on(['change', 'published'], payload => {
      loadStory(payload);
    });

    sb.on('input', payload => {
      if (this.state.story && payload.story.id === this.state.story.id) {
        payload.story.content = sb.addComments(payload.story.content, payload.story.id);
        this.setState({ story: payload.story });
      }
    });

    sb.pingEditor(() => {
      if (sb.inEditor) {
        sb.enterEditmode();
      }
    });
  };
  return (
    <SbEditable content={blok}>
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
    </SbEditable>
  );
};

export default Post;
