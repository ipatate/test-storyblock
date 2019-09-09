import React, { useEffect, useState } from 'react';

const SbEditable = props => {
  const [options, setOptions] = useState(null);
  useEffect(() => {
    console.log(props.content._editable);

    // search editable content
    // || (window && window.location === window.parent.location)
    if (typeof props.content._editable === 'undefined') {
      return;
    }
    setOptions(JSON.parse(props.content._editable.replace('<!--#storyblok#', '').replace('-->', '')));
  }, [props.content]);

  if (options) {
    return (
      <div
        className={'storyblok__outline'}
        data-blok-c={JSON.stringify(options)}
        data-blok-uid={`${options.id}-${options.uid}`}
      >
        {props.children}
      </div>
    );
  } else {
    return props.children;
  }
};

export default SbEditable;
