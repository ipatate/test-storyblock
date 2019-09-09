import React, { useEffect, useState } from 'react';

const SbEditable = props => {
  const [options, setOptions] = useState(null);
  useEffect(() => {
    // search editable content
    // Bug with cross domain origin with: "|| (window && window.location === window.parent.location)"
    if (typeof props.content._editable === 'undefined') {
      return;
    }
    setOptions(JSON.parse(props.content._editable.replace('<!--#storyblok#', '').replace('-->', '')));
  }, [props.content]);
  const { children } = props;
  if (options) {
    // clone and add new props
    return React.cloneElement(children, {
      className: 'storyblok__outline',
      'data-blok-c': JSON.stringify(options),
      'data-blok-uid': `${options.id}-${options.uid}`
    });
  } else {
    return children;
  }
};

export default SbEditable;
