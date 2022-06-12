export const scrollToTop = () => {
  window.scroll({
    left: 0,
    top: 0,
    behavior: 'smooth'
  });
}

export const getDimensions = (element: any) => {
  const { height } = element ? element.getBoundingClientRect(): 0;
  const offsetTop = element?.offsetTop || 0;
  const offsetBottom = offsetTop + height;

  return {
    height,
    offsetTop,
    offsetBottom,
  };
};

export const scrollTo = (element: any, block='start') => {
  element.scrollIntoView({
    behavior: 'smooth',
    block: block || 'center',
  });
};