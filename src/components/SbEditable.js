import { cloneElement, useEffect, useState } from 'react';

const SbEditable = ({ content, children }) => {
  const [options, setOptions] = useState(null);
  useEffect(() => {
    // search editable content
    if (typeof content._editable === 'undefined' || (window && window.location === window.parent.location)) {
      return;
    }
    setOptions(JSON.parse(content._editable.replace('<!--#storyblok#', '').replace('-->', '')));
  }, [content]);
  // if options
  if (options) {
    // clone and add new props for editing
    return cloneElement(children, {
      className: 'storyblok__outline',
      'data-blok-c': JSON.stringify(options),
      'data-blok-uid': `${options.id}-${options.uid}`
    });
  } else {
    return children;
  }
};

export default SbEditable;
